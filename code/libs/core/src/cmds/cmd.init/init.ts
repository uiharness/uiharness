import {
  constants,
  file,
  fs,
  fsPath,
  IUIHarnessRuntimeConfig,
  log,
  npm,
  tmpl,
} from '../../common';
import { Settings } from '../../settings';
import { clean } from '../cmd.clean';

const { SCRIPTS } = constants;
const { resolve, join } = fsPath;

/**
 * Initialize the module.
 */
export async function init(args: {
  settings: Settings;
  force?: boolean;
  reset?: boolean;
  prod?: boolean;
}) {
  const { settings, force = false, prod = false } = args;
  const pkg = settings.package;
  if (args.reset) {
    return reset({ settings });
  }

  // Ensure the latest configuration files exist within the [.uiharness] folder.
  await saveConfigJson({ settings, prod });
  await copyPackage({ settings, prod });

  // Don't continue if already initialized.
  if (!force && (await isInitialized({ settings }))) {
    return;
  }

  const flags = settings.init;
  if (flags.scripts) {
    await pkg.addFields('scripts', SCRIPTS).save();
  }

  if (flags.deps) {
    const PKG = constants.PKG;
    const deps = await npm.getVersions(PKG.dependencies);
    const devDeps = await npm.getVersions(PKG.devDependencies);
    await pkg
      .addFields('dependencies', deps, { force: true })
      .addFields('devDependencies', devDeps, { force: true })
      .save();
  }

  if (flags.files) {
    const noForce = ['.gitignore'];
    await tmpl
      .create()
      .add(settings.path.templates.base)
      .use(tmpl.copyFile({ force, noForce }))
      .execute();
  }
}

/**
 * Removes configuration files.
 */
async function reset(args: { settings: Settings }) {
  const { settings } = args;
  const pkg = settings.package;
  pkg.removeFields('scripts', SCRIPTS, { exclude: 'postinstall' }).save();

  await tmpl
    .create(settings.path.templates.base)
    .use(tmpl.deleteFile())
    .execute();

  await clean({});

  // Log results.
  log.info('');
  log.info(
    '👋   The auto-generated files and scripts from `@uiharness/electron` have been removed.',
  );
  log.info(`    Run \`${log.cyan('uiharness init')}\` to recreate them.`);
  log.info('');
}

/**
 * INTERNAL
 */

/**
 * Saves configuration JSON to the target module to be imported
 * by the consuming components.
 */
async function saveConfigJson(args: { settings: Settings; prod: boolean }) {
  const { settings } = args;
  const electron = settings.electron;
  const { port } = electron;
  const out = electron.out(args.prod);
  const data: IUIHarnessRuntimeConfig = {
    name: settings.name,
    electron: {
      port,
      main: out.main.path,
      renderer: out.renderer.path,
    },
  };

  // Write the file.
  const path = settings.path.tmp.config;
  await file.stringifyAndSave(path, data);
  return data;
}

/**
 *  * Save a copy of the with the 'main' set to the entry point.
 *
 *   NOTE:  This is done so that the module does not have to have the
 *          UIHarness entry-point as it's actual entry point if being
 *          published to NPM and used as an actual NPM module,
 *          but [electron] can still find the correct startup location in [main].
 *
 */
async function copyPackage(args: { settings: Settings; prod: boolean }) {
  const { settings, prod } = args;
  const electron = settings.electron;
  const main = electron.out(prod).main.path;

  // Set the "main" entry point for electron.
  const pkg = npm.pkg('.').json;
  pkg.main = join('..', main);

  // Save the [package.json] file.
  const path = resolve(settings.path.package);
  await file.stringifyAndSave(path, pkg);
}

/**
 * Determines whether the module has been initialized.
 */
async function isInitialized(args: { settings: Settings }) {
  const { settings } = args;
  const pkg = settings.package;
  const init = settings.init;

  const exists = (path: string) => fs.pathExists(resolve(path));

  if (init.files && (!(await exists('./src')) || !(await exists('./static')))) {
    return false;
  }

  // Look to see that all scripts have been inserted.
  const scripts = { ...SCRIPTS };
  delete scripts.postinstall;
  const hasAllScripts = Object.keys(scripts).every(
    key => pkg.scripts[key] === scripts[key],
  );

  return hasAllScripts;
}
