import { core, fs, fsPath, log } from '../common';

const settings = core.config.Settings.create();
const pkg = core.config.Package.create();

const FILES = ['/tsconfig.json', '/tslint.json', '/uiharness.yml'];
const SCRIPTS = {
  postinstall: 'uiharness-electron init',
  start: 'uiharness-electron start',
  bundle: 'uiharness-electron bundle',
};

/**
 * Initialize the module.
 */
export async function init(options: { force?: boolean; reset?: boolean } = {}) {
  if (options.reset) {
    return reset();
  }
  const { force = false } = options;
  const flags = settings.init;

  if (flags.scripts) {
    pkg.addScripts({ scripts: SCRIPTS });
  }

  if (flags.files) {
    FILES.forEach(file => ensureFile(file, { force }));
  }
}

/**
 * Removes configuration files.
 */
async function reset(options: {} = {}) {
  pkg.removeScripts({ scripts: SCRIPTS });
  FILES
    // Delete copied template files.
    .map(file => toRootPath(file))
    .forEach(file => fs.removeSync(file));

  fs.removeSync(fsPath.resolve('./.cache'));
  fs.removeSync(fsPath.resolve('./dist'));

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
function ensureFile(path: string, options: { force?: boolean } = {}) {
  const { force } = options;
  const to = toRootPath(path);
  if (force || !fs.existsSync(to)) {
    const from = templatePath(path);
    fs.copySync(from, to);
  }
}
function toRootPath(path: string) {
  path = path.replace(/\//, '');
  return fsPath.resolve(`./${path}`);
}
function templatePath(path: string) {
  return fsPath.resolve(`./node_modules/@uiharness/electron/tmpl/${path}`);
}
