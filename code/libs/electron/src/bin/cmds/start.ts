import * as execa from 'execa';
import * as ParcelBundler from 'parcel-bundler';

import { config, fs, fsPath, logInfo } from '../common';
import { init } from './init';

/**
 * Starts the development server.
 */
export async function start(args: {
  settings: config.Settings;
  pkg: config.Package;
}) {
  // Setup initial conditions.
  const { settings, pkg } = args;
  const main = fsPath.resolve('./src/main/main.ts');
  const port = settings.port;

  init({ settings, pkg });
  logInfo({ settings, pkg, port: true, main });

  // Save settings as JSON to local project.
  await saveConfigJson({ settings });

  // Build the main JS.
  const parcelMain = createMainBundler(main, settings);
  await parcelMain.bundle();

  // Start the renderer JS builder.
  const parcelRenderer = createRendererBundler(settings);
  await (parcelRenderer as any).serve(port);

  /**
   * 🐷🐷🐷 TODO 🐷🐷🐷
   * - clean up `tsconfig.json` (rootDir => include:[src] in the base @tdb/typescript)
   * - remove `common` from raw template (too @tdb specific)
   * - HMR?
   * - set `main` in package.json to `src/main/.parcel/main.js`
   * - get logging from main showing up in console.
   * - make specific `Settings` config version for @uiharness/electron.
   * - move specific `Settings` for web into @uiharness/web
   * - remove `babel` deps from @uiharness/electron (bought in by parcel??)
   * - delete electron/bootrap specific scripts from this module.
   * - settings
   *    - main app title?
   * - template for create-uiharness: `yarn create uiharness` => electron (tmpl)
   * - update `electron-builder.yml` with template values.
   * - update `@types/react` in util (make sure it's actually working now)
   *    - remove `resolutions` from `package.json` in `create-uiharness` (once React types are updated in @tdb/util)
   * - get `web` create templates as minimal as `electron` (copying in tsconfig.json, tslint.json)
   */

  // Start the electron server.
  const cmd = `cd ${fsPath.resolve('.')} && electron .`;
  const childProcess = execa.shell(cmd);
  childProcess.stdout.pipe(process.stdout);
  await childProcess;
}

/**
 * INTERNAL
 */

/**
 * Saves configuration JSON to the target module to be imported
 * by the consuming components.
 */
async function saveConfigJson(args: { settings: config.Settings }) {
  const { port } = args.settings;
  const data = { port };
  const dir = fsPath.resolve('./.uiharness');
  const path = fsPath.join(dir, 'config.json');
  const json = `${JSON.stringify(data, null, '  ')}\n`;
  await fs.ensureDir(dir);
  await fs.writeFile(path, json);
}

function createMainBundler(entry: string, settings: config.Settings) {
  const outDir = 'src/main/.parcel';
  const outFile = 'main';
  return createBundler(entry, settings, { outDir, outFile });
}

function createRendererBundler(settings: config.Settings) {
  const entry = 'src/renderer/index.html';
  const outDir = 'src/renderer/.parcel/development';
  return createBundler(entry, settings, { outDir });
}

function createBundler(
  entry: string,
  settings: config.Settings,
  options: ParcelBundler.ParcelOptions,
) {
  const args = settings.buildArgs;
  return new ParcelBundler(entry, {
    target: 'electron',
    sourceMaps: args.sourcemaps,
    scopeHoist: args.treeshake,
    ...options,
  });
}
