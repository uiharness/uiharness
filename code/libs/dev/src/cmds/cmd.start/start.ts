import {
  BundleTarget,
  fs,
  log,
  logElectronInfo,
  logNoConfig,
  logWebInfo,
  parcel,
  exec,
} from '../../common';
import { Settings } from '../../settings';
import { bundleElectron } from '../cmd.bundle';
import * as init from '../cmd.init';
import * as staticAssets from '../../common/staticAssets';

/**
 * Starts the development server for the given target.
 */
export async function start(args: { settings: Settings; target: BundleTarget }) {
  const { target, settings } = args;

  switch (target) {
    case 'electron':
      return startElectron({ settings });

    case 'web':
      return startWeb({ settings });

    default:
      log.info();
      log.warn(`😩  The target "${log.yellow(target)}" is not supported.`);
      log.info();
  }
}

/**
 * Starts the [electron] development server.
 */
export async function startElectron(args: { settings: Settings }) {
  // Setup initial conditions.
  const { settings } = args;
  const prod = false;
  const electron = settings.electron;
  const port = electron.port;

  if (!electron.exists) {
    logNoConfig({ target: 'electron' });
    return;
  }

  // Ensure the module is initialized.
  await init.prepare({ settings, prod });
  await electron.ensureEntries();
  log.info();
  logElectronInfo({ settings, port: true });

  // Build the main javascript.
  await bundleElectron({
    settings,
    prod: false,
    main: true,
    renderer: false,
    summary: false,
    stats: false,
  });
  log.info();

  // Start the renderer dev-server.
  const renderer = parcel.electronRendererBundler(settings);
  await (renderer as any).serve(port);

  // Start the electron process.
  const dir = fs.resolve(settings.path.tmp.dir);
  exec.cmd
    .create('electron')
    .add(dir)
    .run();
}

/**
 * Starts the [web] development server.
 */
export async function startWeb(args: { settings: Settings }) {
  // Setup initial conditions.
  const { settings } = args;
  const web = settings.web;
  const prod = false;
  const port = web.port;

  if (!web.exists) {
    logNoConfig({ target: 'web' });
    return;
  }

  // Ensure the module is initialized.
  await init.prepare({ settings, prod });
  log.info();
  logWebInfo({ settings, port: true });

  // Copy static assets to dev server.
  // NB:  This allows referencing the assets from server during development
  //      simulating having a `static` folder end-point in [production].
  await staticAssets.copyWeb({ settings, prod });

  // Start the web dev-server
  await web.ensureEntries();
  const renderer = parcel.webBundler(settings);
  await (renderer as any).serve(port);
}
