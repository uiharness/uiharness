import { constants, fs, NpmPackage, t, toBundlerArgs, value } from '../common';
import { ensureEntries, parseEntry } from './util';

const { DEFAULT } = constants;

type ICalculatedPaths = {
  main: {
    defaultEntry: { code: string };
    out: { file: string; dir: string };
  };
  renderer: {
    defaultEntry: { code: string };
    out: {
      dir: { prod: string; dev: string };
    };
  };
  builder: {
    configFilename: string;
    files: string[];
    output: string;
  };
};

type IPaths = {
  parent: t.ISettingsPaths;
  calculated?: ICalculatedPaths;
};

/**
 * Represents the `electron` section of the `uiharness.yml` configuration file.
 */
export class ElectronSettings {
  /**
   * [Constructor]
   */
  constructor(args: { path: t.ISettingsPaths; config: t.IConfig; package: NpmPackage }) {
    const { config } = args;
    this._paths = { parent: args.path };
    this._config = config;
    this._package = args.package;
    this.data = config.electron || {};
    this.exists = Boolean(config.electron);
  }

  /**
   * [Fields]
   */
  public readonly data: t.IElectronConfig;
  public readonly exists: boolean;

  private readonly _config: t.IConfig;
  private readonly _package: NpmPackage;
  private _builderConfig: t.IElectronBuilderConfig;
  private _paths: IPaths;

  /**
   * [Properties]
   */

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
    return value.defaultValue(this.data.port, 8888);
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
    const path = this.path;
    const entry = typeof this.data.entry === 'object' ? this.data.entry : {};
    const main = entry.main || path.main.defaultEntry.code;
    const version = this._package.version || '0.0.0';

    const paths = this._paths;
    const title = this.appName;

    return {
      main,
      get renderer(): t.IEntryDefs {
        return parseEntry({
          value: entry.renderer,
          version,
          paths: paths.parent,
          default: { title, codePath: path.renderer.defaultEntry.code },
          htmlFilePrefix: 'electron',
        });
      },
    };
  }

  /**
   * [Methods]
   */

  /**
   * Ensures that all entry-points exist, and copies them if necessary.
   */
  public async ensureEntries() {
    const entry = this.entry;
    const name = this.appName;
    const templatesDir = this._paths.parent.templates.html;
    const tmp = this._paths.parent.tmp;
    const targetDir = fs.join(tmp.dir, tmp.html);

    const wait = Object.keys(entry.renderer).map(key => {
      const item = entry.renderer[key];
      return ensureEntries({
        name,
        templatesDir,
        targetDir,
        pattern: 'electron.html',
        codePath: item.path,
        htmlFile: fs.basename(item.html),
      });
    });

    await Promise.all(wait);
  }

  /**
   * The paths that JS is bundled to.
   */
  public out(prod?: boolean) {
    const path = this.path;
    const main = {
      dir: path.main.out.dir,
      file: path.main.out.file,
    };
    const renderer = {
      dir: prod ? path.renderer.out.dir.prod : path.renderer.out.dir.dev,
    };

    return {
      main: {
        dir: main.dir,
        file: main.file,
        path: fs.join(main.dir, main.file),
      },
      renderer: {
        dir: renderer.dir,
      },
    };
  }

  /**
   * Arguments to pass to the parcel-bundler.
   */
  public get bundlerArgs() {
    return toBundlerArgs(this.data.bundle);
  }

  /**
   * The raw [electron-builder.yml] configuration data.
   */
  public get builderArgsJson() {
    const load = () => {
      const dir = fs.resolve(this._paths.parent.dir);
      const path = fs.join(dir, this.path.builder.configFilename);
      return fs.file.loadAndParseSync<t.IElectronBuilderConfig>(path, {});
    };
    return this._builderConfig || (this._builderConfig = load());
  }

  /**
   * Extrapolated [electron-builder.yml] values.
   */
  public get builderArgs() {
    const config = this.builderArgsJson;
    const { productName, appId, directories } = config;
    const outputDir = directories ? directories.output : undefined;
    return {
      exists: this.exists,
      productName,
      appId,
      outputDir,
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
  public getPaths(): ICalculatedPaths {
    const parent = this._paths.parent;
    const bundle = parent.tmp.bundle;

    return {
      main: {
        defaultEntry: {
          code: 'test/main.ts',
        },
        out: {
          file: 'main.js',
          dir: fs.join(bundle, 'app.main'),
        },
      },
      renderer: {
        defaultEntry: {
          code: 'test/renderer.tsx',
        },
        out: {
          dir: {
            dev: fs.join(bundle, 'app.renderer/dev'),
            prod: fs.join(bundle, 'app.renderer/prod'),
          },
        },
      },
      builder: {
        configFilename: `uiharness.builder.yml`,
        output: 'dist',
        files: [fs.join(bundle, 'app.main/**'), fs.join(bundle, 'app.renderer/prod/**')],
      },
    };
  }
}
