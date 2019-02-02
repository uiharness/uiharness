import { Settings } from '../settings';
import { IParcelBuildConfig, BundleTarget } from '../types';
import { command } from './command';
import { log, value } from './libs';
import * as logging from './logging';

const defaultValue = value.defaultValue;

/**
 * Logs common information about the module.
 */
export function logInfo(args: {
  settings: Settings;
  port?: boolean | number;
  target: BundleTarget;
}) {
  const { target, settings, port } = args;

  switch (target) {
    case 'electron':
      return logElectronInfo({ settings, port });

    case 'web':
      return logWebInfo({ settings, port });

    default:
      log.warn(`😩  The target "${log.yellow(target)}" is not supported.`);
  }
}

/**
 * Logs common information about the module.
 */
export function logElectronInfo(args: {
  settings: Settings;
  port?: boolean | number;
}) {
  const { settings } = args;
  const pkg = settings.package;
  const formatPath = (path: string) => logging.formatPath(path, true);

  const electron = settings.electron;
  const entry = electron.entry;
  const showPort = Boolean(args.port);
  const port = typeof args.port === 'number' ? args.port : electron.port;

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
 * Logs common information about the module.
 */
export function logWebInfo(args: {
  settings: Settings;
  port?: boolean | number;
}) {
  const { settings } = args;
  const pkg = settings.package;
  const formatPath = (path: string) => logging.formatPath(path, true);

  const web = settings.web;
  const entry = web.entry.code;
  const showPort = Boolean(args.port);
  const port = typeof args.port === 'number' ? args.port : web.port;

  log.info.gray(`package:          ${log.magenta(pkg.name)}`);
  log.info.gray(`• version:        ${pkg.version}`);
  if (showPort) {
    log.info.gray(`• port:           ${port}`);
  }
  if (entry) {
    log.info.gray(`• entry:          ${formatPath(entry)}`);
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
  const logLevel = value.defaultValue(data.logLevel, 1);

  // Build command-line arguments.
  // See:
  //    https://parceljs.org/cli.html
  const cmd = command()
    .add('--no-source-maps', sourcemaps)
    .add('--experimental-scope-hoisting', treeshake)
    .add(`--log-level ${logLevel}`);

  // Finish up.
  return { sourcemaps, treeshake, cmd: cmd.toString() };
}
