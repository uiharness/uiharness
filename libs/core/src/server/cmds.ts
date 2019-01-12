import { log, fs, fsPath, shell } from './libs';
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
  ensurePath('/public');
  ensurePath('/.rescriptsrc.js', { force: true });
  ensurePath('/webpack.config.js', { force: true });
  ensurePath('/uiharness.yml', { force: true });

  log.yellow('TEMP 😱 ', 'no force !!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n');
}

export function ensurePath(path: string, options: { force?: boolean } = {}) {
  const { force } = options;
  path = path.replace(/\//, '');
  const to = fsPath.resolve(`./${path}`);
  if (force || !fs.existsSync(to)) {
    const from = fsPath.resolve(`./node_modules/@uiharness/core/${path}`);
    fs.copySync(from, to);
  }
}
