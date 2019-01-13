import * as Bundler from 'parcel-bundler';

import * as filesize from 'filesize';
import { fs, fsPath, log } from './common/libs';
import { Package, Settings } from './config';

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
  Package.create().init();

  // Insert all the HTML entry points.
  const tmpl = fs.readFileSync(templatePath(`html/index.html`), 'utf-8');
  const settings = Settings.create('.');
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
  Package.create().removeScripts();
  FILES
    // Delete copied template files.
    .map(file => toRootPath(file))
    .forEach(file => fs.removeSync(file));
  fs.removeSync(fsPath.resolve('./html'));

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
  const settings = Settings.create('.');

  // Prepare the bundler.
  const entryFiles = settings.entries.map(e => e.html.absolute);
  const bundler = new Bundler(entryFiles, {});

  // Start the server.
  const server = await (bundler as any).serve(settings.port);
  return server;
}

/**
 * Runs the build packager.
 */
export async function bundle() {
  // Setup initial conditions.
  init();
  const settings = Settings.create('.');

  // Prepare the bundler.
  const entryFiles = settings.entries.map(e => e.html.absolute);
  const bundler = new Bundler(entryFiles, {});

  // Run the bundler.
  await bundler.bundle();

  // TODO - write out stats about bundle sizes.

  // Finish up.
  log.info();
  log.info.green(`✨✨  Bundle complete.`);
  log.info(`Run ${log.cyan('yarn serve')}`);
  log.info();
  process.exit(0);
}

/**
 * Prints stats about the bundle.
 */
export async function stats(options: {} = {}) {
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

  const sizes = paths
    .filter(path => !path.endsWith('.map'))
    .filter(path => !path.endsWith('.html'))
    .map(path => {
      const stats = fs.statSync(path);
      const bytes = stats.size;
      const size = filesize(bytes);
      return { path, bytes, size };
    });

  log.info.gray(`Folder: ${dir}`);
  log.info();

  const head = ['File', 'Size'].map(label => log.gray(label));
  const table = log.table({ head });
  sizes
    // .filter(e => e.path.endsWith('.js'))
    .forEach(e => {
      let file = fsPath.basename(e.path);
      file = file.endsWith('.js') ? log.yellow(file) : file;
      file = file.endsWith('.css') ? log.cyan(file) : file;
      table.add([file, e.size]);
    });
  table.log();
  log.info();
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

function templatePath(path: string) {
  return fsPath.resolve(`./node_modules/@uiharness/react/tmpl/${path}`);
}

function toRootPath(path: string) {
  path = path.replace(/\//, '');
  return fsPath.resolve(`./${path}`);
}
