import {
  constants,
  fs,
  fsPath,
  log,
  logging,
  logInfo,
  value,
  BundleTarget,
} from '../common';
import { Settings } from '../settings';

const ELECTRON = constants.PATH.ELECTRON;
const WEB = constants.PATH.WEB;

/**
 * Prints stats about the bundle.
 */
export async function stats(args: {
  settings: Settings;
  moduleInfo?: boolean;
  prod?: boolean;
  target: BundleTarget | BundleTarget[];
}) {
  const { settings, prod } = args;
  const moduleInfo = value.defaultValue(args.moduleInfo, true);
  const targets = Array.isArray(args.target) ? args.target : [args.target];

  if (moduleInfo) {
    logInfo({ settings, port: false });
  }

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

  console.log(`\nTODO 🐷   total file size - log on end of directory path \n`);

  const res = await logging.fileStatsTable({ dir });

  log.info('', logging.formatPath(dir, true));
  res.table.log();
  log.info();
}
