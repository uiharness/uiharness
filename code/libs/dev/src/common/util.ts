import { DEFAULT } from './constants';
import { Settings } from '../settings';
import { log, value, exec, fs } from './libs';
import * as logging from './logging';
import * as t from '../types';

const defaultValue = value.defaultValue;

/**
 * Logs common information about the module.
 */
export function logInfo(args: {
  settings: Settings;
  port?: boolean | number;
  target: t.BundleTarget;
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
 * Logs that an operation cannot run because the required
 * configuration is not present with the YAML.
 */
export function logNoConfig(args: { target: t.BundleTarget }) {
  const { target } = args;
  let msg = '';
  msg += `😵  The "${log.yellow(target)}" configuration `;
  msg += `does not exist in ${log.cyan('uiharness.yml')}.`;
  log.info(msg);
  log.info();
  return;
}

/**
 * Logs common information about the module.
 */
export function logElectronInfo(args: { settings: Settings; port?: boolean | number }) {
  const { settings } = args;
  const pkg = settings.package;
  const formatPath = (path: string) => logging.formatPath(path, true);

  const electron = settings.electron;
  const entry = electron.entry;
  const showPort = Boolean(args.port);
  const port = typeof args.port === 'number' ? args.port : electron.port;

  log.info.gray(`package:          ${log.magenta(pkg.name)}`);
  log.info.gray(`• version:        ${pkg.version}`);
  log.info.gray(`• target:         electron`);
  if (showPort) {
    log.info.gray(`• port:           ${port}`);
  }
  if (entry.main) {
    log.info.gray(`• entry:          ${formatPath(entry.main)}`);
    Object.keys(entry.renderer).forEach(key => {
      const code = entry.renderer[key].path;
      log.info.gray(`                  ${formatPath(code)}`);
    });
  }
  log.info();
}

/**
 * Logs common information about the module.
 */
export function logWebInfo(args: { settings: Settings; port?: boolean | number }) {
  const { settings } = args;
  const pkg = settings.package;
  const formatPath = (path: string) => logging.formatPath(path, true);

  const web = settings.web;
  const entry = web.entry.default.code;
  const showPort = Boolean(args.port);
  const port = typeof args.port === 'number' ? args.port : web.port;

  log.info.gray(`package:          ${log.magenta(pkg.name)}`);
  log.info.gray(`• version:        ${pkg.version}`);
  log.info.gray(`• target:         web browser`);
  if (showPort) {
    log.info.gray(`• port:           ${port}`);
  }
  if (entry) {
    log.info.gray(`• entry:          ${formatPath(entry)}`);
  }
  log.info();
}

/**
 * Extract JS bundler args (Parcel-JS) or defaults.
 */
export function toBundlerArgs(data: t.IParcelBuildConfig = {}) {
  // Default values.
  const sourcemaps = defaultValue(data.sourcemaps, true);
  const treeshake = defaultValue(data.treeshake, false);
  const logLevel = value.defaultValue(data.logLevel, DEFAULT.LOG_LEVEL);

  // Build command-line arguments.
  // See:
  //    https://parceljs.org/cli.html
  const cmd = exec.cmd
    .create()
    .add('--no-source-maps', sourcemaps)
    .add('--experimental-scope-hoisting', treeshake)
    .add(`--log-level ${logLevel}`);

  // Finish up.
  return { sourcemaps, treeshake, cmd: cmd.toString() };
}

/**
 * Retrieves [tsconfig.json] files, and variants. from the given directory.
 */
export async function getTSConfigFiles(dir: string) {
  dir = fs.resolve(dir);
  const paths = (await fs.readdir(dir))
    .filter(name => name.endsWith('.json'))
    .filter(name => name.includes('tsconfig'))
    .map(name => fs.join(dir, name));
  return Promise.all(
    paths.map(async path => {
      const json = await fs.file.loadAndParse<t.ITSConfig>(path);
      const include = json.include || [];
      const compilerOptions = json.compilerOptions || {};
      const outDir = compilerOptions.outDir || '';
      return { path, dir, outDir, json: { ...json, include, compilerOptions } };
    }),
  );
}
