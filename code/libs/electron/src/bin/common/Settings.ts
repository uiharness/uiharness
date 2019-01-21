import { IUIHarnessElectronConfig, IUIHarnessEntry } from '../../types';
import {
  config,
  fs,
  fsPath,
  jsYaml,
  log,
  npm,
  NpmPackage,
  value,
} from './libs';

export { NpmPackage };

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
      return config as IUIHarnessElectronConfig;
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
  private readonly _data: IUIHarnessElectronConfig;
  private readonly pkg: npm.NpmPackage;

  /**
   * Constructor.
   */
  private constructor(path: string) {
    this.path = path;
    this.dir = fsPath.dirname(path);
    this.pkg = npm.pkg('.');
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
    const entry = this._data ? this._data.entry : undefined;
    return config.toEntries({
      entry,
      defaultValue: '/src/uiharness.tsx',
      dir: this.dir,
      moduleName: this.pkg.name,
    });
  }

  /**
   * Arguments to pass to the parcel-bundler.
   */
  public get buildArgs() {
    const data = this._data.build || {};
    const sourcemaps = value.defaultValue(data.sourcemaps, true);
    const treeshake = value.defaultValue(data.treeshake, false);
    return { sourcemaps, treeshake };
  }

  /**
   * Flags used to determine what to inclue/exclude
   * within the `init` script.
   */
  public get init() {
    const init = this._data.init || {};
    return {
      scripts: value.defaultValue(init.scripts, true),
      files: value.defaultValue(init.files, true),
      html: value.defaultValue(init.html, true),
      deps: value.defaultValue(init.deps, true),
    };
  }
}
