import { log, fsPath } from './libs';
import { Settings, Package } from './Settings';

/**
 * Logs common information about the module.
 */
export function logInfo(args: {
  settings: Settings;
  pkg: Package;
  port?: boolean | number;
  mainEntry?: string;
}) {
  const { settings, pkg, mainEntry } = args;
  const ROOT_DIR = fsPath.resolve('.');

  const formatPath = (path: string) => {
    let dir = fsPath.dirname(path);
    dir = dir.substr(ROOT_DIR.length);
    const file = fsPath.basename(path);
    return `${dir}/${log.cyan(file)}`;
  };

  // const entryFiles = settings.entries.map(e => e.html.absolute);
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
