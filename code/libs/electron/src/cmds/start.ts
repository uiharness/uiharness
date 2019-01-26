import { constants, execa, fsPath, log, logInfo, parcel } from '../common';
import { Settings } from '../settings';
import { bundleElectron } from './bundle';
import { init } from './init';

const { PATH } = constants;

/**
 * Starts the development server.
 */
export async function start(args: { settings: Settings }) {
  // Setup initial conditions.
  const { settings } = args;
  const prod = false;
  const port = settings.electron.port;

  // Ensure the module is initialized.
  await init({ settings, prod });
  log.info();
  logInfo({ settings, port: true });

  // Build the main JS.
  await bundleElectron({
    settings,
    prod: false,
    main: true,
    renderer: false,
    summary: false,
  });
  log.info();

  // Start the renderer JS builder.
  const renderer = parcel.electronRendererBundler(settings);
  await (renderer as any).serve(port);

  // Start the electron server.
  const dir = fsPath.resolve(PATH.UIHARNESS);
  const cmd = `electron ${dir}`;
  const childProcess = execa.shell(cmd);
  childProcess.stdout.pipe(process.stdout);
  await childProcess;
}
