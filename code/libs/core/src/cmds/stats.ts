import { BundleTarget, constants, fs, fsPath, log, logging } from '../common';
import { Settings } from '../settings';

const ELECTRON = constants.PATH.ELECTRON;
const WEB = constants.PATH.WEB;

/**
 * Prints stats about the bundle.
 */
export async function stats(args: {
  settings: Settings;
  prod?: boolean;
  target: BundleTarget | BundleTarget[];
}) {
  const { prod } = args;
  const targets = Array.isArray(args.target) ? args.target : [args.target];

  if (targets.includes('electron')) {
    await logDir(ELECTRON.MAIN.OUT_DIR);
    if (prod === undefined || prod === false) {
      await logDir(ELECTRON.RENDERER.OUT_DIR.DEV);
    }
    if (prod === undefined || prod === true) {
      await logDir(ELECTRON.RENDERER.OUT_DIR.PROD);
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
