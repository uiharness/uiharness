import { DEFAULT } from './constants';
import { Settings } from '../settings';
import { BundleTarget, IParcelBuildConfig } from '../types';
import { log, value, exec } from './libs';
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
 * Logs that an operation cannot run because the required
 * configuration is not present with the YAML.
 */
export function logNoConfig(args: { target: BundleTarget }) {
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
    log.info.gray(`                  ${formatPath(entry.renderer)}`);
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
  const entry = web.entry.code;
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
export function toBundlerArgs(data: IParcelBuildConfig = {}) {
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
