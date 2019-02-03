#!/usr/bin/env node
import * as cmds from '../cmds';
import { constants, log, yargs, BundleTarget, Environment } from '../common';
import { Settings } from '../settings';
import { wrangleAndLog, BUNDLE_TARGETS, ENVIRONMENTS } from './util';

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
  START_S: 's',
  START_ST: 'st',
  CLEAN: 'clean',
  CLEAN_C: 'c',
  BUNDLE: 'bundle [target]',
  BUNDLE_B: 'b',
  STATS: 'stats',
  DIST: 'dist [target]',
  DIST_D: 'd',
  OPEN: 'open',
  OPEN_O: 'o',
  SERVE: 'serve',
  LOGS: 'logs [env]',
  LOGS_L: 'l',
};
const CMDS = Object.keys(CMD)
  .map(key => CMD[key])
  .map(cmd => cmd.split(' ')[0]);
const settings = Settings.create('.');

/**
 * Cheat sheet.
 * https://devhints.io/yargs
 */
const SCRIPT = log.magenta('ui');
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
    [CMD.START, CMD.START_S, CMD.START_ST],
    'Start the development server.',
    e =>
      e.positional('target', {
        type: 'string',
        default: 'electron',
        describe: 'Start "electron" (default) or "web" server.',
      }),
    e => {
      const target = wrangleBundleTarget(e.target);
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
        .positional('target', {
          type: 'string',
          default: 'electron',
          describe: 'Build for "electron" (default) or "web" browser.',
        })
        .option('dev', {
          describe: 'Bundle for development (default: false, production).',
          alias: 'd',
          boolean: true,
        })
        .option('silent', {
          alias: 's',
          describe: 'No console output (default: false).',
          boolean: true,
        }),
    async e => {
      const { silent, dev = false } = e;
      const prod = !dev;
      const target = wrangleBundleTarget(e.target);
      if (!target) {
        return process.exit(1);
      }
      const res = await cmds.bundle({ settings, prod, silent, target });
      if (!res.success) {
        return process.exit(1);
      }
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
      e
        .positional('target', {
          type: 'string',
          default: 'electron',
          describe: 'Build for "electron" (default) or "web" browser.',
        })
        .option('silent', {
          alias: 's',
          describe: 'No console output (default: false).',
          boolean: true,
        })
        .option('open', {
          alias: 'o',
          describe: 'Open the application when built (default: false).',
          boolean: true,
        }),
    async e => {
      const { silent, open } = e;
      const target = wrangleBundleTarget(e.target);
      if (!target) {
        return process.exit(1);
      }
      const res = await cmds.dist({ settings, silent, target });
      if (!res.success) {
        return process.exit(1);
      }
      if (open && target === 'electron') {
        await cmds.open({ settings });
      }
      return process.exit(0);
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
        .filter(t => BUNDLE_TARGETS.includes(t));
      const target = targets.length === 0 ? BUNDLE_TARGETS : targets;
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
   * `logs`
   */
  .command(
    [CMD.LOGS, CMD.LOGS_L],
    'Show application logs.',
    e =>
      e
        .positional('env', {
          type: 'string',
          default: 'prod',
          describe: 'Show "production" or "development" logs.',
        })
        .option('tail', {
          alias: 't',
          describe: 'Tail the log.',
          boolean: true,
        }),
    async e => {
      const { tail } = e;
      const env = wrangleEnvironment(e.env, 'production');
      if (!env) {
        return process.exit(1);
      }
      return cmds.logs({ settings, env, tail });
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
  .epilog(`See ${log.cyan(constants.URL.SITE)}`);

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
export function wrangleBundleTarget(value: unknown) {
  return wrangleAndLog<BundleTarget>(
    'target',
    value,
    'electron',
    BUNDLE_TARGETS,
  );
}

export function wrangleEnvironment(value: unknown, defaultValue: Environment) {
  return wrangleAndLog<Environment>('env', value, defaultValue, ENVIRONMENTS);
}
