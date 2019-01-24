import { fs, fsPath, log, tmpl, Settings, constants, npm } from '../common';
import { clean } from './clean';
const { SCRIPTS, PATH } = constants;

/**
 * Initialize the module.
 */
export async function init(args: {
  settings: Settings;
  force?: boolean;
  reset?: boolean;
}) {
  const { settings, force = false } = args;
  const pkg = settings.package;
  if (args.reset) {
    return reset({ pkg });
  }

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
    await tmpl
      .create(PATH.TEMPLATES)
      .use(tmpl.copyFile({ force }))
      .execute();
  }

  // Save settings as JSON to local project.
  await saveConfigJson({ settings });
}

/**
 * Removes configuration files.
 */
async function reset(args: { pkg: npm.NpmPackage }) {
  const { pkg } = args;
  pkg.removeFields('scripts', SCRIPTS, { exclude: 'postinstall' }).save();

  await tmpl
    .create(PATH.TEMPLATES)
    .use(tmpl.deleteFile())
    .execute();

  await clean({});

  // Log results.
  log.info('');
  log.info(
    '👋   The auto-generated files and scripts from `@uiharness/electron` have been removed.',
  );
  log.info(
    `    Run \`${log.cyan('uiharness-electron init')}\` to recreate them.`,
  );
  log.info('');
}

/**
 * INTERNAL
 */

/**
 * Saves configuration JSON to the target module to be imported
 * by the consuming components.
 */
async function saveConfigJson(args: { settings: Settings }) {
  const { port } = args.settings;
  const { DIR, FILE } = constants.PATH.CONFIG;
  const data = { port };
  const dir = fsPath.resolve(DIR);
  const path = fsPath.join(dir, FILE);
  const json = `${JSON.stringify(data, null, '  ')}\n`;
  await fs.ensureDir(dir);
  await fs.writeFile(path, json);
}

/**
 * Determines whether the module has been initialized
 */
async function isInitialized(args: { settings: Settings }) {
  const { settings } = args;
  const pkg = settings.package;
  const scripts = { ...SCRIPTS };
  delete scripts.postinstall;

  const hasAllScripts = Object.keys(scripts).every(
    key => pkg.scripts[key] === scripts[key],
  );

  return hasAllScripts;
}
