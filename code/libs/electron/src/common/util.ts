import { log, logging, value } from './libs';
import { Settings } from '../settings';
import { IParcelBuildConfig } from '../types';
import { command } from './command';

const defaultValue = value.defaultValue;

/**
 * Logs common information about the module.
 */
export function logInfo(args: { settings: Settings; port?: boolean | number }) {
  const { settings } = args;
  const pkg = settings.package;
  const formatPath = (path: string) => logging.formatPath(path, true);

  const showPort = Boolean(args.port);
  const port =
    typeof args.port === 'number' ? args.port : settings.electron.port;

  const entry = settings.electron.entry;

  log.info.gray(`package:          ${log.magenta(pkg.name)}`);
  log.info.gray(`• version:        ${pkg.version}`);
  if (showPort) {
    log.info.gray(`• port:           ${port}`);
  }
  if (entry.main) {
    log.info.gray(`• entry:          ${formatPath(entry.main)}`);
    log.info.gray(`                  ${formatPath(entry.renderer)}`);
  }

  log.info();
}

/**
 * Extract JS bundler args (Parcel-JS) or deaults.
 */
export function toBundlerArgs(data: IParcelBuildConfig = {}) {
  // Default values.
  const sourcemaps = defaultValue(data.sourcemaps, true);
  const treeshake = defaultValue(data.treeshake, false);

  // Build command-line arguments.
  // See:
  //    https://parceljs.org/cli.html
  let cmd = '';
  cmd = sourcemaps === false ? `${cmd} --no-source-maps` : cmd;
  cmd = treeshake ? `${cmd} --experimental-scope-hoisting` : cmd;

  console.log(`\nTODO 🐷   use command()\n`);
  console.log('have boolean flag on `add` commands to avoid ternary');

  // Finish up.
  return { sourcemaps, treeshake, cmd };
}
