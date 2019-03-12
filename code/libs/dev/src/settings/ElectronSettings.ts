import { constants, fs, value, toBundlerArgs } from '../common';
import {
  IElectronBuilderConfig,
  IUIHarnessConfig,
  IUIHarnessElectronConfig,
  IUIHarnessElectronPaths,
  IUIHarnessPaths,
  LogLevel,
  IUIHarnessElectronRendererEntry,
} from '../types';
import { ensureEntries } from './util';

const { DEFAULT } = constants;

type IPaths = {
  parent: IUIHarnessPaths;
  calculated?: IUIHarnessElectronPaths;
};

/**
 * Represents the `electron` section of the `uiharness.yml` configuration file.
 */
export class ElectronSettings {
  public readonly data: IUIHarnessElectronConfig;
  public readonly exists: boolean;

  private readonly _config: IUIHarnessConfig;
  private _builderConfig: IElectronBuilderConfig;
  private _paths: IPaths;

  /**
   * Constructor.
   */
  constructor(args: { path: IUIHarnessPaths; config: IUIHarnessConfig }) {
    const { config } = args;
    this._paths = { parent: args.path };
    this._config = config;
    this.data = config.electron || {};
    this.exists = Boolean(config.electron);
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
    const entry = typeof this.data.entry === 'object' ? this.data.entry : {};
    const main = entry.main || path.main.defaultEntry.code;

    type IRendererEntry = { code: string; html: string };

    const toHtml = (code: string) => {
      const parent = this._paths.parent;
      let path = code.replace(/^\./, '').replace(/^\//, '');
      path = path.substr(0, path.lastIndexOf('.'));
      path = path.replace(/\//g, '.');
      return fs.join(parent.tmp.html, `electron.${path}.html`);
    };

    const toRendererEntry = (code: string): IRendererEntry => {
      return { code, html: toHtml(code) };
    };

    const parseRenderer = (
      value?: IUIHarnessElectronRendererEntry,
    ): { [key: string]: IRendererEntry } => {
      if (value === undefined) {
        const code = path.renderer.defaultEntry.code;
        return { default: toRendererEntry(code) };
      }
      if (typeof value === 'string') {
        return { default: toRendererEntry(value) };
      }
      return Object.keys(value).reduce((acc, next) => {
        const code = value[next];
        if (code) {
          acc = { ...acc, [next]: toRendererEntry(code) };
        }
        return acc;
      }, {});
    };
    return {
      main,
      renderer: parseRenderer(entry.renderer),
    };
  }

  /**
   * Ensures that all entry-points exist, and copies them if necessary.
   */
  public async ensureEntries() {
    const entry = this.entry;
    const name = this._config.name || constants.UNNAMED;
    const codePath = entry.renderer.default.code;
    const htmlFilename = fs.basename(entry.renderer.default.html);
    const templatesDir = this._paths.parent.templates.html;
    const targetDir = this._paths.parent.tmp.html;

    // console.log('htmlFilename', htmlFilename);

    return ensureEntries({
      name,
      codePath,
      templatesDir,
      pattern: 'electron.html',
      targetDir,
      targetFile: htmlFilename,
    });
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
      file: path.renderer.out.file,
    };

    return {
      main: {
        dir: main.dir,
        file: main.file,
        path: fs.join(main.dir, main.file),
      },
      renderer: {
        dir: renderer.dir,
        file: renderer.file,
        path: fs.join(renderer.dir, renderer.file),
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
      return fs.file.loadAndParseSync<IElectronBuilderConfig>(path, {});
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
  public getPaths(): IUIHarnessElectronPaths {
    const parent = this._paths.parent;
    const tmp = parent.tmp.dir;
    const bundle = parent.tmp.bundle;
    const html = parent.tmp.html;

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
          html: fs.join(html, 'renderer.default.html'),
        },
        out: {
          file: 'renderer.html',
          dir: {
            dev: fs.join(bundle, 'app.renderer/dev'),
            prod: fs.join(bundle, 'app.renderer/prod'),
          },
        },
      },
      builder: {
        configFilename: `uiharness.builder.yml`,
        output: fs.join(tmp, 'dist'),
        files: [fs.join(bundle, 'app.main/**'), fs.join(bundle, 'app.renderer/prod/**')],
      },
    };
  }
}
