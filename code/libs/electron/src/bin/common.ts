import { config, fs, fsPath, log } from '@uiharness/core/lib/server';

export * from '../common';
export { log, fs, fsPath, config };

/**
 * Logs common information about the module.
 */
export function logInfo(args: {
  settings: config.Settings;
  pkg: config.Package;
  port?: boolean | number;
}) {
  const { settings, pkg } = args;
  // const ROOT_DIR = fsPath.resolve('.');

  // const formatPath = (path: string) => {
  //   let dir = fsPath.dirname(path);
  //   dir = dir.substr(ROOT_DIR.length);
  //   const file = fsPath.basename(path);
  //   return `${dir}/${log.cyan(file)}`;
  // };

  // const entryFiles = settings.entries.map(e => e.html.absolute);
  const showPort = Boolean(args.port);
  const port = typeof args.port === 'number' ? args.port : settings.port;

  log.info();
  log.info.gray(`package: ${log.magenta(pkg.name)}`);
  log.info.gray(`version: ${pkg.version}`);
  if (showPort) {
    log.info.gray(`port:    ${log.yellow(port)}`);
  }
  log.info();
}
