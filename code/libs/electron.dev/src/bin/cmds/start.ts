import {
  constants,
  execa,
  fsPath,
  logInfo,
  NpmPackage,
  parcel,
  Settings,
} from '../common';
import { init } from './init';

/**
 * Starts the development server.
 */
export async function start(args: { settings: Settings; pkg: NpmPackage }) {
  // Setup initial conditions.
  const { settings, pkg } = args;
  const port = settings.port;
  const mainEntry = constants.PATH.MAIN_ENTRY;

  // Ensure the module is initialized.
  await init({ settings, pkg });
  logInfo({ settings, pkg, port: true, mainEntry });

  // Build the main JS.
  await parcel.buildMain(settings);
  // const main = parcel.mainBundler(settings);
  // await main.bundle();

  // Start the renderer JS builder.
  const renderer = parcel.rendererBundler(settings);
  await (renderer as any).serve(port);

  // Start the electron server.
  const cmd = `cd ${fsPath.resolve('.')} && electron .`;
  const childProcess = execa.shell(cmd);
  childProcess.stdout.pipe(process.stdout);
  await childProcess;
}
