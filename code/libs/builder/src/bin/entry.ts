#!/usr/bin/env node
import * as yargs from 'yargs';

import { log } from '../common';
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
    yargs =>
      yargs
        .option('force', {
          alias: 'f',
          describe: 'Overwrite existing files.',
          boolean: true,
        })
        .option('reset', {
          describe: 'Deletes all files created by a previous `init`.',
          boolean: true,
        }),
    argv => {
      const { force, reset } = argv;
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
    yargs => yargs,
    argv => server.start({}),
  )
  .command(
    COMMAND.BUNDLE,
    'Package a bundle into the `/dist` folder.',
    yargs => yargs,
    argv => server.bundle({}),
  )
  .command(
    COMMAND.STATS,
    'Read size details about the `/dist` bundle.',
    yargs => yargs,
    argv => server.stats({}),
  )

  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')

  .epilog('See https://uiharness.com');

// Show full list of commands if non was provided.
if (!COMMANDS.includes(program.argv._[0])) {
  program.showHelp();
  log.info();
  process.exit(0);
}
