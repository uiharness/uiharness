#!/usr/bin/env node
const server = require('@uiharness/core/lib/server');
const { fsPath, log } = require('@uiharness/core/lib/server/libs');

export const NAME = 'UIHaraness CLI';
const PKG = require(fsPath.join(__dirname, '../../package.json'));

/**
 * Makes the script crash on unhandled rejections instead of silently
 * ignoring them. In the future, promise rejections that are not handled will
 * terminate the Node.js process with a non-zero exit code.
 */
process.on('unhandledRejection', err => {
  throw err;
});

/**
 *
 * Interpress command-line args.
 */
const args = process.argv.slice(2);
const scriptIndex = args.findIndex(
  x => x === 'start' || x === 'dist' || x === 'dist',
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

switch (script) {
  case 'start':
    server.start();
    break;

  case 'dist':
    server.dist();
    break;

  case 'serve':
    server.serve();
    break;

  default:
    log.info(`Unknown script "${script}".`);
    log.info(`Perhaps you need to update ${PKG.name}?`);
    break;
}
