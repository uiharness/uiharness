import { BundleTarget, fs, log, logging } from '../../common';
import { Settings } from '../../settings';

/**
 * Prints stats about the bundle.
 */
export async function stats(args: {
  settings: Settings;
  prod?: boolean;
  target: BundleTarget | BundleTarget[];
}) {
  const { prod, settings } = args;
  const targets = Array.isArray(args.target) ? args.target : [args.target];
  const base = settings.path.tmp.dir;

  const show = {
    dev: prod === undefined || prod === false,
    prod: prod === undefined || prod === true,
  };

  if (targets.includes('electron')) {
    const path = settings.electron.path;

    if (show.dev) {
      await logDir(base, path.main.out.dir.dev);
      await logDir(base, path.renderer.out.dir.dev);
    }
    if (show.prod) {
      await logDir(base, path.main.out.dir.prod);
      await logDir(base, path.renderer.out.dir.prod);
    }
  }

  if (targets.includes('web')) {
    const path = settings.web.path;
    if (show.dev) {
      await logDir(base, path.out.dir.dev);
    }
    if (show.prod) {
      await logDir(base, path.out.dir.prod);
    }
  }
}

/**
 * [Internal]
 */
async function logDir(base: string, dir: string) {
  dir = fs.resolve(fs.join(base, dir));

  if (!(await fs.pathExists(dir))) {
    return;
  }

  const res = await logging.fileStatsTable({ dir });
  const total = res.total;

  log.info.gray(`${logging.formatPath(dir, true)} (${total.size})`);
  res.table.log();
  log.info();
}
