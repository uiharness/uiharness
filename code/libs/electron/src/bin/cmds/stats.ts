import {
  constants,
  log,
  logging,
  logInfo,
  Settings,
  value,
  fsPath,
  fs,
} from '../common';

/**
 * Prints stats about the bundle.
 */
export async function stats(args: {
  settings: Settings;
  moduleInfo?: boolean;
  isProd?: boolean;
}) {
  const { settings, isProd } = args;
  const moduleInfo = value.defaultValue(args.moduleInfo, true);
  if (moduleInfo) {
    logInfo({ settings, port: false });
  }

  await logDir(constants.PATH.MAIN.OUT_DIR);

  if (isProd === undefined || isProd === false) {
    await logDir(constants.PATH.RENDERER.OUT_DIR.DEV);
  }

  if (isProd === undefined || isProd === true) {
    await logDir(constants.PATH.RENDERER.OUT_DIR.PROD);
  }

  log.info();
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
