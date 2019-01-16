import * as ParcelBundler from 'parcel-bundler';

import { config, logInfo } from '../common';
import { init } from './init';

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

  // Prepare HTML/JS dev-server.
  const parcel = createParcelBundler(settings);
  const parcelServer = await (parcel as any).serve(settings.port);
}

/**
 * INTERNAL
 */

function createParcelBundler(settings: config.Settings) {
  const args = settings.buildArgs;
  const entryFiles = 'src/renderer/index.html';
  const outDir = 'src/renderer/.parcel/development';
  return new ParcelBundler(entryFiles, {
    target: 'electron',
    sourceMaps: args.sourcemaps,
    scopeHoist: args.treeshake,
    outDir,
  });
}
