import { fs, fsPath, shell } from './libs';
import { exec } from './util';

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
export function dist() {
  ensureConfiguration();
  const cmd = fsPath.resolve('./node_modules/.bin/rescripts build');
  exec(cmd);
}

/**
 * Serve the built app.
 */
export function serve() {
  ensureConfiguration();
  if (!fs.existsSync(fsPath.resolve('./build'))) {
    dist();
  }
  shell.exec('serve -s build');
}

/**
 * INTERNAL
 */

export function ensureConfiguration() {
  // Copy `public` folder to root of the consuming project.
  const publicDir = fsPath.resolve('./public');
  if (!fs.existsSync(publicDir)) {
    fs.copySync(
      fsPath.resolve('./node_modules/@uiharness/core/public'),
      publicDir,
    );
  }

  // Copy rescript config.
  // https://github.com/harrysolovay/rescripts
  const rescriptConfig = fsPath.resolve('./.rescriptsrc.js');
  if (!fs.existsSync(rescriptConfig)) {
    fs.copySync(
      fsPath.resolve('./node_modules/@uiharness/core/.rescriptsrc.js'),
      rescriptConfig,
    );
  }
}
