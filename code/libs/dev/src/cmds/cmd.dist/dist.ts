import {
  BundleTarget,
  command,
  file,
  fs,
  fsPath,
  IElectronBuilderConfig,
  Listr,
  log,
  logElectronInfo,
  logging,
  tmpl,
} from '../../common';
import { Settings } from '../../settings';
import { bundleElectron, bundleWeb } from '../cmd.bundle';
import * as init from '../cmd.init';

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
      return { success: false };
    }
  };

  // Ensure the module is initialized.
  await init.prepare({ settings, prod });
  await prepareBuilderYaml({ settings });

  if (!silent) {
    log.info();
    logElectronInfo({ settings, port: false });
  }

  // Build JS bundles and run the electron-builder.
  try {
    const res = await bundleElectron({
      settings,
      silent,
      prod: true,
      summary: false,
      stats: false,
    });

    if (!res.success) {
      return { success: false };
    }
  } catch (error) {
    return handleError(error, 'building javascript for electron distribution');
  }

  // Construct the `build` command.
  const cmd = command()
    .addLine(`cd ${fsPath.resolve('.')}`)
    .add(`build`)
    .arg(`--x64`)
    .arg(`--publish=never`)
    .alias(`-c.extraMetadata.main="${out.main.path}"`)
    .arg(`--config="${electron.path.builder.configFilename}"`);

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
    return { success: false };
  }

  // Log output.
  const config = settings.electron.builderArgs;
  const path = config.outputDir
    ? logging.formatPath(config.outputDir, true)
    : 'UNKNOWN';

  if (!silent) {
    log.info();
    log.info(`🤟  Application distribution complete.\n`);
    log.info.gray(`   • productName: ${log.yellow(config.productName)}`);
    log.info.gray(`   • appId:       ${config.appId}`);
    log.info.gray(`   • version:     ${settings.package.version}`);
    log.info.gray(`   • folder:      ${path}`);
    log.info();
    log.info(`👉  Run ${log.cyan('yarn ui open')} to run it.`);
    log.info();
  }

  return { success: true };
}

/**
 * Bundles the [web] application.
 */
export async function distWeb(args: { settings: Settings; silent?: boolean }) {
  const { settings, silent } = args;
  const prod = true;

  const res = await bundleWeb({ settings, prod, silent });
  if (!res.success) {
    return { success: false };
  }

  log.info(`👉  Run ${log.cyan('yarn ui serve')} to view it in the browser.`);
  log.info();

  return { success: true };
}

/**
 * INTERNAL
 */
async function prepareBuilderYaml(args: { settings: Settings }) {
  const { settings } = args;
  const electron = settings.electron;
  const { configFilename, files, output } = electron.path.builder;
  const path = fsPath.resolve(fsPath.join('.', configFilename));
  const exists = await fs.pathExists(path);

  // Copy in the template file if it does not yet exist.
  if (!exists) {
    await tmpl
      .create(settings.path.templates.electron)
      .use(tmpl.copyFile({}))
      .execute();
  }

  // Update the builder YAML with current input/output paths.
  const data = await file.loadAndParse<IElectronBuilderConfig>(path);
  data.productName = settings.name;
  data.files = files;
  data.directories = {
    ...(data.directories || {}),
    output,
  };
  await file.stringifyAndSave<IElectronBuilderConfig>(path, data);
}
