import { BundleTarget, fs, fsPath, log, logging } from '../../common';
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

  if (targets.includes('electron')) {
    const path = settings.electron.path;

    await logDir(path.main.out.dir);
    if (prod === undefined || prod === false) {
      await logDir(path.renderer.out.dir.dev);
    }
    if (prod === undefined || prod === true) {
      await logDir(path.renderer.out.dir.prod);
    }
  }

  if (targets.includes('web')) {
    const path = settings.web.path;
    if (prod === undefined || prod === false) {
      await logDir(path.out.dir.dev);
    }
    if (prod === undefined || prod === true) {
      await logDir(path.out.dir.prod);
    }
  }
}

/**
 * internal
 */
async function logDir(dir: string) {
  dir = fsPath.resolve(dir);
  if (!(await fs.pathExists(dir))) {
    return;
  }

  const res = await logging.fileStatsTable({ dir });
  const total = res.total;

  log.info.gray(`${logging.formatPath(dir, true)} (${total.size})`);
  res.table.log();
  log.info();
}
