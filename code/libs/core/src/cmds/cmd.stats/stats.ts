import {
  BundleTarget,
  constants,
  fs,
  fsPath,
  log,
  logging,
} from '../../common';
import { Settings } from '../../settings';

const WEB = constants.PATH.WEB;

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
  const path = settings.electron.path;

  if (targets.includes('electron')) {
    await logDir(path.main.out.dir);
    if (prod === undefined || prod === false) {
      await logDir(path.renderer.out.dir.dev);
    }
    if (prod === undefined || prod === true) {
      await logDir(path.renderer.out.dir.prod);
    }
  }

  if (targets.includes('web')) {
    if (prod === undefined || prod === false) {
      await logDir(WEB.OUT_DIR.DEV);
    }
    if (prod === undefined || prod === true) {
      await logDir(WEB.OUT_DIR.PROD);
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
