import { createParcelBundler, log, logInfo, Settings } from '../common';
import { init } from './init';
import { stats } from './stats';

/**
 * Runs the build packager.
 */
export async function dist(args: { settings: Settings }) {
  // Setup initial conditions.
  const { settings } = args;
  process.env.NODE_ENV = 'production';
  init({ settings });
  logInfo({ settings, port: false });

  // Prepare the bundler.
  const bundler = createParcelBundler(settings);

  // Run the bundler.
  await bundler.bundle();

  // Finish up.
  stats({ settings, moduleInfo: false });
  log.info(`Run ${log.cyan('yarn serve')} to view in browser.`);
  log.info();
  process.exit(0);
}
