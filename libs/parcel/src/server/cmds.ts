import * as Bundler from 'parcel-bundler';

import * as filesize from 'filesize';
import { R, fs, fsPath, log, value as valueUtil } from './common/libs';
import { Package, Settings } from './config';
import { IBuildArgs } from '../types';

const ROOT_DIR = fsPath.resolve('.');
const settings = Settings.create('.');
const pkg = Package.create();

const FILES = [
  '/.prettierrc',
  '/tsconfig.json',
  '/tslint.json',
  '/uiharness.yml',
];

/**
 * Ensure the module is initialized.
 */
export async function init(options: { force?: boolean } = {}) {
  const { force = false } = options;
  FILES.forEach(file => ensureFile(file));
  pkg.init();

  // Insert all the HTML entry points.
  const tmpl = fs.readFileSync(templatePath(`html/index.html`), 'utf-8');
  settings.entries
    .filter(e => force || !fs.pathExistsSync(e.html.absolute))
    .forEach(e => {
      const path = e.html.absolute;
      const html = tmpl
        .replace(/__TITLE__/, e.title)
        .replace(/__ENTRY_SCRIPT__/, e.html.relative);
      fs.ensureDirSync(fsPath.dirname(path));
      fs.writeFileSync(path, html);
    });
}

/**
 * Removes configuration files.
 */
export async function debugReset() {
  pkg.removeScripts();
  FILES
    // Delete copied template files.
    .map(file => toRootPath(file))
    .forEach(file => fs.removeSync(file));

  fs.removeSync(fsPath.resolve('./html'));
  fs.removeSync(fsPath.resolve('./.cache'));
  fs.removeSync(fsPath.resolve('./dist'));

  // Log results.
  log.info('');
  log.info(
    '👋   The auto-generated files and scripts from UIHarness have been removed.',
  );
  log.info(`    Run \`${log.cyan('uiharness init')}\` to recreate them.`);
  log.info('');
}

export function createBundler(entryFiles: string[], args: IBuildArgs = {}) {
  const { sourcemaps: sourceMaps, treeshaking: scopeHoist, target } = args;
  return new Bundler(entryFiles, {
    sourceMaps,
    scopeHoist,
    target,
  });
}

/**
 * Starts in dev mode.
 */
export async function start(options: IBuildArgs = {}) {
  // Setup initial conditions.
  init();
  logInfo();

  // Prepare the bundler.
  const entryFiles = settings.entries.map(e => e.html.absolute);
  const bundler = createBundler(entryFiles, options);

  // Start the server.
  const server = await (bundler as any).serve(settings.port);
  return server;
}

/**
 * Runs the build packager.
 */
export async function bundle(options: IBuildArgs = {}) {
  // Setup initial conditions.
  init();
  logInfo();

  // Prepare the bundler.
  const entryFiles = settings.entries.map(e => e.html.absolute);
  const bundler = createBundler(entryFiles, options);

  // Run the bundler.
  await bundler.bundle();

  // Finish up.
  stats({ moduleInfo: false });
  log.info(`Run ${log.cyan('yarn serve')} to view in browser.`);
  log.info();
  process.exit(0);
}

/**
 * Prints stats about the bundle.
 */
export async function stats(options: { moduleInfo?: boolean } = {}) {
  const moduleInfo = valueUtil.defaultValue(options.moduleInfo, true);
  if (moduleInfo) {
    logInfo();
  }

  const dir = fsPath.resolve('./dist');
  const getPaths = () => {
    return fs.pathExistsSync(dir)
      ? fs.readdirSync(dir).map(path => fsPath.resolve(`./dist/${path}`))
      : [];
  };

  const paths = getPaths();
  if (paths.length === 0) {
    log.info(`👋   Looks like there is no bundle to analyze.`);
    log.info(`    Run ${log.cyan('yarn bundle')}`);
    log.info();
    return;
  }

  let sizes = paths
    .filter(path => !path.endsWith('.map'))
    .filter(path => !path.endsWith('.html'))
    .map(path => {
      const stats = fs.statSync(path);
      const bytes = stats.size;
      const size = filesize(bytes);
      return { path, bytes, size };
    });
  sizes = R.sortBy(R.prop('bytes'), sizes);
  sizes.reverse();

  const head = ['File', 'Size'].map(label => log.gray(label));
  const table = log.table({ head });
  sizes.forEach(e => {
    let file = fsPath.basename(e.path);
    file = file.endsWith('.js') ? log.yellow(file) : file;
    file = file.endsWith('.css') ? log.cyan(file) : file;
    table.add([file, e.size]);
  });

  log.info.gray(`${dir}`);
  table.log();
  log.info();
}

/**
 * INTERNAL
 */

const formatPath = (path: string) => {
  let dir = fsPath.dirname(path);
  dir = dir.substr(ROOT_DIR.length);
  const file = fsPath.basename(path);
  return `${dir}/${log.cyan(file)}`;
};

function logInfo() {
  const entryFiles = settings.entries.map(e => e.html.absolute);
  log.info();
  log.info.gray(`package: ${log.magenta(pkg.name)}`);
  log.info.gray(`version: ${pkg.version}`);
  log.info.gray(`entry:   ${formatPath(entryFiles[0])}`);
  entryFiles.slice(1).forEach(path => {
    log.info.gray(`         ${formatPath(path)}`);
  });
  log.info();
}

function ensureFile(path: string, options: { force?: boolean } = {}) {
  const { force } = options;
  const to = toRootPath(path);
  if (force || !fs.existsSync(to)) {
    const from = templatePath(path);
    fs.copySync(from, to);
  }
}

function templatePath(path: string) {
  return fsPath.resolve(`./node_modules/@uiharness/parcel/tmpl/${path}`);
}

function toRootPath(path: string) {
  path = path.replace(/\//, '');
  return fsPath.resolve(`./${path}`);
}
