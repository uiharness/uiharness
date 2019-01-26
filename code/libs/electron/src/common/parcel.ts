import { PATH } from './constants';
import { Settings } from '../Settings';
import { ParcelBundler } from './libs';
import { IParcelBuildConfig } from '../types';
import { toBundlerArgs } from './util';

export type ParcelOptions = ParcelBundler.ParcelOptions;

/**
 * The parcel bundler for the `renderer` processes.
 */
export function electronRendererBundler(
  settings: Settings,
  options: { parcel?: ParcelOptions; isProd?: boolean } = {},
) {
  const { isProd = false } = options;
  const RENDERER = PATH.ELECTRON.RENDERER;
  const outDir = isProd ? RENDERER.OUT_DIR.PROD : RENDERER.OUT_DIR.DEV;
  const electron = settings.electron;
  const entry = electron.entry.renderer;
  const bundlerArgs = electron.data.bundle;
  return createBundler(entry, bundlerArgs, {
    outDir,
    minify: isProd,
    watch: !isProd,
    target: 'electron',
    ...options.parcel,
  });
}

/**
 * Creates a bundler.
 */
export function createBundler(
  entry: string,
  bundlerConfig: IParcelBuildConfig | undefined,
  options: ParcelBundler.ParcelOptions,
) {
  const args = toBundlerArgs(bundlerConfig);
  return new ParcelBundler(entry, {
    sourceMaps: args.sourcemaps,
    scopeHoist: args.treeshake,
    ...options,
  });
}
