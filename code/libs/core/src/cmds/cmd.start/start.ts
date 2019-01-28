import {
  BundleTarget,
  execa,
  fsPath,
  log,
  logElectronInfo,
  logWebInfo,
  parcel,
} from '../../common';
import { Settings } from '../../settings';
import { bundleElectron } from '../cmd.bundle';
import { init } from '../cmd.init';

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

  // Ensure the module is initialized.
  await init({ settings, prod });
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
  const dir = fsPath.resolve(settings.path.tmp.dir);
  const cmd = `electron ${dir}`;
  const childProcess = execa.shell(cmd);
  childProcess.stdout.pipe(process.stdout);
  await childProcess;
}

/**
 * Starts the [web] development server.
 */
export async function startWeb(args: { settings: Settings }) {
  // Setup initial conditions.
  const { settings } = args;
  const prod = false;
  const port = settings.web.port;

  // Ensure the module is initialized.
  await init({ settings, prod });
  log.info();
  logWebInfo({ settings, port: true });

  // Start the web dev-server
  await settings.web.ensureEntries();
  const renderer = parcel.webBundler(settings);
  await (renderer as any).serve(port);
}
