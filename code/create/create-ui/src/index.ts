import { log } from '@tdb/log/lib/server';

export function init() {
  log.info();
  log.info(`👋  Please use ${log.cyan('yarn create uiharness')} instead.`);
  log.info();
}
