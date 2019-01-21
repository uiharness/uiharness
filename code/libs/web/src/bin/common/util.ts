import { Package, ParcelBundler, fsPath, log } from './libs';
import { Settings } from './Settings';

/**
 * Creates a new Parcel bundler.
 */
export function createParcelBundler(settings: Settings) {
  const entryFiles = settings.entries.map(e => e.html.absolute);
  const args = settings.buildArgs;
  return new ParcelBundler(entryFiles, {
    sourceMaps: args.sourcemaps,
    scopeHoist: args.treeshake,
    target: 'browser',
  });
}

/**
 * Logs common information about the module.
 */
export function logInfo(args: {
  settings: Settings;
  pkg: Package;
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
  entryFiles.slice(1).forEach(path => {
    log.info.gray(`         ${formatPath(path)}`);
  });
  if (showPort) {
    log.info.gray(`port:    ${log.yellow(port)}`);
  }
  log.info();
}
