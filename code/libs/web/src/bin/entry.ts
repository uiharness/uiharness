#!/usr/bin/env node
import * as yargs from 'yargs';

import * as cmds from './cmds';
import { config, constants, log } from './common';
import { Settings } from './Settings';

/**
 * Makes the script crash on unhandled rejections instead of silently
 * ignoring them. In the future, promise rejections that are not handled will
 * terminate the Node.js process with a non-zero exit code.
 */
process.on('unhandledRejection', err => {
  throw err;
});

const CMD = {
  INIT: 'init',
  START: 'start',
  BUNDLE: 'bundle',
  STATS: 'stats',
};
const CMDS = Object.keys(CMD).map(key => CMD[key]);

const settings = Settings.create();
const pkg = config.Package.create();

/**
 * Cheat sheet.
 * https://devhints.io/yargs
 */
const SCRIPT = log.magenta('uiharness');
const COMMAND = log.cyan('<command>');
const OPTIONS = log.gray('[options]');
const program = yargs
  .scriptName('')
  .usage(`${'Usage:'} ${SCRIPT} ${COMMAND} ${OPTIONS}`)

  /**
   * `init`
   */
  .command(
    [CMD.INIT],
    'Initialize the module with default files.',
    e =>
      e
        .option('force', {
          alias: 'f',
          describe: 'Overwrite existing files.',
          boolean: true,
        })
        .option('reset', {
          alias: 'r',
          describe: 'Deletes all files created by a previous `init`.',
          boolean: true,
        }),
    e => {
      const { force, reset } = e;
      cmds.init({ settings, pkg, force, reset });
    },
  )

  /**
   * `start`
   */
  .command(
    [CMD.START],
    'Start the development server.',
    e => e,
    e => cmds.start({ settings, pkg }),
  )

  /**
   * `bundle`
   */
  .command(
    [CMD.BUNDLE],
    'Package a bundle into the `/dist` folder.',
    e => e,
    e => cmds.bundle({ settings, pkg }),
  )

  /**
   * `stats`
   */
  .command(
    [CMD.STATS],
    'Read size details about the `/dist` bundle.',
    e => e,
    e => cmds.stats({ settings, pkg }),
  )

  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .epilog(`See ${constants.URL.SITE}`);

/**
 * Show full list of commands if none was provided.
 */
if (!CMDS.includes(program.argv._[0])) {
  program.showHelp();
  log.info();
  process.exit(0);
}
