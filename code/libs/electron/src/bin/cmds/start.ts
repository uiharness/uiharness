import { constants, execa, fsPath, log, logInfo, parcel } from '../common';
import { Settings } from '../settings';
import { bundle } from './bundle';
import { init } from './init';

/**
 * Starts the development server.
 */
export async function start(args: { settings: Settings }) {
  // Setup initial conditions.
  const { settings } = args;
  const port = settings.electron.port;
  const mainEntry = constants.PATH.MAIN.ENTRY;

  // Ensure the module is initialized.
  await init({ settings });
  logInfo({ settings, port: true, mainEntry });

  // Build the main JS.
  await bundle({
    settings,
    prod: false,
    main: true,
    renderer: false,
    noSummary: true,
  });
  log.info();

  // Start the renderer JS builder.
  const renderer = parcel.rendererBundler(settings);
  await (renderer as any).serve(port);

  // Start the electron server.
  const cmd = `cd ${fsPath.resolve('.')} && electron .`;
  const childProcess = execa.shell(cmd);
  childProcess.stdout.pipe(process.stdout);
  await childProcess;
}
