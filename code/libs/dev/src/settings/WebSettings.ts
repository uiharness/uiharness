import { fs, constants, value, toBundlerArgs } from '../common';
import { IConfig, ISettingsPaths, IWebConfig, LogLevel } from '../types';
import { ensureEntries } from './util';

const { DEFAULT } = constants;

type ICalculatedPaths = {
  defaultEntry: { code: string; html: string };
  out: {
    file: string;
    dir: { prod: string; dev: string };
  };
};

type IPaths = {
  parent: ISettingsPaths;
  calculated?: ICalculatedPaths;
};

/**
 * Represents the `web` section of the `uiharness.yml` configuration file.
 */
export class WebSettings {
  public readonly data: IWebConfig;
  public readonly exists: boolean;

  private readonly _config: IConfig;
  private _paths: IPaths;

  /**
   * Constructor.
   */
  constructor(args: { path: ISettingsPaths; config: IConfig }) {
    const { config } = args;
    this._paths = { parent: args.path };
    this._config = config;
    this.data = config.web || {};
    this.exists = Boolean(config.web);
  }

  /**
   * The port to run the dev-server on.
   */
  public get port() {
    return value.defaultValue(this.data.port, 1234);
  }

  /**
   * The level of logging to include.
   * https://parceljs.org/cli.html#change-log-level
   */
  public get logLevel(): LogLevel {
    const bundle = this.data.bundle;
    const logLevel = bundle ? bundle.logLevel : undefined;
    return value.defaultValue(logLevel, DEFAULT.LOG_LEVEL);
  }

  /**
   * Retrieves the entry paths used by the JS bundler.
   */
  public get entry() {
    const path = this.path;
    const code = this.data.entry || path.defaultEntry.code;
    const html = code.endsWith('.html') ? code : path.defaultEntry.html;
    return {
      code,
      html,
    };
  }

  /**
   * Ensures that all entry-points exist, and copies them if necessary.
   */
  public async ensureEntries() {
    const parent = this._paths.parent;
    const entry = this.entry;
    const name = this._config.name || constants.UNNAMED;
    const codePath = entry.code;

    const tmp = parent.tmp;
    const templatesDir = parent.templates.html;
    const targetDir = fs.join(tmp.dir, tmp.html);

    return ensureEntries({
      name,
      codePath,
      templatesDir,
      targetDir,
      pattern: 'web.html',
    });
  }

  /**
   * The paths that JS us bundled to.
   */
  public out(prod?: boolean) {
    const out = this.path.out;
    const dir = prod ? out.dir.prod : out.dir.dev;
    const file = out.file;
    return {
      dir,
      file,
      path: fs.join(dir, file),
    };
  }

  /**
   * Arguments to pass to the parcel-bundler.
   */
  public get bundlerArgs() {
    return toBundlerArgs(this.data.bundle);
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
  public getPaths(): ICalculatedPaths {
    const parent = this._paths.parent;
    const bundle = parent.tmp.bundle;
    const html = parent.tmp.html;
    return {
      defaultEntry: {
        code: 'test/web.tsx',
        html: fs.join(html, 'web.html'),
      },
      out: {
        file: 'index.html',
        dir: {
          dev: fs.join(bundle, 'web/dev'),
          prod: fs.join(bundle, 'web/prod'),
        },
      },
    };
  }
}
