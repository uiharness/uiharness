import {
  fs,
  file,
  constants,
  fsPath,
  Listr,
  log,
  logging,
  logInfo,
  command,
  BundleTarget,
  IElectronBuilderConfig,
} from '../common';
import { Settings } from '../settings';
import { bundleElectron, bundleWeb } from './bundle';
import { init } from './init';

const { PATH } = constants;
const { ELECTRON } = PATH;

/**
 * Bundles the application ready for distribution.
 */
export async function dist(args: {
  settings: Settings;
  target: BundleTarget;
  silent?: boolean;
}) {
  const { target, silent = false, settings } = args;

  switch (target) {
    case 'electron':
      return distElectron({ settings, silent });

    case 'web':
      return distWeb({ settings, silent });

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
 * Bundles the [electron] application.
 */
export async function distElectron(args: {
  settings: Settings;
  silent?: boolean;
}) {
  const { settings, silent = false } = args;
  const prod = true;
  const electron = settings.electron;
  const out = electron.out(prod);
  process.env.NODE_ENV = 'production';

  const handleError = (error: Error, step: string) => {
    if (silent) {
      throw error;
    } else {
      log.info();
      log.warn(`😩  Failed while ${step}.`);
      log.error(error.message);
      log.info();
      return;
    }
  };

  // Ensure the module is initialized.
  await init({ settings, prod });
  if (!silent) {
    log.info();
    logInfo({ settings, port: false });
  }

  // Build JS bundles and run the electron-builder.
  try {
    await bundleElectron({
      settings,
      silent,
      prod: true,
      summary: false,
      stats: false,
    });
  } catch (error) {
    handleError(error, 'building javascript for electron distribution');
    return;
  }

  // Construct the `build` command.
  await updateBuilderYaml({ settings });
  const cmd = command()
    .addLine(`cd ${fsPath.resolve('.')}`)
    .add(`build`)
    .arg(`--x64`)
    .arg(`--publish=never`)
    .alias(`-c.extraMetadata.main="${out.main.path}"`);

  // Run the electron `build` command.
  const tasks = new Listr([
    {
      title: `Building      ${log.yellow('electron app')} 🌼`,
      task: () => cmd.run({ silent: true }),
    },
  ]);
  try {
    await tasks.run();
  } catch (error) {
    handleError(error, 'building electron distribution');
    return;
  }

  // Clean up.
  // await fs.remove(fsPath.resolve(ELECTRON.BUILDER.CONFIG.TARGET));

  // Log output
  const config = settings.electron.builderArgs;
  const path = config.outputDir
    ? logging.formatPath(config.outputDir, true)
    : 'UNKNOWN';

  if (!silent) {
    log.info();
    log.info(`🤟  Application packaging complete.\n`);
    log.info.gray(`   • productName: ${log.yellow(config.productName)}`);
    log.info.gray(`   • version:     ${settings.package.version}`);
    log.info.gray(`   • appId:       ${config.appId}`);
    log.info.gray(`   • folder:      ${path}`);
    log.info();
    log.info(`👉  Run ${log.cyan('yarn ui open')} to run it.`);
    log.info();
  }
}

async function updateBuilderYaml(args: { settings: Settings }) {
  const BUILDER = ELECTRON.BUILDER;
  const name = BUILDER.CONFIG.NAME;
  const path = fsPath.resolve(fsPath.join('.', name));

  // Update the builder YAML with current input/output paths.
  const data = await file.loadAndParse<IElectronBuilderConfig>(path);
  data.files = BUILDER.FILES;
  data.directories = {
    ...(data.directories || {}),
    output: BUILDER.OUTPUT,
  };
  await file.stringifyAndSave<IElectronBuilderConfig>(path, data);
}

/**
 * Bundles the [web] application.
 */
export async function distWeb(args: { settings: Settings; silent?: boolean }) {
  const { settings, silent } = args;
  const prod = true;

  await bundleWeb({ settings, prod, silent });

  log.info(`👉  Run ${log.cyan('yarn ui serve')} to view it in the browser.`);
  log.info();
}
