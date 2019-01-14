import { IUIHarnessConfig, IUIHarnessEntry } from '../../types';
import { fs, fsPath, log, jsYaml, value } from '../common/libs';
import { Package } from './Package';
import { ParcelOptions } from 'parcel-bundler';

const UIHARNESS_YAML = 'uiharness.yml';

/**
 * Reader of a `uiharness.yml` configuration file.
 */
export class Settings {
  /**
   * Looks for the settings file within the given directory
   * and creates a new instance.
   */
  public static create(path?: string) {
    path = path ? path : '.';
    path = path.trim();
    path = path.endsWith('package.json')
      ? path
      : fsPath.join(path, UIHARNESS_YAML);
    return new Settings(fsPath.resolve(path));
  }

  /**
   * Loads the YAML at the given path.
   */
  public static load(path: string) {
    try {
      const text = fs.readFileSync(path, 'utf8');
      const config = jsYaml.safeLoad(text) || {};
      return config as IUIHarnessConfig;
    } catch (error) {
      log.error('💥  ERROR UIHarness');
      log.info.yellow(`Failed to load '${UIHARNESS_YAML}' at path '${path}'.`);
      log.info.yellow(error.message);
      throw error;
    }
  }

  /**
   * Fields.
   */
  public readonly dir: string;
  public readonly path: string;
  private readonly _data: IUIHarnessConfig;
  private readonly pkg: Package;

  /**
   * Constructor.
   */
  private constructor(path: string) {
    this.path = path;
    this.dir = fsPath.dirname(path);
    this.pkg = Package.create();
    this._data = fs.existsSync(path) ? Settings.load(path) : {};
  }

  /**
   * The port to run the dev-server on.
   */
  public get port() {
    return this._data.port || 1234;
  }

  /**
   * Retrieves the entry path(s).
   */
  public get entries(): IUIHarnessEntry[] {
    const value =
      this._data && this._data.entry ? this._data.entry : '/src/uiharness.tsx';
    const paths = Array.isArray(value) ? value : [value];
    return paths
      .map(e => (typeof e === 'object' ? e : { path: e }) as IUIHarnessEntry)
      .map(e => ({ ...e, path: resolvePath(e.path) }))
      .map(e => ({ ...e, html: asHtmlPath(e.path, this.dir) }))
      .map(e => ({ ...e, exists: fs.existsSync(e.path) }))
      .map(e => ({ ...e, title: e.title || this.pkg.name || 'Unnamed' }));
  }

  public get buildArgs(): ParcelOptions {
    const data = this._data;
    const sourceMaps = value.defaultValue(data.sourcemaps, true);
    const scopeHoist = value.defaultValue(data.treeshake, false);
    const target = value.defaultValue(data.target, 'browser');
    return { sourceMaps, scopeHoist, target };
  }
}

/**
 * INTERNAL
 */
function resolvePath(path?: string) {
  return fsPath.resolve(`./${cleanPath(path)}`);
}

function cleanPath(path?: string) {
  return path
    ? path
        .trim()
        .replace(/^\./, '')
        .replace(/^\//, '')
        .replace(/^\'/, '')
        .replace(/^\"/, '')
        .replace(/\'$/, '')
        .replace(/\"$/, '')
    : path;
}

function asHtmlPath(path: string, root: string) {
  path = path
    .trim()
    .substr(root.length)
    .replace(/^\//, '')
    .replace(/^src\//, '');
  const absolute = fsPath.join('html', fsPath.dirname(path), 'index.html');

  const depth = path.split('/').length + 1;
  const up = Array.from({ length: depth }).join('../');
  const relative = fsPath.join(up, 'src', path);

  return { absolute: resolvePath(absolute), relative };
}
