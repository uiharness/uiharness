#!/usr/bin/env node
import * as yargs from 'yargs';

import { log, constants, config } from './common';
import * as cmds from './cmds';

const COMMAND = {
  INIT: 'init',
  START: 'start',
};
const COMMANDS = Object.keys(COMMAND).map(key => COMMAND[key]);

const settings = config.Settings.create();
const pkg = config.Package.create();

/**
 * Cheat sheet.
 * https://devhints.io/yargs
 */
const program = yargs
  .usage('Usage: $0 <command> [options]')

  /**
   * `init`
   */
  .command(
    COMMAND.INIT,
    'Initialize the module with default files needed to run electron.',
    e =>
      e
        .option('force', {
          alias: 'f',
          describe: 'Overwrite existing files.',
          boolean: true,
        })
        .option('reset', {
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
    COMMAND.START,
    'Start the development server.',
    e => e,
    e => cmds.start({ settings, pkg }),
  )

  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .epilog(`See ${constants.URL.SITE}`);

/**
 * Show full list of commands if none was provided.
 */
if (!COMMANDS.includes(program.argv._[0])) {
  program.showHelp();
  log.info();
  process.exit(0);
}
