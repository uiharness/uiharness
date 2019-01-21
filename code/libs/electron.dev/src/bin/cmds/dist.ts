import {
  parcel,
  log,
  Settings,
  Package,
  logInfo,
  fsPath,
  constants,
  electron,
} from '../common';
import { init } from './init';

/**
 * Bundles the application ready for distribution.
 */
export async function dist(args: { settings: Settings; pkg: Package }) {
  const { settings, pkg } = args;
  const mainEntry = fsPath.resolve(constants.PATH.MAIN_ENTRY);
  process.env.NODE_ENV = 'production';

  // Ensure the module is initialized.
  await init({ settings, pkg });
  logInfo({ settings, pkg, port: false, mainEntry });

  // Build JS bundles and run the electorn-builder.
  await parcel.build(settings, { isProd: true });
  log.info();
  await electron.build();

  // Finish up.
  log.info();
  process.exit(0);
}
