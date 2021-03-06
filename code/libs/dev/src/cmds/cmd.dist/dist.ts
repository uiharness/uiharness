import { Subject } from 'rxjs';

import {
  BundleTarget,
  exec,
  fs,
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
export async function dist(args: { settings: Settings; target: BundleTarget; silent?: boolean }) {
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
export async function distElectron(args: { settings: Settings; silent?: boolean }) {
  const prod = true;
  process.env.NODE_ENV = 'production';

  const { settings, silent = false } = args;
  const tmp = settings.path.tmp;
  const electron = settings.electron;
  const builderArgs = settings.electron.builderArgs;

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

  // Clear any old build artificats.
  const buildDir = fs.resolve('.build');
  await fs.remove(buildDir);

  // Ensure the module is initialized.
  await init.prepare({ settings, prod });
  await init.copyPackage({ settings, prod }); // Ensure the `main` path in [package.json] points to prod.
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

  // Make a copy of the config file.
  const configFile = electron.path.builder.configFilename;
  await fs.copy(configFile, fs.join(tmp.dir, configFile));

  // Copy the whole folder to a temporary `dist-build` location.
  // Note:  This is so if a dev environment is running it does not impact
  //        upon the configuration setting the builder is looking at.
  //        👌 This allows builds to run in the background while developing.
  await fs.copy(tmp.dir, buildDir);
  await fs.ensureDir(fs.join(buildDir, 'dist'));

  // Reset after build directory snapshot is made.
  await init.copyPackage({ settings, prod: false }); // Reset the `main` path in [package.json] to point to dev.

  // Copy the finished artifact back to to the [.uiharness] folder and clean up.
  const onBuildComplete = async () => {
    const source = fs.join(buildDir, 'dist');
    const target = fs.resolve(builderArgs.outputDir || 'dist');
    await fs.remove(target);
    await fs.copy(source, target);
    await fs.remove(buildDir);
  };

  const runBuilder = async () => {
    log.info.gray('  -------------------------------------');

    // Run the builder.
    const cmd = exec.cmd
      .create()
      .add(`cd ${buildDir}`)
      .newLine()
      .add(`electron-builder build`)
      .add(`--x64`)
      .add(`--publish=never`)
      .add(`--config="${configFile}"`)
      .run({ silent: true });

    const $ = new Subject<string>();
    cmd.output$.subscribe(e => $.next(e.text));
    cmd.complete$.subscribe(async () => {
      await onBuildComplete();
      $.complete();
    });
    return $;
  };

  // Run the electron `build` command.
  const tasks = new Listr([
    {
      title: `Building      ${log.yellow('electron app')} 🌼`,
      task: () => runBuilder(),
    },
  ]);

  try {
    await tasks.run();
  } catch (error) {
    handleError(error, 'building electron distribution');
    return { success: false };
  }

  // Log output.
  const path = builderArgs.outputDir
    ? logging.formatPath(fs.resolve(builderArgs.outputDir), true)
    : 'UNKNOWN';

  if (!silent) {
    log.info();
    log.info(`🤟  Application distribution complete.\n`);
    log.info.gray(`   • productName: ${log.yellow(builderArgs.productName)}`);
    log.info.gray(`   • appId:       ${builderArgs.appId}`);
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
 * [Helpers]
 */
async function prepareBuilderYaml(args: { settings: Settings }) {
  const { settings } = args;
  const electron = settings.electron;
  const { configFilename, files, output } = electron.path.builder;
  const path = fs.resolve(fs.join('.', configFilename));
  const exists = await fs.pathExists(path);

  // Copy in the template file if it does not yet exist.
  if (!exists) {
    await tmpl
      .create(settings.path.templates.electron)
      .use(tmpl.copyFile({}))
      .execute();
  }

  // Update the builder YAML with current input/output paths.
  const data = await fs.file.loadAndParse<IElectronBuilderConfig>(path);
  data.productName = settings.name;
  data.appId = settings.package.name;
  data.files = files;
  data.directories = {
    ...(data.directories || {}),
    output,
  };

  await fs.file.stringifyAndSave<IElectronBuilderConfig>(path, data);
}
