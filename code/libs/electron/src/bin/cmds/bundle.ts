import { constants, exec, fsPath, log, logging, Listr } from '../common';
import { Settings } from '../settings';
import { init } from './init';
import { stats } from './stats';

/**
 * Runs the JS bundler.
 */
export async function bundle(args: {
  settings: Settings;
  prod?: boolean;
  main?: boolean;
  renderer?: boolean;
  silent?: boolean;
  noSummary?: boolean;
}) {
  const { settings, prod, silent = false, noSummary = false } = args;
  let { main, renderer } = args;
  const electron = settings.electron;
  const entry = electron.entry;
  const bundlerArgs = electron.bundlerArgs;
  const out = electron.out(prod);

  const env =
    prod === true || prod === undefined ? 'production' : 'development';

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
  const CMD = `
    export NODE_ENV="${env}"
    cd ${fsPath.resolve('.')}
  `;

  if (main) {
    tasks.add({
      title: `Bundling      ${log.cyan('main')}`,
      task: () => {
        let args = '';
        args += ` --out-dir ${out.main.dir}`;
        args += ` --out-file ${out.main.file}`;
        args += ` --target electron `;
        args += bundlerArgs.cmd;
        const cmd = `
          ${CMD}
          parcel build ${entry.main} ${args}
        `;
        return exec.run(cmd, { silent: true });
      },
    });
  }

  if (renderer) {
    tasks.add({
      title: `Bundling      ${log.cyan('renderer')}`,
      task: () => {
        let args = '';
        args += ` --public-url ./`;
        args += ` --out-dir ${out.renderer.dir}`;
        args += ` --out-file ${out.renderer.file}`;
        args += bundlerArgs.cmd;
        const cmd = `
          ${CMD}
          parcel build ${entry.renderer} ${args}
        `;
        return exec.run(cmd, { silent: true });
      },
    });
  }

  // Run build scripts.
  try {
    await tasks.run();
  } catch (error) {
    if (silent) {
      throw error;
    } else {
      log.info();
      log.warn(`😩  Failed while bundling javascript.`);
      log.error(error.message);
      log.info();
      return;
    }
  }

  // Log results.
  const formatPath = (path: string) => logging.formatPath(path, true);

  if (!silent && !noSummary) {
    log.info();
    log.info(`🤟  Javascript bundling complete.\n`);
    log.info.gray(`   • version:     ${settings.package.version}`);
    log.info.gray(`   • env:         ${log.yellow(env)}`);
    log.info.gray(`   • entry:       ${formatPath(entry.main)}`);
    log.info.gray(`                  ${formatPath(entry.renderer)}`);
    log.info.gray(`   • output:      ${formatPath(out.main.path)}`);
    log.info.gray(`                  ${formatPath(out.renderer.path)}`);

    log.info();
    await stats({ settings, prod: prod, moduleInfo: false });
  }
}
