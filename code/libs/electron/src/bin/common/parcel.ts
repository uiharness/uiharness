import { ParcelBundler } from './libs';
import { Settings } from './Settings';

/**
 * The parcel bundler for the `main` process.
 */
export function createMainBundler(entry: string, settings: Settings) {
  const outDir = 'src/main/.parcel';
  const outFile = 'main';
  return createBundler(entry, settings, { outDir, outFile });
}

/**
 * The parcel bundler for the `renderer` processes.
 */
export function createRendererBundler(settings: Settings) {
  const entry = 'src/renderer/index.html';
  const outDir = 'src/renderer/.parcel/development';
  return createBundler(entry, settings, { outDir });
}

function createBundler(
  entry: string,
  settings: Settings,
  options: ParcelBundler.ParcelOptions,
) {
  const args = settings.buildArgs;
  return new ParcelBundler(entry, {
    target: 'electron',
    sourceMaps: args.sourcemaps,
    scopeHoist: args.treeshake,
    ...options,
  });
}
