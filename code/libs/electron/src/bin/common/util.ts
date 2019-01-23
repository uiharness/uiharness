import { fsPath, log } from './libs';
import { Settings } from './Settings';

/**
 * Logs common information about the module.
 */
export function logInfo(args: {
  settings: Settings;
  port?: boolean | number;
  mainEntry?: string;
}) {
  const { settings, mainEntry } = args;
  const pkg = settings.package;
  const ROOT_DIR = fsPath.resolve('.');
  const formatPath = (path: string) => formatDisplayPath(path, ROOT_DIR);

  const showPort = Boolean(args.port);
  const port = typeof args.port === 'number' ? args.port : settings.port;

  log.info();
  log.info.gray(`package: ${log.magenta(pkg.name)}`);
  log.info.gray(`version: ${pkg.version}`);
  log.info.gray(`main:    ${formatPath(mainEntry || '')}`);
  if (showPort) {
    log.info.gray(`port:    ${log.yellow(port)}`);
  }
  log.info();
}

/**
 * Formats a path for display.
 */
export function formatDisplayPath(path: string, rootDir?: string) {
  path = fsPath.resolve(path);
  let dir = fsPath.dirname(path);
  dir = rootDir ? dir.substr(rootDir.length) : dir;
  const file = fsPath.basename(path);
  return log.gray(`${dir}/${log.cyan(file)}`);
}
