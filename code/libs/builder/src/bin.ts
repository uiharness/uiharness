#!/usr/bin/env node
const server = require('@uiharness/builder/lib/server');
const valueUtil = require('@tdb/util/lib').value;
const { fsPath, log } = require('@uiharness/builder/lib/server/common/libs');
const PKG = require(fsPath.join(__dirname, '../package.json'));

/**
 * Makes the script crash on unhandled rejections instead of silently
 * ignoring them. In the future, promise rejections that are not handled will
 * terminate the Node.js process with a non-zero exit code.
 */
process.on('unhandledRejection', err => {
  throw err;
});

const COMMANDS = {
  INIT: 'init',
  START: 'start',
  BUNDLE: 'bundle',
  STATS: 'status',
  DEBUG_RESET: 'debug:reset',
};

/**
 *
 * Interpress command-line args.
 */
const args = process.argv.slice(2);
const scriptIndex = args.findIndex(x =>
  Object.keys(COMMANDS)
    .map(key => COMMANDS[key])
    .includes(x),
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

switch (script) {
  case 'init':
    server.init();
    break;

  case 'debug:reset':
    server.debugReset();
    break;

  case 'start':
    server.start();
    break;

  case 'bundle':
    server.bundle();
    break;

  case 'stats':
    server.stats();
    break;

  default:
    log.info(`Unknown script "${script}".`);
    log.info(`Perhaps you need to update ${PKG.name}?`);
    break;
}
