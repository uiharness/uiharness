import {
  execa,
  fs,
  fsPath,
  logInfo,
  Package,
  parcel,
  Settings,
  constants,
  ParcelBundler,
} from '../common';
import { init } from './init';

/**
 * Starts the development server.
 */
export async function start(args: { settings: Settings; pkg: Package }) {
  // Setup initial conditions.
  const { settings, pkg } = args;
  const port = settings.port;

  // Calculate the main entry-point.
  const mainPath = fsPath.resolve('./src/main/main.ts');

  // Ensure the module is initialized.
  await init({ settings, pkg });
  logInfo({ settings, pkg, port: true, main: mainPath });

  // Save settings as JSON to local project.
  await saveConfigJson({ settings });

  // Build the main JS.
  const main = parcel.createMainBundler(mainPath, settings);
  await main.bundle();

  // Start the renderer JS builder.
  const renderer = parcel.createRendererBundler(settings);
  await (renderer as any).serve(port);

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
async function saveConfigJson(args: { settings: Settings }) {
  const { port } = args.settings;
  const data = { port };
  const dir = fsPath.resolve(constants.CONFIG.DIR);
  const path = fsPath.join(dir, constants.CONFIG.FILE);
  const json = `${JSON.stringify(data, null, '  ')}\n`;
  await fs.ensureDir(dir);
  await fs.writeFile(path, json);
}
