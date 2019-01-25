import {
  IUIHarnessConfig,
  IElectronBuilderConfig,
  IUIHarnessElectronConfig,
} from '../../types';
import { fs, fsPath, file, log, NpmPackage, value, npm } from '../common/libs';
import { ElectronSettings } from './ElectronSettings';
import * as util from './util';

export { NpmPackage };

const UIHARNESS_YAML = 'uiharness.yml';
const defaultValue = value.defaultValue;

/**
 * Represents the `uiharness.yml` configuration file.
 */
export class Settings {
  /**
   * Looks for the settings file within the given directory
   * and creates a new instance.
   */
  public static create(path?: string) {
    path = path ? path : '.';
    path = path.trim();
    path = fsPath.resolve(path);
    const lstat = fs.existsSync(path) ? fs.lstatSync(path) : undefined;
    path =
      lstat && lstat.isDirectory() ? fsPath.join(path, UIHARNESS_YAML) : path;
    return new Settings(path);
  }

  /**
   * Loads the YAML at the given path.
   */
  public static load(path: string) {
    try {
      return file.loadAndParseSync<IUIHarnessConfig>(path, {});
    } catch (error) {
      log.error('💥  ERROR UIHarness');
      log.info.yellow(`Failed to load UIHarness congfig at path '${path}'.`);
      log.info.yellow(error.message);
      throw error;
    }
  }

  /**
   * Fields.
   */
  public readonly exists: boolean;
  public readonly dir: string;
  public readonly path: string;
  public readonly data: IUIHarnessConfig;

  private _package: NpmPackage;
  private _electron: ElectronSettings;
  private _builderConfig: IElectronBuilderConfig;

  /**
   * Constructor.
   */
  private constructor(path: string) {
    this.path = path;
    this.dir = fsPath.dirname(path);
    this.exists = fs.existsSync(path);
    this.data = this.exists ? Settings.load(path) : {};
  }

  /**
   * Retrieves the [package.json].
   */
  public get package(): NpmPackage {
    return this._package || (this._package = npm.pkg(this.dir));
  }

  /**
   * Retrieves the electron speciic settings.
   */
  public get electron(): ElectronSettings {
    return (
      this._electron ||
      (this._electron = new ElectronSettings({
        dir: this.dir,
        data: this.data.electron,
      }))
    );
  }

  /**
   * The port to run the dev-server on.
   */
  public get ___port() {
    return this.data.port || 1234;
  }

  /**
   * Arguments to pass to the parcel-bundler.
   */
  public get ____bundlerArgs() {
    return util.toBundlerArgs(this.data.bundle);
  }

  /**
   * The raw [electron-builder.yml] configuration data.
   */
  public get ____builderArgsJson() {
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
  public get ____builderArgs() {
    const config = this.____builderArgsJson;
    if (!config) {
      return {};
    }
    const { productName, appId, directories } = config;
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
    const init = this.data.init || {};
    return {
      scripts: defaultValue(init.scripts, true),
      files: defaultValue(init.files, true),
      html: defaultValue(init.html, true),
      deps: defaultValue(init.deps, true),
    };
  }
}
