import { constants, fsPath, log, ParcelBundler } from './libs';
import { NpmPackage, Settings } from './Settings';

const { PATH } = constants;

/**
 * Creates a new Parcel bundler.
 * Options:
 *    https://parceljs.org/api.html
 */
export function createParcelBundler(settings: Settings) {
  const entry = fsPath.resolve(PATH.ENTRY);
  const args = settings.buildArgs;
  return new ParcelBundler(entry, {
    target: 'browser',
    sourceMaps: args.sourcemaps,
    scopeHoist: args.treeshake,
    cacheDir: PATH.CACHE_DIR,
    outDir: PATH.OUT_DIR,
  });
}

/**
 * Logs common information about the module.
 */
export function logInfo(args: {
  settings: Settings;
  pkg: NpmPackage;
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

  const showPort = Boolean(args.port);
  const port = typeof args.port === 'number' ? args.port : settings.port;

  log.info();
  log.info.gray(`package: ${log.magenta(pkg.name)}`);
  log.info.gray(`version: ${pkg.version}`);
  log.info.gray(`entry:   ${formatPath(PATH.ENTRY)}`);
  if (showPort) {
    log.info.gray(`port:    ${log.yellow(port)}`);
  }
  log.info();
}
