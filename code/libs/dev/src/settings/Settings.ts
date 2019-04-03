import { constants, fs, log, npm, NpmPackage } from '../common';
import { IConfig, ISettingsPaths, ISourcemapsConfig } from '../types';
import { ElectronSettings } from './ElectronSettings';
import { WebSettings } from './WebSettings';

export { NpmPackage };

const { PATH } = constants;
const UIHARNESS_YAML = 'uiharness.yml';

export type IUIHarnessSettingsOptions = {
  tmpDir?: string;
  templatesDir?: string;
};

/**
 * Represents the `uiharness.yml` configuration file.
 */
export class Settings {
  /**
   * Looks for the settings file within the given directory
   * and creates a new instance.
   */
  public static create(path?: string, options: IUIHarnessSettingsOptions = {}) {
    return new Settings(path, options);
  }

  /**
   * Loads the YAML at the given path.
   */
  public static load(path: string) {
    try {
      return fs.file.loadAndParseSync<IConfig>(path, {});
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
  public readonly data: IConfig;

  private _package: NpmPackage;
  private _electron: ElectronSettings;
  private _web: WebSettings;
  private _paths = {
    file: '',
    templatesDir: '',
    tmpDir: '',
    calculated: undefined as undefined | ISettingsPaths,
  };

  /**
   * Constructor.
   */
  private constructor(path: string | undefined, options: IUIHarnessSettingsOptions) {
    // Wrangle path.
    path = path ? path : '.';
    path = path.trim();
    const lstat = fs.existsSync(path) ? fs.lstatSync(path) : undefined;
    const isDirectory = lstat && lstat.isDirectory();
    path = isDirectory ? fs.join(path, UIHARNESS_YAML) : path;

    // Overridden paths.
    const tmpDir = options.tmpDir ? options.tmpDir : PATH.TMP;
    const templatesDir = options.templatesDir ? options.templatesDir : PATH.TEMPLATES;

    // Store values.
    this._paths.file = path;
    this._paths.tmpDir = tmpDir;
    this._paths.templatesDir = templatesDir;
    this.exists = fs.existsSync(path);
    this.data = this.exists ? Settings.load(path) : {};
  }

  /**
   * The display name of the app.
   */
  public get name() {
    return this.data.name || constants.UNNAMED;
  }

  public get dir() {
    return fs.dirname(this._paths.file);
  }

  /**
   * Retrieves the [package.json].
   */
  public get package(): NpmPackage {
    return this._package || (this._package = npm.pkg(this.dir));
  }

  /**
   * Retrieves the [electron] speciic settings.
   */
  public get electron(): ElectronSettings {
    return (
      this._electron ||
      (this._electron = new ElectronSettings({
        path: this.path,
        config: this.data,
      }))
    );
  }

  /**
   * Retrieves the [web/browser] speciic settings.
   */
  public get web(): WebSettings {
    return (
      this._web ||
      (this._web = new WebSettings({
        path: this.path,
        config: this.data,
      }))
    );
  }

  /**
   * Retrieves file paths.
   */
  public get path() {
    return this._paths.calculated || (this._paths.calculated = this.getPaths());
  }

  /**
   * Retrieves file paths.
   */
  public getPaths(): ISettingsPaths {
    const ROOT = fs.resolve('.');

    const fromRoot = (path: string) => {
      if (path.startsWith(ROOT)) {
        path = path.substr(ROOT.length + 1);
      }
      return path;
    };

    const templates = this._paths.templatesDir || PATH.TEMPLATES;
    const tmp = this._paths.tmpDir;
    const self = fromRoot(this._paths.file);
    return {
      self,
      dir: fs.dirname(self),
      package: fs.join(tmp, 'package.json'),
      tmp: {
        dir: tmp,
        html: fs.join('html'),
        bundle: fs.join('bundle'),
        config: fs.join('config.json'),
      },
      templates: {
        base: fs.join(templates, 'base'),
        electron: fs.join(templates, 'electron'),
        html: fs.join(templates, 'html'),
      },
    };
  }

  /**
   * Retrieves optinoal configuration for dealing with source-maps.
   */
  public get sourcemaps(): ISourcemapsConfig {
    const data = this.data.sourcemaps || {};
    const strip = data.strip || [];
    return { strip };
  }
}
