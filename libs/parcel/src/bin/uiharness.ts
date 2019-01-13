#!/usr/bin/env node
const server = require('@uiharness/parcel/lib/server');
const valueUtil = require('@tdb/util/lib').value;
const { fsPath, log } = require('@uiharness/parcel/lib/server/common/libs');
const PKG = require(fsPath.join(__dirname, '../../package.json'));

import { IBuildArgs } from '../types';

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

const TARGETS = ['browser', 'node', 'electron'];

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

const flags = args
  .filter(arg => arg.startsWith('-'))
  .map(arg => arg.replace(/^-*/, ''))
  .map(arg => {
    const parts = arg.split('=');
    const key = parts[0];
    const value: string | boolean | undefined = valueUtil.toType(parts[1]);
    return { key, value };
  });

const findFlag = (key: string, defaultValue: boolean) => {
  const arg = flags.find(arg => arg.key === key);
  return arg === undefined ? defaultValue : Boolean(arg.value);
};

const findArg = (key: string, defaultValue: string) => {
  const arg = flags.find(arg => arg.key === key);
  return arg === undefined ? defaultValue : arg.value;
};

const buildArgs = (): IBuildArgs => {
  const treeshake = findFlag('treeshake', false);
  const sourcemaps = findFlag('sourcemaps', true);
  let target = findArg('target', 'browser') as any;
  target = target && TARGETS.includes(target as string) ? target : undefined;
  return { treeshake, sourcemaps, target };
};

switch (script) {
  case 'init':
    server.init();
    break;

  case 'debug:reset':
    server.debugReset();
    break;

  case 'start':
    server.start(buildArgs());
    break;

  case 'bundle':
    server.bundle(buildArgs());
    break;

  case 'stats':
    server.stats();
    break;

  default:
    log.info(`Unknown script "${script}".`);
    log.info(`Perhaps you need to update ${PKG.name}?`);
    break;
}
