import { config, fs, fsPath, log } from '@uiharness/core/lib/server';
import * as filesize from 'filesize';
import * as Bundler from 'parcel-bundler';

export * from '../common';
export { filesize, log, fs, fsPath, config };

/**
 * Creates a new Parcel bundler.
 */
export function createBundler(settings: config.Settings) {
  const entryFiles = settings.entries.map(e => e.html.absolute);
  return new Bundler(entryFiles, {
    ...settings.buildArgs,
    target: 'browser',
  });
}

/**
 * Logs common information about the module.
 */
export function logInfo(args: {
  settings: config.Settings;
  pkg: config.Package;
  port?: boolean | number;
}) {
  const { settings, pkg } = args;
  const ROOT_DIR = fsPath.resolve('.');

  const formatPath = (path: string) => {
    let dir = fsPath.dirname(path);
    dir = dir.substr(ROOT_DIR.length);
    const file = fsPath.basename(path);
    return `${dir}/${log.cyan(file)}`;
  };

  const entryFiles = settings.entries.map(e => e.html.absolute);
  const showPort = Boolean(args.port);
  const port = typeof args.port === 'number' ? args.port : settings.port;

  log.info();
  log.info.gray(`package: ${log.magenta(pkg.name)}`);
  log.info.gray(`version: ${pkg.version}`);
  log.info.gray(`entry:   ${formatPath(entryFiles[0])}`);
  if (showPort) {
    log.info.gray(`port:    ${log.yellow(port)}`);
  }
  entryFiles.slice(1).forEach(path => {
    log.info.gray(`         ${formatPath(path)}`);
  });
  log.info();
}
