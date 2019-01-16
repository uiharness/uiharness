import { logInfo, config, createBundler } from './common';
import { init } from './cmd.init';

/**
 * Starts the development server.
 */
export async function start(args: {
  settings: config.Settings;
  pkg: config.Package;
}) {
  // Setup initial conditions.
  const { settings, pkg } = args;
  init({ settings, pkg });
  logInfo({ settings, pkg, port: true });

  // Prepare the bundler.
  const bundler = createBundler(settings);

  // Start the server.
  const server = await (bundler as any).serve(settings.port);
  return server;
}
