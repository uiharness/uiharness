import { spawn } from 'child_process';

import {
  BundleTarget,
  fsPath,
  log,
  logElectronInfo,
  logNoConfig,
  logWebInfo,
  parcel,
} from '../../common';
import { Settings } from '../../settings';
import { bundleElectron } from '../cmd.bundle';
import * as init from '../cmd.init';

/**
 * Starts the development server for the given target.
 */
export async function start(args: {
  settings: Settings;
  target: BundleTarget;
}) {
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

  // Build the main JS.
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
  // NB: Spawn used to preserve colors in CLI (which execa does not do).
  const dir = fsPath.resolve(settings.path.tmp.dir);
  spawn('electron', [dir], {
    shell: true,
    stdio: 'inherit',
  });
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

  // Start the web dev-server
  await web.ensureEntries();
  const renderer = parcel.webBundler(settings);
  await (renderer as any).serve(port);
}
