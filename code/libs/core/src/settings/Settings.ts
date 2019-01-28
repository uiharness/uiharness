import {
  file,
  fs,
  fsPath,
  log,
  npm,
  NpmPackage,
  value,
  constants,
} from '../common';
import { IUIHarnessConfig, IUIHarnessPaths } from '../types';
import { ElectronSettings } from './ElectronSettings';
import { WebSettings } from './WebSettings';

export { NpmPackage };

const { resolve, join } = fsPath;
const { PATH } = constants;
const UIHARNESS_YAML = 'uiharness.yml';
const defaultValue = value.defaultValue;

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
  public readonly data: IUIHarnessConfig;

  private _package: NpmPackage;
  private _electron: ElectronSettings;
  private _web: WebSettings;
  private _paths = {
    file: '',
    templatesDir: '',
    tmpDir: '',
    calculated: undefined as undefined | IUIHarnessPaths,
  };

  /**
   * Constructor.
   */
  private constructor(
    path: string | undefined,
    options: IUIHarnessSettingsOptions,
  ) {
    // Wrangle path.
    path = path ? path : '.';
    path = path.trim();
    const lstat = fs.existsSync(path) ? fs.lstatSync(path) : undefined;
    const isDirectory = lstat && lstat.isDirectory();
    path = isDirectory ? join(path, UIHARNESS_YAML) : path;

    // Overridden paths.
    const tmpDir = options.tmpDir ? options.tmpDir : PATH.TMP;
    const templatesDir = options.templatesDir
      ? options.templatesDir
      : PATH.TEMPLATES;

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
    return fsPath.dirname(this._paths.file);
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

  /**
   * Retrieves file paths.
   */
  public get path() {
    return this._paths.calculated || (this._paths.calculated = this.getPaths());
  }

  /**
   * Retrieves file paths.
   */
  public getPaths(): IUIHarnessPaths {
    const ROOT = resolve('.');

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
      dir: fsPath.dirname(self),
      package: fsPath.join(tmp, 'package.json'),
      tmp: {
        dir: tmp,
        html: join(tmp, 'html'),
        bundle: join(tmp, '.bundle'),
        config: join(tmp, 'config.json'),
      },
      templates: {
        base: join(templates, 'base'),
        electron: join(templates, 'electron'),
        html: join(templates, 'html'),
      },
    };
  }
}
