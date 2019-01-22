import {
  filesize,
  fs,
  fsPath,
  log,
  logInfo,
  NpmPackage,
  R,
  Settings,
  value,
  constants,
} from '../common';

/**
 * Prints stats about the bundle.
 */
export async function stats(args: {
  settings: Settings;
  pkg: NpmPackage;
  moduleInfo?: boolean;
}) {
  const { settings, pkg } = args;
  const moduleInfo = value.defaultValue(args.moduleInfo, true);
  if (moduleInfo) {
    logInfo({ settings, pkg });
  }

  const dir = fsPath.resolve(constants.PATH.OUT_DIR);
  const getPaths = () => {
    return fs.pathExistsSync(dir)
      ? fs.readdirSync(dir).map(path => fsPath.join(dir, path))
      : [];
  };

  const paths = getPaths();
  if (paths.length === 0) {
    log.info(`👋   Looks like there is no distribution bundle to analyze.`);
    log.info(`    Run ${log.cyan('yarn dist')}`);
    log.info();
    return;
  }

  let sizes = paths
    .filter(path => !path.endsWith('.map'))
    .filter(path => !path.endsWith('.html'))
    .map(path => {
      const stats = fs.statSync(path);
      const bytes = stats.size;
      const size = filesize(bytes);
      return { path, bytes, size };
    });
  sizes = R.sortBy(R.prop('bytes'), sizes);
  sizes.reverse();

  const head = ['File', 'Size'].map(label => log.gray(label));
  const table = log.table({ head });
  sizes.forEach(e => {
    let file = fsPath.basename(e.path);
    file = file.endsWith('.js') ? log.yellow(file) : file;
    file = file.endsWith('.css') ? log.cyan(file) : file;
    table.add([file, e.size]);
  });

  log.info.gray(`${dir}`);
  table.log();
  log.info();
}
