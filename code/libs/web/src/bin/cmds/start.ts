import { createParcelBundler, logInfo, Settings } from '../common';
import { init } from './init';

/**
 * Starts the development server.
 */
export async function start(args: { settings: Settings }) {
  // Setup initial conditions.
  const { settings } = args;
  init({ settings });
  logInfo({ settings, port: true });

  // Prepare the bundler.
  const bundler = createParcelBundler(settings);

  // Start the server.
  const server = await (bundler as any).serve(settings.port);
  return server;
}
