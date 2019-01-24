import {
  constants,
  exec,
  fsPath,
  log,
  logging,
  Settings,
  Listr,
} from '../common';
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

  const { PATH } = constants;
  const { MAIN, RENDERER } = PATH;
  const mainDir = MAIN.OUT_DIR;
  const rendererDir = prod ? RENDERER.OUT_DIR.PROD : RENDERER.OUT_DIR.DEV;

  const env =
    prod === true || prod === undefined ? 'production' : 'development';

  const all = main === undefined && renderer === undefined;
  main = all ? true : main;
  renderer = all ? true : renderer;

  // Ensure the module is initialized.
  await init({ settings });

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
      title: `Bundling ${log.cyan('main')}`,
      task: () => {
        const cmd = `
          ${CMD}
          parcel build src/main.ts --out-dir ${mainDir} --target electron
        `;
        return exec.run(cmd, { silent: true });
      },
    });
  }

  if (renderer) {
    tasks.add({
      title: `Bundling ${log.cyan('renderer')}`,
      task: () => {
        const cmd = `
          ${CMD}
          parcel build src/index.html --public-url ./ --out-dir ${rendererDir}
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
    log.info.gray(`   • main entry:  ${formatPath(MAIN.ENTRY)}`);
    log.info.gray(`   • output:      ${formatPath(MAIN.OUT_DIR)}`);
    log.info.gray(`                  ${formatPath(rendererDir)}`);

    log.info();
    await stats({ settings, prod: prod, moduleInfo: false });
    log.info();
  }
}
