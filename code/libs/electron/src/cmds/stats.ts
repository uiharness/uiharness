import { constants, fs, fsPath, log, logging, logInfo, value } from '../common';
import { Settings } from '../settings';

/**
 * Prints stats about the bundle.
 */
export async function stats(args: {
  settings: Settings;
  moduleInfo?: boolean;
  prod?: boolean;
}) {
  const { settings, prod } = args;
  const ELECTRON = constants.PATH.ELECTRON;
  const moduleInfo = value.defaultValue(args.moduleInfo, true);

  if (moduleInfo) {
    logInfo({ settings, port: false });
  }

  await logDir(ELECTRON.MAIN.OUT_DIR);

  if (prod === undefined || prod === false) {
    await logDir(ELECTRON.RENDERER.OUT_DIR.DEV);
  }

  if (prod === undefined || prod === true) {
    await logDir(ELECTRON.RENDERER.OUT_DIR.PROD);
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

  log.info('', logging.formatPath(dir, true));
  res.table.log();
  log.info();
}
