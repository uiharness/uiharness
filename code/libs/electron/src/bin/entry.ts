#!/usr/bin/env node
import * as cmds from './cmds';
import { constants, log, yargs } from './common';
import { Settings } from './settings';

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
  BUNDLE: 'bundle',
  BUNDLE_B: 'b',
  STATS: 'stats',
  DIST: 'dist',
  DIST_D: 'd',
  OPEN: 'open',
  OPEN_O: 'o',
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
    [CMD.BUNDLE, CMD.BUNDLE_B],
    'Prepare the javascript bundle.',
    e =>
      e
        .option('dev', {
          describe: 'Bundle for development (default: false, production).',
          alias: 'd',
          boolean: true,
        })
        .option('target', {
          describe: 'Build for "electron" (default) or "web" browser.',
          alias: 't',
        })
        .option('silent', {
          alias: 's',
          describe: 'No console output (default: false).',
          boolean: true,
        }),
    async e => {
      const targets = ['electron', 'web'];
      const { silent, dev = false } = e;
      const target = (typeof e.target === 'string'
        ? e.target.toLowerCase()
        : 'electron') as cmds.BundleTarget;
      const prod = !dev;

      if (!targets.includes(target)) {
        const list = targets
          .map(t => `"${log.cyan(t)}"`)
          .join(' ')
          .trim();
        let msg = '';
        msg += `🖐  Bundle target "${log.yellow(target)}" not supported. `;
        msg += `Must be one of ${list}.`;
        log.info(msg);
        log.info();
        return process.exit(1);
      }
      await cmds.bundle({ settings, prod, silent, target });
      return process.exit(0);
    },
  )

  /**
   * `dist`
   */
  .command(
    [CMD.DIST, CMD.DIST_D],
    'Packages the application ready for distribution.',
    e =>
      e.option('silent', {
        alias: 's',
        describe: 'No console output (default: false).',
        boolean: true,
      }),
    async e => {
      const { silent } = e;
      await cmds.dist({ settings, silent });
      process.exit(0);
    },
  )

  /**
   * `stats`
   */
  .command(
    [CMD.STATS],
    'Read size details about the distribution bundle.',
    e =>
      e
        .option('prod', {
          alias: 'p',
          describe: 'Show for production.',
          boolean: true,
        })
        .option('dev', {
          alias: 'd',
          describe: 'Show for development.',
          boolean: true,
        }),
    e => {
      const { dev } = e;
      const prod = e.prod && dev ? undefined : dev ? false : e.prod;
      cmds.stats({ settings, prod });
    },
  )

  /**
   * `open`
   */
  .command(
    [CMD.OPEN, CMD.OPEN_O],
    'Opens a built application.',
    e =>
      e.option('folder', {
        alias: 'f',
        describe: 'Open the dist folder instead of the app (default: false).',
        boolean: true,
      }),
    e => {
      const { folder } = e;
      cmds.open({ settings, folder });
    },
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
