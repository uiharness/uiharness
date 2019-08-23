import { fs } from '../common';
import { Settings } from '../Settings';
import { IBundleConfig } from '../types';
import { ParcelBundler } from './libs';
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
  const tmp = settings.path.tmp;
  const electron = settings.electron;
  const out = electron.out(prod);
  const entry = Settings.toEntryPaths(electron.entry.renderer, { dir: tmp.dir, field: 'html' });

  return createBundler(entry, electron.data.bundle, prod, {
    outDir: fs.join(tmp.dir, out.renderer.dir),
    target: 'electron',
    logLevel: electron.logLevel,
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
  const tmp = settings.path.tmp;
  const web = settings.web;
  const out = web.out(prod);
  const entry = Settings.toEntryPaths(web.entry, { dir: tmp.dir, field: 'html' });

  return createBundler(entry, web.data.bundle, prod, {
    outDir: fs.join(tmp.dir, out.dir),
    target: 'browser',
    logLevel: web.logLevel,
    ...options.parcel,
  });
}

/**
 * Creates a bundler.
 */
function createBundler(
  entry: string | string[],
  bundlerConfig: IBundleConfig | undefined,
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
