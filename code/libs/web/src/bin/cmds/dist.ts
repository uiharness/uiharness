import {
  createParcelBundler,
  log,
  logInfo,
  NpmPackage,
  Settings,
} from '../common';
import { init } from './init';
import { stats } from './stats';

/**
 * Runs the build packager.
 */
export async function dist(args: { settings: Settings; pkg: NpmPackage }) {
  // Setup initial conditions.
  const { settings, pkg } = args;
  process.env.NODE_ENV = 'production';
  init({ settings, pkg });
  logInfo({ settings, pkg, port: false });

  // Prepare the bundler.
  const bundler = createParcelBundler(settings);

  // Run the bundler.
  await bundler.bundle();

  // Finish up.
  stats({ settings, pkg, moduleInfo: false });
  log.info(`Run ${log.cyan('yarn serve')} to view in browser.`);
  log.info();
  process.exit(0);
}
