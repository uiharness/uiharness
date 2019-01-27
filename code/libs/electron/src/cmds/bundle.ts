import {
  value,
  fsPath,
  Listr,
  log,
  logging,
  command,
  BundleTarget,
} from '../common';
import { Settings } from '../settings';
import { init } from './init';
import { stats as renderStats } from './stats';

/**
 * Runs the JS bundler.
 */
export async function bundle(args: {
  settings: Settings;
  target: BundleTarget;
  prod?: boolean;
  silent?: boolean;
  summary?: boolean;
}) {
  const { target, silent = false, prod, settings, summary } = args;

  switch (target) {
    case 'electron':
      return bundleElectron({ settings, prod, silent, summary });

    case 'web':
      return bundleWeb({ settings, prod, silent, summary });

    default:
      if (!silent) {
        log.info();
        log.warn(`😩  The target "${log.yellow(target)}" is not supported.`);
        log.info();
      }
      return { success: false };
  }
}

/**
 * Runs the JS bundler for electron.
 */
export async function bundleElectron(args: {
  settings: Settings;
  prod?: boolean;
  main?: boolean;
  renderer?: boolean;
  silent?: boolean;
  summary?: boolean;
  stats?: boolean;
}) {
  const { settings, prod, silent = false } = args;
  const summary = value.defaultValue(args.summary, true);
  const stats = value.defaultValue(args.stats, true);
  const env = toEnv(prod);
  let { main, renderer } = args;
  const pkg = settings.package;
  const electron = settings.electron;
  const entry = electron.entry;
  const bundlerArgs = electron.bundlerArgs;
  const out = electron.out(prod);

  const all = main === undefined && renderer === undefined;
  main = all ? true : main;
  renderer = all ? true : renderer;

  // Ensure the module is initialized.
  await init({ settings, prod });

  // Build the command.
  const tasks = new Listr([], {
    concurrent: true,
    renderer: silent ? 'silent' : undefined,
  });

  const cmd = command()
    .addLine(`export NODE_ENV="${env.value}"`)
    .addLine(`cd ${fsPath.resolve('.')}`);

  if (main) {
    tasks.add({
      title: `Bundling      ${log.cyan('main')}     ${env.display}`,
      task: () =>
        cmd
          .add(`parcel`)
          .add(`build ${entry.main}`)
          .arg(`--out-dir ${out.main.dir}`)
          .arg(`--out-file ${out.main.file}`)
          .arg(`--target electron`)
          .add(bundlerArgs.cmd)
          .run({ silent: true }),
    });
  }

  if (renderer) {
    tasks.add({
      title: `Bundling      ${log.cyan('renderer')} ${env.display}`,
      task: () =>
        cmd
          .add(`parcel`)
          .add(`build ${entry.renderer}`)
          .add(`--public-url ./`)
          .arg(`--out-dir ${out.renderer.dir}`)
          .arg(`--out-file ${out.renderer.file}`)
          .add(bundlerArgs.cmd)
          .run({ silent: true }),
    });
  }

  // Run scripts.
  try {
    await tasks.run();
  } catch (error) {
    if (!silent) {
      log.info();
      log.warn(`😩  Failed while bundling for ${log.magenta('electron')}.`);
      log.error(error.message);
      log.info();
    }
    return { success: false, error };
  }

  // Log results.
  if (summary && !silent) {
    log.info();
    log.info(
      `🤟  Javascript bundling for ${log.yellow('electron')} complete.\n`,
    );
    log.info.gray(`   • package:     ${pkg.name}`);
    log.info.gray(`   • version:     ${pkg.version}`);
    log.info.gray(`   • env:         ${env.value}`);
    log.info.gray(`   • entry:       ${formatPath(entry.main)}`);
    log.info.gray(`                  ${formatPath(entry.renderer)}`);
    log.info.gray(`   • output:      ${formatPath(out.main.path)}`);
    log.info.gray(`                  ${formatPath(out.renderer.path)}`);
    log.info();
  }
  if (stats && !silent) {
    await renderStats({ settings, prod, target: 'electron' });
  }

  return { success: true };
}

/**
 * Runs the JS bundler for web (browser).
 */
export async function bundleWeb(args: {
  settings: Settings;
  prod?: boolean;
  silent?: boolean;
  summary?: boolean;
  stats?: boolean;
}) {
  const { settings, prod, silent = false } = args;
  const summary = value.defaultValue(args.summary, true);
  const stats = value.defaultValue(args.stats, true);
  const env = toEnv(prod);
  const pkg = settings.package;
  const web = settings.web;
  const entry = web.entry;
  const out = web.out(prod);

  // Ensure the module is initialized.
  await init({ settings, prod });

  // Build the command.
  const tasks = new Listr([], {
    concurrent: true,
    renderer: silent ? 'silent' : undefined,
  });

  const cmd = command()
    .addLine(`export NODE_ENV="${env.value}"`)
    .addLine(`cd ${fsPath.resolve('.')}`)
    .add(`parcel`)
    .add(`build ${entry}`)
    .add(`--public-url ./`)
    .arg(`--out-dir ${out.dir}`)
    .arg(`--out-file ${out.file}`)
    .add(web.bundlerArgs.cmd);

  tasks.add({
    title: `Bundling      ${log.cyan('web')} ${env.display}`,
    task: () => cmd.run({ silent: true }),
  });

  // Run scripts.
  try {
    await tasks.run();
  } catch (error) {
    if (!silent) {
      log.info();
      log.warn(`😩  Failed while bundling for ${log.magenta('web')}.`);
      log.error(error.message);
      log.info();
    }
    return { success: false, error };
  }

  // Log results.
  if (summary && !silent) {
    log.info();
    log.info(`🤟  Javascript bundling for ${log.yellow('web')} complete.\n`);
    log.info.gray(`   • package:     ${pkg.name}`);
    log.info.gray(`   • version:     ${pkg.version}`);
    log.info.gray(`   • env:         ${env.value}`);
    log.info.gray(`   • entry:       ${formatPath(entry)}`);
    log.info.gray(`   • output:      ${formatPath(out.path)}`);
    log.info();
  }
  if (stats) {
    await renderStats({ settings, prod, target: 'web' });
  }
  return { success: true };
}

/**
 * INTERNAL
 */
const formatPath = (path: string) => logging.formatPath(path, true);

function toEnv(prod?: boolean) {
  const value =
    prod === true || prod === undefined ? 'production' : 'development';
  const display = log.gray(`(${value})`);
  return { value, display };
}
