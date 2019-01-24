import { PATH } from './constants';
import { ParcelBundler } from './libs';
import { Settings } from './Settings';

export type ParcelOptions = ParcelBundler.ParcelOptions;

/**
 * The parcel bundler for the `renderer` processes.
 */
export function rendererBundler(
  settings: Settings,
  options: { parcel?: ParcelOptions; isProd?: boolean } = {},
) {
  const { isProd = false } = options;
  const RENDERER = PATH.RENDERER;
  const outDir = isProd ? RENDERER.OUT_DIR.PROD : RENDERER.OUT_DIR.DEV;
  const entry = RENDERER.ENTRY;
  return createBundler(entry, settings, {
    outDir,
    minify: isProd,
    watch: !isProd,
    ...options.parcel,
  });
}

/**
 * INTERNAL
 */
function createBundler(
  entry: string,
  settings: Settings,
  options: ParcelBundler.ParcelOptions,
) {
  const args = settings.bundlerArgs;
  return new ParcelBundler(entry, {
    target: 'electron',
    sourceMaps: args.sourcemaps,
    scopeHoist: args.treeshake,
    ...options,
  });
}
