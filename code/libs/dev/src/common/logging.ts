import { R, fs, fsPath, log, filesize } from './libs';

/**
 * Formats a path to be a display path.
 */
export function formatPath(path: string, rootDir?: string | boolean) {
  path = fsPath.resolve(path);
  rootDir = rootDir === true ? fsPath.resolve('.') : rootDir;
  let dir = fsPath.dirname(path);
  dir = typeof rootDir === 'string' ? dir.substr(rootDir.length) : dir;
  const file = fsPath.basename(path);
  return log.gray(`${dir}/${log.cyan(file)}`);
}

/**
 * Logs file stats for the given directory
 */
export async function fileStatsTable(args: {
  dir: string;
  showHeader?: boolean;
}) {
  const { showHeader = false } = args;
  const dir = fsPath.resolve(args.dir);

  const toSize = (bytes: number) => filesize(bytes, { round: 0, spacer: '' });

  const getPaths = (dir: string) => {
    return fs.pathExistsSync(dir)
      ? fs.readdirSync(dir).map(path => fsPath.join(dir, path))
      : [];
  };
  const paths = getPaths(dir);

  let sizes = paths
    .filter(path => !path.endsWith('.map'))
    .filter(path => !path.endsWith('.html'))
    .map(path => {
      const stats = fs.statSync(path);
      const bytes = stats.size;
      const size = toSize(bytes);
      return { path, bytes, size };
    });
  sizes = R.sortBy(R.prop('bytes'), sizes);
  sizes.reverse();

  const head = showHeader
    ? ['file', 'size'].map(label => log.gray(label))
    : undefined;
  const table = log.table({ head });
  sizes.forEach(e => {
    let file = fsPath.basename(e.path);
    if (file.endsWith('.js')) {
      file = log.yellow(file);
    } else if (file.endsWith('.css')) {
      file = log.cyan(file);
    } else {
      file = log.magenta(file);
    }
    table.add([file, e.size]);
  });

  const totalBytes = sizes.reduce((acc, next) => acc + next.bytes, 0);
  const total = {
    bytes: totalBytes,
    size: toSize(totalBytes),
  };

  return { table, dir, paths, isEmpty: paths.length === 0, sizes, total };
}
