import { IUIHarnessElectronConfig, IElectronBuilderConfig } from '../../types';
import { fs, fsPath, file, log, NpmPackage, value, npm } from './libs';

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
      return file.loadAndParseSync<IUIHarnessElectronConfig>(path, {});
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
  private _package: NpmPackage | undefined;
  private _builderConfig: IElectronBuilderConfig | undefined;

  /**
   * Constructor.
   */
  private constructor(path: string) {
    this.path = path;
    this.dir = fsPath.dirname(path);
    this._data = fs.existsSync(path) ? Settings.load(path) : {};
  }

  /**
   * The port to run the dev-server on.
   */
  public get port() {
    return this._data.port || 1234;
  }

  /**
   * Retrieves the [package.json].
   */
  public get package(): NpmPackage {
    return this._package || (this._package = npm.pkg(this.dir));
  }

  /**
   * Arguments to pass to the parcel-bundler.
   */
  public get bundlerArgs() {
    const data = this._data.build || {};
    const sourcemaps = value.defaultValue(data.sourcemaps, true);
    const treeshake = value.defaultValue(data.treeshake, false);
    return { sourcemaps, treeshake };
  }

  /**
   * The raw [electron-builder.yml] configuration data.
   */
  public get builderConfig() {
    const load = () => {
      const dir = fsPath.resolve(this.dir);
      const path = fsPath.join(dir, 'electron-builder.yml');
      return file.loadAndParseSync<IElectronBuilderConfig>(path, {});
    };
    return this._builderConfig || (this._builderConfig = load());
  }

  /**
   * Extrapolated [electron-builder.yml] values.
   */
  public get builderArgs() {
    const config = this.builderConfig;
    const productName = config ? config.productName : undefined;
    const appId = config ? config.appId : undefined;
    const directories = config ? config.directories : undefined;
    const outputDir = directories ? directories.output : undefined;
    return {
      productName,
      appId,
      outputDir,
    };
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
