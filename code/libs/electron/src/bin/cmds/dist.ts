import {
  constants,
  electron,
  log,
  logInfo,
  NpmPackage,
  parcel,
  Settings,
} from '../common';
import { init } from './init';

const { PATH } = constants;

/**
 * Bundles the application ready for distribution.
 */
export async function dist(args: { settings: Settings; pkg: NpmPackage }) {
  const { settings, pkg } = args;
  process.env.NODE_ENV = 'production';

  // Ensure the module is initialized.
  await init({ settings, pkg });
  logInfo({ settings, pkg, port: false, mainEntry: PATH.MAIN.ENTRY });

  // Build JS bundles and run the electorn-builder.
  await parcel.build(settings, { isProd: true });
  log.info();
  await electron.build();

  // Finish up.
  log.info();
  process.exit(0);
}
