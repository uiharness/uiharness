import { constants, log, logging, logInfo, Settings, value } from '../common';

/**
 * Prints stats about the bundle.
 */
export async function stats(args: {
  settings: Settings;
  moduleInfo?: boolean;
}) {
  const { settings } = args;
  const moduleInfo = value.defaultValue(args.moduleInfo, true);
  if (moduleInfo) {
    logInfo({ settings, port: false });
  }

  const dir = constants.PATH.OUT_DIR;
  const res = await logging.fileStatsTable({ dir });
  if (res.isEmpty) {
    log.info(`👋   Looks like there is no distribution bundle to analyze.`);
    log.info(`    Run ${log.cyan('yarn dist')}`);
    log.info();
    return;
  }

  log.info(logging.formatPath(dir, true));
  res.table.log();
  log.info();
}
