import { PATH } from './constants';
import { fsPath, ParcelBundler } from './libs';
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
  const entry = fsPath.resolve(PATH.MAIN_ENTRY);
  const outDir = 'src/main/.parcel';
  const outFile = 'main';
  return createBundler(entry, settings, {
    target: 'electron',
    outDir,
    outFile,
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
  const entry = 'src/renderer/index.html';
  const outDir = 'src/renderer/.parcel/development';
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
    parcel: {
      publicUrl: './',
      outDir: 'src/renderer/.parcel/production',
    },
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
    ...options,
  });
}
