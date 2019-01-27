#!/usr/bin/env node
import * as cmds from '../cmds';
import { constants, log, yargs, BundleTarget } from '../common';
import { Settings } from '../settings';

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
  START: 'start [target]',
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
  SERVE: 'serve',
};
const CMDS = Object.keys(CMD)
  .map(key => CMD[key])
  .map(cmd => cmd.split(' ')[0]);
const settings = Settings.create('.');
const TARGETS: BundleTarget[] = ['electron', 'web'];

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
    e =>
      e.positional('target', {
        type: 'string',
        default: 'electron',
        describe: 'Start "electron" (default) or "web" server.',
      }),
    e => {
      const target = formatTargetOption(e.target);
      if (!target) {
        return process.exit(1);
      }
      return cmds.start({ settings, target });
    },
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
      const { silent, dev = false } = e;
      const prod = !dev;
      const target = formatTargetOption(e.target);
      if (!target) {
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
        .option('target', {
          describe: 'Build for "electron" (default) or "web" browser.',
          alias: 't',
        })
        .option('dev', {
          alias: 'd',
          describe: 'Show for development.',
          boolean: true,
        }),
    e => {
      const { dev } = e;
      const targets: BundleTarget[] = ((e.target || '') as string)
        .split(',')
        .map(v => v as BundleTarget)
        .filter(t => TARGETS.includes(t));
      const target = targets.length === 0 ? TARGETS : targets;
      const prod = e.prod && dev ? undefined : dev ? false : e.prod;
      cmds.stats({ settings, prod, target });
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

  /**
   * `serve`
   */
  .command(
    [CMD.SERVE],
    'Serve the web distribution.',
    e => e,
    e => cmds.serve({ settings }),
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

/**
 * INTERNAL
 */
function formatTargetOption(value: unknown) {
  const target = (typeof value === 'string'
    ? value.toLowerCase()
    : 'electron') as BundleTarget;

  if (!TARGETS.includes(target)) {
    const list = TARGETS.map(t => `"${log.cyan(t)}"`)
      .join(' ')
      .trim();
    let msg = '';
    msg += `😫  The target "${log.yellow(target)}" is not supported. `;
    msg += `Must be one of ${list}.`;
    log.info(msg);
    log.info();
    return undefined;
  }
  return target;
}
