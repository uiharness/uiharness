#!/usr/bin/env node
import * as yargs from 'yargs';

import { log, constants } from '../common';
import * as server from '../server';

const COMMAND = {
  INIT: 'init',
  START: 'start',
  BUNDLE: 'bundle',
  STATS: 'stats',
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
    'Initialize the module with default files.',
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
      if (reset) {
        server.reset();
      } else {
        server.init({ force });
      }
    },
  )
  .command(
    COMMAND.START,
    'Start the development server.',
    e => e,
    e => server.start({}),
  )
  .command(
    COMMAND.BUNDLE,
    'Package a bundle into the `/dist` folder.',
    e => e,
    e => server.bundle({}),
  )
  .command(
    COMMAND.STATS,
    'Read size details about the `/dist` bundle.',
    e => e,
    e => server.stats({}),
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
