import {
  defaultValue,
  BundleTarget,
  exec,
  fs,
  Listr,
  log,
  logging,
  logNoConfig,
} from '../../common';
import * as staticAssets from '../../common/staticAssets';
import { Settings } from '../../settings';
import * as init from '../cmd.init';
import { stats as renderStats } from '../cmd.stats';

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
  const { settings, silent = false } = args;
  const electron = settings.electron;
  const tmp = settings.path.tmp;

  if (!electron.exists) {
    logNoConfig({ target: 'electron' });
    const error = new Error(`Electron configuration not specified.`);
    return { success: false, error };
  }

  const summary = defaultValue(args.summary, true);
  const stats = defaultValue(args.stats, false);
  const prod = defaultValue(args.prod, true);
  const env = toEnv(prod);
  let { main, renderer } = args;
  const pkg = settings.package;
  const entry = electron.entry;
  const bundlerArgs = electron.bundlerArgs;
  const out = electron.out(prod);

  const all = main === undefined && renderer === undefined;
  main = all ? true : main;
  renderer = all ? true : renderer;

  // Ensure the module is initialized.
  await init.prepare({ settings, prod });
  await electron.ensureEntries();

  // Build the command.
  const tasks = new Listr([], {
    concurrent: true,
    renderer: silent ? 'silent' : undefined,
  });

  const cmd = exec.cmd
    .create(`export NODE_ENV="${env.value}"`)
    .newLine()
    .add(`cd ${fs.resolve('.')}`)
    .newLine();

  if (main) {
    tasks.add({
      title: `Bundling      ${log.cyan('main')}     ${env.display}`,
      task: () =>
        cmd
          .clone()
          .add(`parcel`)
          .add(`build ${entry.main}`)
          .add(`--out-dir ${fs.join(tmp.dir, out.main.dir)}`)
          .add(`--target electron`)
          .add(bundlerArgs.cmd)
          .run({ silent: true }),
    });
  }

  if (renderer) {
    const entryPaths = Settings.toEntryPaths(entry.renderer, {
      dir: tmp.dir,
      field: 'html',
    }).join(' ');

    tasks.add({
      title: `Bundling      ${log.cyan('renderer')} ${env.display}`,
      task: () =>
        cmd
          .clone()
          .add(`parcel`)
          .add(`build ${entryPaths}`)
          .add(`--public-url ./`)
          .add(`--out-dir ${fs.join(tmp.dir, out.renderer.dir)}`)
          .add(`--target electron`)
          .add(bundlerArgs.cmd)
          .run({ silent: true }),
    });
  }

  const outPath = electron.bundlerArgs.output;
  const copyOutput = async () => {
    if (outPath) {
      const copy = async (type: 'main' | 'renderer', source: string) => {
        const sourceDir = fs.join(fs.resolve(tmp.dir), source);
        const targetDir = fs.join(fs.resolve(outPath), type);
        await fs.ensureDir(fs.dirname(targetDir));
        await fs.remove(targetDir);
        await fs.copy(sourceDir, targetDir);
      };
      await copy('main', out.main.dir);
      await copy('renderer', out.renderer.dir);
    }
  };

  // Run scripts.
  try {
    await tasks.run();
    await copyOutput();
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
    const size = {
      main: await toSize(settings, out.main.dir),
      renderer: await toSize(settings, out.renderer.dir),
    };
    const output = {
      main: outPath ? fs.join(outPath, 'main') : fs.join(tmp.dir, out.main.dir),
      renderer: outPath ? fs.join(outPath, 'renderer') : fs.join(tmp.dir, out.renderer.dir),
    };

    log.info();
    log.info(`🤟  Javascript bundling for ${log.yellow('electron')} complete.\n`);
    log.info.gray(`   • package:     ${pkg.name}`);
    log.info.gray(`   • version:     ${pkg.version}`);
    log.info.gray(`   • env:         ${env.value}`);
    log.info.gray(`   • entry:       ${formatPath(entry.main)}`);
    Object.keys(entry.renderer).forEach(key => {
      const code = entry.renderer[key].path;
      log.info.gray(`                  ${formatPath(code)}`);
    });
    log.info.gray(`   • output:      ${formatPath(output.main)} (${log.blue(size.main)})`);
    log.info.gray(`                  ${formatPath(output.renderer)} (${log.blue(size.renderer)})`);
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
  const { settings, silent = false } = args;
  const summary = defaultValue(args.summary, true);
  const tmp = settings.path.tmp;
  const web = settings.web;

  if (!web.exists) {
    logNoConfig({ target: 'web' });
    const error = new Error(`Web configuration not specified.`);
    return { success: false, error };
  }

  const stats = defaultValue(args.stats, false);
  const prod = defaultValue(args.prod, true);
  const env = toEnv(prod);
  const pkg = settings.package;
  const entry = web.entry;
  const out = web.out(prod);

  // Ensure the module is initialized.
  await init.prepare({ settings, prod });
  await web.ensureEntries();
  await staticAssets.copyWeb({ settings, prod });

  // Build the command.
  const tasks = new Listr([], {
    concurrent: true,
    renderer: silent ? 'silent' : undefined,
  });

  const buildPaths = Object.keys(entry)
    .map(key => entry[key].html)
    .join(' ');

  const cmd = exec.cmd
    .create()
    .add(`export NODE_ENV="${env.value}"`)
    .newLine()
    .add(`cd ${fs.resolve(tmp.dir)}`)
    .newLine()
    .add(`parcel`)
    .add(`build ${buildPaths}`)
    .add(`--public-url ./`)
    .add(`--out-dir ${out.dir}`)
    .add(`--out-file ${out.file}`)
    .add(web.bundlerArgs.cmd);

  tasks.add({
    title: `Bundling      ${log.cyan('web')} ${env.display}`,
    task: () => cmd.run({ silent: true }),
  });

  const outPath = web.bundlerArgs.output;
  const copyOutput = async () => {
    if (outPath) {
      const sourceDir = fs.join(fs.resolve(tmp.dir), out.dir);
      const targetDir = fs.resolve(outPath);
      await fs.ensureDir(fs.dirname(targetDir));
      await fs.remove(targetDir);
      await fs.copy(sourceDir, targetDir);
    }
  };

  // Run scripts.
  try {
    await tasks.run();
    await copyOutput();
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
    const size = await toSize(settings, out.dir);
    const path = {
      entry: fs.join(tmp.dir, entry.default.path),
      output: outPath ? outPath : fs.join(tmp.dir, out.path),
    };

    log.info();
    log.info(`🤟  Javascript bundling for ${log.yellow('web')} complete.\n`);
    log.info.gray(`   • package:     ${pkg.name}`);
    log.info.gray(`   • version:     ${pkg.version}`);
    log.info.gray(`   • env:         ${env.value}`);
    log.info.gray(`   • entry:       ${formatPath(path.entry)}`);
    log.info.gray(`   • output:      ${formatPath(path.output)} (${log.blue(size)})`);
    log.info();
  }
  if (stats) {
    await renderStats({ settings, prod, target: 'web' });
  }
  return { success: true };
}

/**
 * [Helpers]
 */
const formatPath = (path: string) => logging.formatPath(path, true);

const toEnv = (prod?: boolean) => {
  const value = prod === true || prod === undefined ? 'production' : 'development';
  const display = log.gray(`(${value})`);
  return { value, display };
};

const toSize = async (settings: Settings, dir: string) => {
  dir = fs.resolve(fs.join(settings.path.tmp.dir, dir));
  const size = await fs.size.dir(dir);
  return size.toString({ round: 0, spacer: '' });
};
