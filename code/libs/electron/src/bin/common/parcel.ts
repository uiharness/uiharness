import { PATH } from './constants';
import { ParcelBundler } from './libs';
import { Settings } from './Settings';

export type ParcelOptions = ParcelBundler.ParcelOptions;

/**
 * The parcel bundler for the `main` process.
 */
export function mainBundler(
  settings: Settings,
  options: { parcel?: ParcelOptions; isProd?: boolean } = {},
) {
  const { isProd = false } = options;
  const MAIN = PATH.MAIN;
  const entry = MAIN.ENTRY;
  return createBundler(entry, settings, {
    target: 'electron',
    outDir: MAIN.OUT_DIR,
    minify: isProd,
    watch: !isProd,
    ...options.parcel,
  });
}

/**
 * The parcel bundler for the `renderer` processes.
 */
export function rendererBundler(
  settings: Settings,
  options: { parcel?: ParcelOptions; isProd?: boolean } = {},
) {
  const { isProd = false } = options;
  const RENDERER = PATH.RENDERER;
  const outDir = isProd ? RENDERER.OUT_DIR_PROD : RENDERER.OUT_DIR;
  const entry = RENDERER.ENTRY;
  return createBundler(entry, settings, {
    outDir,
    minify: isProd,
    watch: !isProd,
    ...options.parcel,
  });
}

/**
 * Builds all bundles for distrubtion.
 */
export async function build(
  settings: Settings,
  options: { isProd?: boolean } = {},
) {
  const { isProd = false } = options;
  await buildMain(settings, { isProd });
  await buildRenderer(settings, { isProd });
}

/**
 * Builds the bundle for the `main` process.
 */
export async function buildMain(
  settings: Settings,
  options: { isProd?: boolean } = {},
) {
  const { isProd = false } = options;
  const main = mainBundler(settings, { isProd });
  await main.bundle();
}

/**
 * Builds the bundle for the `renderer` processes.
 */
export async function buildRenderer(
  settings: Settings,
  options: { isProd?: boolean } = {},
) {
  const { isProd = false } = options;
  const renderer = rendererBundler(settings, {
    isProd,
    parcel: { publicUrl: './' },
  });
  await renderer.bundle();
}

/**
 * INTERNAL
 */
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
    cacheDir: PATH.CACHE_DIR,
    ...options,
  });
}
