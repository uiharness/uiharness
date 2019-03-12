import { constants, fs, IRuntimeConfig, log, npm, tmpl, value } from '../../common';
import { Settings } from '../../settings';
import { clean } from '../cmd.clean';
import { removeSourceMapRefs } from '../../utils';

const { SCRIPTS } = constants;
const { defaultValue } = value;

type IInitFlags = {
  force?: boolean;
  prod?: boolean;
  scripts?: boolean;
  files?: boolean;
  html?: boolean;
  deps?: boolean;
};

const toFlags = (args: IInitFlags) => {
  return {
    force: defaultValue(args.force, false),
    prod: defaultValue(args.prod, false),
    scripts: defaultValue(args.scripts, true),
    files: defaultValue(args.files, true),
    html: defaultValue(args.html, true),
    deps: defaultValue(args.deps, true),
  };
};

/**
 * Prepares the module for execution.
 */
export async function prepare(args: { settings: Settings; prod: boolean }) {
  const { settings, prod } = args;
  const isInitialized = await getIsInitialized({ settings });
  const files = !isInitialized;
  await stripSourceMaps({ settings });
  return init({ settings, prod, files });
}

/**
 * Initialize the module.
 */
export async function init(
  args: IInitFlags & {
    settings: Settings;
    reset?: boolean;
  },
) {
  const { settings } = args;
  const pkg = settings.package;
  if (args.reset) {
    return reset({ settings });
  }
  const flags = toFlags(args);
  const { force, prod } = flags;

  // Ensure the latest configuration files exist within the [.uiharness] folder.
  await saveConfigJson({ settings, prod });
  await copyPackage({ settings, prod });

  // Don't continue if already initialized.
  const isInitialized = await getIsInitialized({ settings });
  if (!force && isInitialized) {
    return;
  }

  await stripSourceMaps({ settings });

  if (flags.scripts) {
    await pkg.setFields('scripts', SCRIPTS).save();
  }

  if (flags.deps) {
    const PKG = constants.PKG;
    const deps = await npm.getVersions(PKG.dependencies);
    const devDeps = await npm.getVersions(PKG.devDependencies);
    await pkg
      .setFields('dependencies', deps, { force: true })
      .setFields('devDependencies', devDeps, { force: true })
      .save();
  }

  if (flags.files) {
    const noForce = ['.gitignore'];

    const filter = (path: string) => {
      // Don't write files for platforms that are not configured within the settings.
      const { electron, web } = settings;
      if (
        path.endsWith(electron.entry.main) ||
        path.endsWith(electron.entry.renderer.default.code)
      ) {
        return electron.exists;
      }
      if (path.endsWith(web.entry.code)) {
        return web.exists;
      }
      return true;
    };

    await tmpl
      .create()
      .add(settings.path.templates.base)
      .use(tmpl.copyFile({ force, noForce, filter }))
      .execute();
  }
}

/**
 * Removes files.
 */
async function reset(args: { settings: Settings }) {
  const { settings } = args;
  const pkg = settings.package;
  pkg.removeFields('scripts', SCRIPTS).save();

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
  log.info(`    Run \`${log.cyan('ui init')}\` to recreate them.`);
  log.info('');
}

/**
 * [INTERNAL]
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
  const data: IRuntimeConfig = {
    name: settings.name,
    electron: {
      port,
      main: out.main.path,
      renderer: {
        default: out.renderer.path,
      },
    },
  };

  // Write the file.
  const path = settings.path.tmp.config;
  await fs.file.stringifyAndSave(path, data);
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
  pkg.main = fs.join('..', main);

  // Save the [package.json] file.
  const path = fs.resolve(settings.path.package);
  await fs.file.stringifyAndSave(path, pkg);
}

/**
 * Determines whether the module has been initialized.
 */
async function getIsInitialized(args: { settings: Settings }) {
  const state = await getInitializedState(args);
  return Object.keys(state).every(key => state[key] !== false);
}

/**
 * Gets a set of values that determine whether initialization has been run.
 */
async function getInitializedState(args: { settings: Settings }) {
  const { settings } = args;
  const electron = settings.electron;
  const electronEntry = electron.entry;
  const web = settings.web;
  const scripts = { ...SCRIPTS };

  const exists = (path: string) => fs.pathExists(fs.resolve(path));

  const hasConfig = await exists('./uiharness.yml');
  const hasSrcFolder = await exists('./src');
  const hasElectronMainEntry = electron.exists ? await exists(electronEntry.main) : null;
  const hasElectronRendererEntry = electron.exists
    ? await exists(electronEntry.renderer.default.code)
    : null;
  const hasWebEntry = web.exists ? await exists(web.entry.code) : null;
  const hasAllScripts = Object.keys(scripts).every(key => scripts[key]);

  const result = {
    hasConfig,
    hasSrcFolder,
    hasElectronMainEntry,
    hasElectronRendererEntry,
    hasWebEntry,
    hasAllScripts,
  };

  // Finish up.
  return result;
}

/**
 * Removes any source-maps that are declared within the config.
 */
async function stripSourceMaps(args: { settings: Settings }) {
  const { settings } = args;
  if (settings.sourcemaps.strip.length > 0) {
    await removeSourceMapRefs(...settings.sourcemaps.strip);
  }
}
