import { fs, fsPath, shell, log } from './common/libs';
import { Package } from './config';

const FILES = [
  // Code, lint, style setup.
  '/.prettierrc',
  '/tslint.json',
  '/tsconfig.json',
  '/tsconfig.lib.json',

  // Files.
  '/public',
  '/.rescriptsrc.js',
  '/webpack.config.js',
  '/uiharness.yml',
];

/**
 * Ensure the module is initialized.
 */
export function init() {
  FILES.forEach(file => ensureFile(file));
  Package.create().init();
}

/**
 * Removes configuration files.
 */
export function debugReset() {
  Package.create().removeScripts();
  FILES
    // Delete copied template files.
    .map(file => toRootPath(file))
    .forEach(file => fs.removeSync(file));

  // Log results.
  log.info('');
  log.info(
    '👋   The auto-generated files and scripts from UIHarness have been removed.',
  );
  log.info(`    Run \`${log.cyan('uiharness init')}\` to recreate them.`);
  log.info('');
}

/**
 * Starts in dev mode.
 */
export function start() {
  init();
  const cmd = fsPath.resolve('./node_modules/.bin/rescripts start');
  exec(cmd);
}

/**
 * Runs the build packager.
 */
export function bundle() {
  init();
  const cmd = fsPath.resolve('./node_modules/.bin/rescripts build');
  exec(cmd);
}

/**
 * INTERNAL
 */
function exec(command: string) {
  // NB:  Work around for ensure colors are emitted to the console.
  //      https://github.com/shelljs/shelljs/issues/86#issuecomment-303705113
  return shell.exec(`${command} --color always`);
}

function ensureFile(path: string, options: { force?: boolean } = {}) {
  const { force } = options;
  const to = toRootPath(path);
  if (force || !fs.existsSync(to)) {
    const from = fsPath.resolve(
      `./node_modules/@uiharness/webpack/tmpl/${path}`,
    );
    fs.copySync(from, to);
  }
}

function toRootPath(path: string) {
  path = path.replace(/\//, '');
  return fsPath.resolve(`./${path}`);
}
