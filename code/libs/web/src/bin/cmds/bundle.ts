import { log } from '../common';
import { init } from './init';
import { stats } from './stats';
import { Settings, Package } from '../Settings';
import { logInfo, createParcelBundler } from '../util';

/**
 * Runs the build packager.
 */
export async function bundle(args: { settings: Settings; pkg: Package }) {
  // Setup initial conditions.
  const { settings, pkg } = args;
  init({ settings, pkg });
  logInfo({ settings, pkg, port: true });

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
