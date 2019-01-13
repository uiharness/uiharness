import { fs, fsPath, shell, log } from './common/libs';
import { Package, Settings } from './config';

// const Bundler = require('parcel-bundler');
import * as Bundler from 'parcel-bundler';

const settings = Settings.create('.');
const FILES = [
  '/.prettierrc',
  '/tsconfig.json',
  '/tslint.json',
  '/uiharness.yml',

  // TEMP
  // '/html',
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
export async function start() {
  // Setup initial conditions.
  init();
  if (!settings) {
    log.info(`😥  UIHarness could not be started.`);
    log.info(`    Ensure you have a 'uiharness.yml' file in the module root.`);
  }

  // Prepare the bundler.
  const entryFiles = fsPath.resolve('./html/index.html');
  const bundler = new Bundler(entryFiles, {});

  // Start the server.
  const server = await (bundler as any).serve(settings.port);
  return server;
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
    const from = fsPath.resolve(`./node_modules/@uiharness/react/tmpl/${path}`);
    fs.copySync(from, to);
  }
}

function toRootPath(path: string) {
  path = path.replace(/\//, '');
  return fsPath.resolve(`./${path}`);
}
