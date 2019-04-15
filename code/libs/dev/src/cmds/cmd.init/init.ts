import {
  constants,
  fs,
  getTSConfigFiles,
  IRuntimeConfig,
  log,
  npm,
  t,
  tmpl,
  value,
} from '../../common';
import { Settings } from '../../settings';
import { removeSourceMapRefs } from '../../utils';
import { clean } from '../cmd.clean';

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
    template?: t.InitTemplate;
  },
) {
  const { settings, template = 'platform' } = args;
  const pkg = settings.package;
  if (args.reset) {
    return reset({ settings });
  }
  const flags = toFlags(args);
  const { force, prod } = flags;
  const dir = settings.dir;

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
    const devDeps = await npm.getVersions(PKG.devDependencies);
    await pkg.setFields('devDependencies', devDeps, { force: true }).save();
  }

  if (flags.files) {
    const noForce = ['.gitignore'];
    const variables = { NAME: pkg.name };
    const filter = (path: string) => true;
    await tmpl
      .create()
      .add(settings.path.templates.base)
      .use(tmpl.replace({ edge: '__' }))
      .use(tmpl.copyFile({ force, noForce, filter }))
      .execute({ variables });
    await updateTSConfigFiles({ dir, template });
    await updateTSLintFile({ dir, template });
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
  const tmp = settings.path.tmp;
  const electron = settings.electron;
  const out = electron.out(args.prod);

  // Prepare `renderer` entry paths.
  const renderer: IRuntimeConfig['electron']['renderer'] = {};
  Object.keys(electron.entry.renderer).forEach(key => {
    const { html, title } = electron.entry.renderer[key];
    const file = fs.basename(html);
    renderer[key] = {
      title,
      path: fs.join(out.renderer.dir, file),
    };
  });

  // Pepare the runtime config JSON.
  const data: IRuntimeConfig = {
    name: settings.name,
    electron: {
      port: electron.port,
      main: out.main.path,
      renderer,
    },
  };

  // Write the file.
  const path = fs.join(tmp.dir, tmp.config);
  await fs.file.stringifyAndSave(path, data);
  return data;
}

/**
 * Determines whether the module has been initialized.
 */
async function getIsInitialized(args: { settings: Settings }) {
  const state = await getInitializedState(args);
  return Object.keys(state).every(key => state[key] !== false);
}

/**
 * Save a copy of `package.json` the with the `main` field set to the entry point.
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
  const pkg = npm.pkg('.');
  pkg.json.main = fs.join(main);

  // Ensure UIHarness electron package is available as a dependency.
  ensureDependency(pkg, '@uiharness/electron');
  ensureDependency(pkg, '@uiharness/ui');

  // Save the [package.json] file.
  const path = fs.resolve(settings.path.package);
  await pkg.save(path);
}

/**
 * Ensures the a package has the given dependency.
 */
function ensureDependency(pkg: npm.NpmPackage, name: string) {
  const dep = npm.pkg(fs.join('./node_modules', name));
  if (dep.exists && dep.version) {
    pkg.setFields('dependencies', { [name]: dep.version });
    pkg.removeFields('devDependencies', [name]);
  }
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

  const exists = async (...paths: string[]) => {
    const res = await Promise.all(paths.map(path => fs.pathExists(fs.resolve(path))));
    return !res.some(value => value === false);
  };

  const hasConfig = await exists('./uiharness.yml');
  const hasSrcFolder = await exists('./src');
  const hasElectronMainEntry = electron.exists ? await exists(electronEntry.main) : null;
  const hasElectronRendererEntries = electron.exists
    ? await exists(
        ...Object.keys(electronEntry.renderer).map(key => electronEntry.renderer[key].path),
      )
    : null;
  const hasWebEntry = web.exists ? await exists(web.entry.code) : null;
  const hasAllScripts = Object.keys(scripts).every(key => scripts[key]);

  const result = {
    hasConfig,
    hasSrcFolder,
    hasElectronMainEntry,
    hasElectronRendererEntries,
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
  const common = ['node_modules/rxjs', 'node_modules/react-inspector', 'node_modules/prosemirror*'];
  const paths = [...common, ...(settings.sourcemaps.strip || [])];
  await removeSourceMapRefs(...paths);
}

async function updateTSConfigFiles(args: { dir: string; template: t.InitTemplate }) {
  const { dir, template } = args;
  const files = await getTSConfigFiles(dir);

  // Add the base [tsconfig] template from @platform.
  if (template === 'platform') {
    files.forEach(file => (file.json.extends = '@platform/ts/tsconfig.json'));
  }

  // Remove any empty "extends" entries.
  files.filter(file => !Boolean(file.json.extends)).forEach(file => delete file.json.extends);

  // Save files.
  await Promise.all(
    files
      .map(({ path, json }) => ({
        path,
        json: toJsonString(json),
      }))
      .map(({ path, json }) => fs.writeFile(path, json)),
  );
}

async function updateTSLintFile(args: { dir: string; template: t.InitTemplate }) {
  const { dir, template } = args;
  const path = fs.join(dir, 'tslint.json');
  if (await fs.pathExists(path)) {
    const tslint = await fs.file.loadAndParse<t.ITSLint>(path);
    if (template === 'platform') {
      tslint.extends = '@platform/ts/tslint.json';
    }
    if (!tslint.extends) {
      delete tslint.extends;
    }
    await fs.writeFile(path, toJsonString(tslint));
  }
}

function toJsonString(obj: object) {
  return `${JSON.stringify(obj, null, '  ')}\n`;
}
