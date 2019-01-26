import { value, fsPath, Listr, log, logging, command } from '../common';
import { Settings } from '../settings';
import { init } from './init';
import { stats } from './stats';

export type BundleTarget = 'electron' | 'web';

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
  const { target, silent = false, prod, settings } = args;
  const summary = value.defaultValue(args.summary, true);

  switch (target) {
    case 'electron':
      return bundleElectron({
        settings,
        prod,
        main: true,
        renderer: true,
        silent,
        summary,
      });

    case 'web':
      console.log('🐷  bundle -- target', target);
      console.log();
      console.log();

      return { success: true };

      break;

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
}) {
  const { settings, prod, silent = false } = args;
  const summary = value.defaultValue(args.summary, true);
  let { main, renderer } = args;
  const pkg = settings.package;
  const electron = settings.electron;
  const entry = electron.entry;
  const bundlerArgs = electron.bundlerArgs;
  const out = electron.out(prod);

  const env =
    prod === true || prod === undefined ? 'production' : 'development';

  const envDisplay = log.gray(`(${env})`);

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
    .addLine(`export NODE_ENV="${env}"`)
    .addLine(`cd ${fsPath.resolve('.')}`);

  if (main) {
    tasks.add({
      title: `Bundling      ${log.cyan('main')}     ${envDisplay}`,
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
      title: `Bundling      ${log.cyan('renderer')} ${envDisplay}`,
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

  // Run build scripts.
  try {
    await tasks.run();
  } catch (error) {
    if (!silent) {
      log.info();
      log.warn(`😩  Failed while bundling javascript.`);
      log.error(error.message);
      log.info();
    }
    return { success: false, error };
  }

  // Log results.
  const formatPath = (path: string) => logging.formatPath(path, true);

  if (summary && !silent) {
    log.info();
    log.info(`🤟  Javascript bundling complete.\n`);
    log.info.gray(`   • env:         ${log.yellow(env)}`);
    log.info.gray(`   • package:     ${pkg.name}`);
    log.info.gray(`   • version:     ${pkg.version}`);
    log.info.gray(`   • entry:       ${formatPath(entry.main)}`);
    log.info.gray(`                  ${formatPath(entry.renderer)}`);
    log.info.gray(`   • output:      ${formatPath(out.main.path)}`);
    log.info.gray(`                  ${formatPath(out.renderer.path)}`);

    log.info();
    await stats({ settings, prod: prod, moduleInfo: false });
  }

  return { success: true };
}
