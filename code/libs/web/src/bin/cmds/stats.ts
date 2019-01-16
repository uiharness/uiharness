import {
  config,
  filesize,
  fs,
  fsPath,
  log,
  logInfo,
  R,
  value,
} from '../common';

/**
 * Prints stats about the bundle.
 */
export async function stats(args: {
  settings: config.Settings;
  pkg: config.Package;
  moduleInfo?: boolean;
}) {
  const { settings, pkg } = args;
  const moduleInfo = value.defaultValue(args.moduleInfo, true);
  if (moduleInfo) {
    logInfo({ settings, pkg });
  }

  const dir = fsPath.resolve('./dist');
  const getPaths = () => {
    return fs.pathExistsSync(dir)
      ? fs.readdirSync(dir).map(path => fsPath.resolve(`./dist/${path}`))
      : [];
  };

  const paths = getPaths();
  if (paths.length === 0) {
    log.info(`👋   Looks like there is no bundle to analyze.`);
    log.info(`    Run ${log.cyan('yarn bundle')}`);
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
