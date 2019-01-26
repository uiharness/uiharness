import { file, fs, fsPath, log, npm, NpmPackage, value } from '../common/libs';
import { IUIHarnessConfig } from '../types';
import { ElectronSettings } from './ElectronSettings';

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
