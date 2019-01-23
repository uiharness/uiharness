#!/usr/bin/env node
import * as cmds from './cmds';
import { constants, log, Settings, yargs } from './common';

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
  INIT_I: 'i',
  START: 'start',
  START_ST: 'st',
  CLEAN: 'clean',
  CLEAN_C: 'c',
  DIST: 'dist',
  DIST_D: 'd',
};
const CMDS = Object.keys(CMD).map(key => CMD[key]);

const settings = Settings.create('.');

/**
 * Cheat sheet.
 * https://devhints.io/yargs
 */
const SCRIPT = log.magenta('uiharness-electron');
const COMMAND = log.cyan('<command>');
const OPTIONS = log.gray('[options]');
const program = yargs
  .scriptName('')
  .usage(`${'Usage:'} ${SCRIPT} ${COMMAND} ${OPTIONS}`)

  /**
   * `init`
   */
  .command(
    [CMD.INIT, CMD.INIT_I],
    'Initialize module with default files.',
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
      cmds.init({ settings, force, reset });
    },
  )

  /**
   * `start`
   */
  .command(
    [CMD.START, CMD.START_ST],
    'Start the development server.',
    e => e,
    e => cmds.start({ settings }),
  )

  /**
   * `clean`
   */
  .command(
    [CMD.CLEAN, CMD.CLEAN_C],
    'Removes temporary generated files.',
    e => e,
    e => cmds.clean({}),
  )

  /**
   * `bundle`
   */
  .command(
    [CMD.DIST, CMD.DIST_D],
    'Packages the application ready for distribution.',
    e => e,
    e => cmds.dist({ settings }),
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
