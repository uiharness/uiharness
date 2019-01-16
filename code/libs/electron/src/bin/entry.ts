#!/usr/bin/env node
import * as yargs from 'yargs';

import { log, constants } from '../common';

const COMMAND = {
  INIT: 'init',
};
const COMMANDS = Object.keys(COMMAND).map(key => COMMAND[key]);

/**
 * Cheat sheet.
 * https://devhints.io/yargs
 */
const program = yargs
  .usage('Usage: $0 <command> [options]')
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
      log.info('INIT');
      console.log('force', force);
      console.log('reset', reset);
      console.log('e', e);
    },
  )

  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')
  .epilog(`See ${constants.URL.SITE}`);

// Show full list of commands if none was provided.
if (!COMMANDS.includes(program.argv._[0])) {
  program.showHelp();
  log.info();
  process.exit(0);
}
