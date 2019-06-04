import { constants, fs, NpmPackage, t, toBundlerArgs, value } from '../common';
import { ensureEntries, parseEntry } from './util';

const { DEFAULT } = constants;

type ICalculatedPaths = {
  defaultEntry: { code: string; html: string };
  out: {
    file: string;
    dir: { prod: string; dev: string };
  };
};

type IPaths = {
  parent: t.ISettingsPaths;
  calculated?: ICalculatedPaths;
};

/**
 * Represents the `web` section of the `uiharness.yml` configuration file.
 */
export class WebSettings {
  /**
   * [Constructor]
   */
  constructor(args: { path: t.ISettingsPaths; config: t.IConfig; package: NpmPackage }) {
    const { config } = args;
    this._paths = { parent: args.path };
    this._config = config;
    this._package = args.package;
    this.data = config.web || {};
    this.exists = Boolean(config.web);
  }

  /**
   * [Fields]
   */
  public readonly data: t.IWebConfig;
  public readonly exists: boolean;

  private readonly _config: t.IConfig;
  private readonly _package: NpmPackage;
  private _paths: IPaths;

  /**
   * The root application name.
   */
  private get appName() {
    return this._config.name || constants.UNNAMED;
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
  public get logLevel(): t.LogLevel {
    const bundle = this.data.bundle;
    const logLevel = bundle ? bundle.logLevel : undefined;
    return value.defaultValue(logLevel, DEFAULT.LOG_LEVEL);
  }

  /**
   * Retrieves the entry paths used by the JS bundler.
   */
  public get entry() {
    const version = this._package.version || '0.0.0';
    return parseEntry({
      value: this.data.entry,
      version,
      paths: this._paths.parent,
      default: { title: this.appName, codePath: this.path.defaultEntry.code },
      htmlFilePrefix: 'web',
    });
  }

  /**
   * Ensures that all entry-points exist, and copies them if necessary.
   */
  public async ensureEntries() {
    const entry = this.entry;
    const name = this.appName;
    const parent = this._paths.parent;

    const tmp = parent.tmp;
    const templatesDir = parent.templates.html;
    const targetDir = fs.join(tmp.dir, tmp.html);

    const wait = Object.keys(entry).map(key => {
      const item = entry[key];
      return ensureEntries({
        name,
        templatesDir,
        targetDir,
        pattern: 'web.html',
        codePath: item.path,
        htmlFile: fs.basename(item.html),
      });
    });

    await Promise.all(wait);
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
