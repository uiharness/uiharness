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
  options: { parcel?: ParcelOptions; prod?: boolean } = {},
) {
  const { prod = false } = options;
  const electron = settings.electron;
  const out = electron.out(prod);
  const entry = electron.entry.renderer;
  return createBundler(entry, electron.data.bundle, prod, {
    outDir: out.renderer.dir,
    target: 'electron',
    ...options.parcel,
  });
}

/**
 * The parcel bundler for the `web` target.
 */
export function webBundler(
  settings: Settings,
  options: { parcel?: ParcelOptions; prod?: boolean } = {},
) {
  const { prod = false } = options;
  const web = settings.web;
  const out = web.out(prod);
  const entry = web.entry;
  return createBundler(entry, web.data.bundle, prod, {
    outDir: out.dir,
    target: 'browser',
    ...options.parcel,
  });
}

/**
 * Creates a bundler.
 */
function createBundler(
  entry: string,
  bundlerConfig: IParcelBuildConfig | undefined,
  prod: boolean,
  options: ParcelBundler.ParcelOptions,
) {
  const args = toBundlerArgs(bundlerConfig);
  return new ParcelBundler(entry, {
    minify: prod,
    watch: !prod,
    sourceMaps: args.sourcemaps,
    scopeHoist: args.treeshake,
    ...options,
  });
}
