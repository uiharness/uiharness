import {
  config,
  fs,
  fsPath,
  log,
  tmpl,
  Settings,
  Package,
  constants,
} from '../common';

const TEMPLATE_DIR = './node_modules/@uiharness/electron.dev/tmpl';
const { SCRIPTS } = constants;

/**
 * Initialize the module.
 */
export async function init(args: {
  settings: Settings;
  pkg: Package;
  force?: boolean;
  reset?: boolean;
}) {
  const { settings, pkg, force = false } = args;
  if (args.reset) {
    return reset({ pkg });
  }
  const flags = settings.init;

  if (flags.scripts) {
    pkg.addFields('scripts', SCRIPTS).save();
  }

  if (flags.deps) {
    const PKG = constants.PKG;
    const npm = tmpl.npm;
    const deps = await npm.getVersions(PKG.dependencies);
    const devDeps = await npm.getVersions(PKG.devDependencies);
    pkg
      .addFields('dependencies', deps, { force: true })
      .addFields('devDependencies', devDeps, { force: true })
      .save();
  }

  if (flags.files) {
    const entries = settings.entries;
    await tmpl
      .create(TEMPLATE_DIR)
      .use(tmpl.transformEntryHtml({ entries }))
      .use(tmpl.copyFile({ force }))
      .execute();
  }

  // Save settings as JSON to local project.
  await saveConfigJson({ settings });
}

/**
 * Removes configuration files.
 */
async function reset(args: { pkg: config.Package }) {
  const { pkg } = args;
  pkg.removeFields('scripts', SCRIPTS, { exclude: 'postinstall' }).save();

  await tmpl
    .create(TEMPLATE_DIR)
    .use(tmpl.deleteFile())
    .execute();

  fs.removeSync(fsPath.resolve('./.cache'));
  fs.removeSync(fsPath.resolve('./dist'));
  fs.removeSync(fsPath.resolve('./.uiharness'));
  fs.removeSync(fsPath.resolve('./src/main/.parcel'));
  fs.removeSync(fsPath.resolve('./src/renderer/.parcel'));

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
