import { log, fs, fsPath, shell } from './common/libs';
import { exec } from './common/util';

/**
 * Ensure the module is initialized.
 */
export function init() {
  ensureConfiguration();
}

/**
 * Starts in dev mode.
 */
export function start() {
  ensureConfiguration();
  const cmd = fsPath.resolve('./node_modules/.bin/rescripts start');
  exec(cmd);
}

/**
 * Runs the build packager.
 */
export function bundle() {
  ensureConfiguration();
  const cmd = fsPath.resolve('./node_modules/.bin/rescripts build');
  exec(cmd);
}

/**
 * INTERNAL
 */

export function ensureConfiguration() {
  // Cofig.
  ensurePath('/.prettierrc');
  ensurePath('/tslint.json');
  ensurePath('/tsconfig.json');
  ensurePath('/tsconfig.lib.json');

  // Assets and config.
  ensurePath('/public');
  ensurePath('/.rescriptsrc.js');
  ensurePath('/webpack.config.js');
  ensurePath('/uiharness.yml');
}

export function ensurePath(path: string, options: { force?: boolean } = {}) {
  const { force } = options;

  path = path.replace(/\//, '');
  const to = fsPath.resolve(`./${path}`);

  if (force || !fs.existsSync(to)) {
    const from = fsPath.resolve(`./node_modules/@uiharness/react/tmpl/${path}`);
    fs.copySync(from, to);
  }
}
