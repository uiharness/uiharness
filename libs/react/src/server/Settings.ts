import { IUIHarnessConfig, IUIHarnessWebpackConfig } from '../types';
import { fs, fsPath, log, jsYaml } from './common/libs';

const FILE = 'uiharness.yml';

/**
 * Reader of a `uiharness.yml` configuration file.
 */
export class Settings {
  /**
   * Looks for the settings file within the given directory
   * and creates a new instance.
   */
  public static create(dir: string) {
    const path = fsPath.resolve(dir, FILE);
    try {
      return fs.existsSync(path) ? new Settings(path) : undefined;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Loads the YAML at the given path.
   */
  public static load(path: string) {
    try {
      const text = fs.readFileSync(path, 'utf8');
      const config = jsYaml.safeLoad(text);
      return config as IUIHarnessConfig;
    } catch (error) {
      log.error('💥  ERROR UIHarness');
      log.info.yellow(`Failed to load '${FILE}' at path '${path}'.`);
      log.info.yellow(error.message);
      throw error;
    }
  }

  /**
   * Fields.
   */
  public readonly path: string;
  public readonly webpack: WebpackSettings;
  private readonly _data: IUIHarnessConfig;

  /**
   * Constructor.
   */
  private constructor(path: string) {
    this.path = path;
    this._data = Settings.load(path);
    this.webpack = new WebpackSettings(this._data.webpack);
  }
}

/**
 * Webpack configuration settings from
 * the `uiharness.yml` configuration file.
 */
export class WebpackSettings {
  private readonly _data: IUIHarnessWebpackConfig | undefined;

  public constructor(data?: IUIHarnessWebpackConfig) {
    this._data = data;
  }

  /**
   * Webpack entry paths.
   */
  public get entry(): string {
    const DEFAULT_ENTRY = '/src/index.tsx';
    let value = this._data ? this._data.entry : undefined;
    value = value ? value : DEFAULT_ENTRY;

    value = value
      .trim()
      .replace(/^\./, '')
      .replace(/^\//, '')
      .replace(/^\'/, '')
      .replace(/^\"/, '')
      .replace(/\'$/, '')
      .replace(/\"$/, '');

    return fsPath.resolve(value);
  }
}
