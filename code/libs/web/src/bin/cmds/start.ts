import { createParcelBundler, logInfo, NpmPackage, Settings } from '../common';
import { init } from './init';

/**
 * Starts the development server.
 */
export async function start(args: { settings: Settings; pkg: NpmPackage }) {
  // Setup initial conditions.
  const { settings, pkg } = args;
  init({ settings, pkg });
  logInfo({ settings, pkg, port: true });

  // Prepare the bundler.
  const bundler = createParcelBundler(settings);

  // Start the server.
  const server = await (bundler as any).serve(settings.port);
  return server;
}
