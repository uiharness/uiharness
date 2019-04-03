import { constants, fs, value, toBundlerArgs } from '../common';
import {
  IElectronBuilderConfig,
  IConfig,
  IElectronConfig,
  ISettingsPaths,
  LogLevel,
  IRendererEntryConfig,
  IRendererEntryConfigItem,
} from '../types';
import { ensureEntries } from './util';

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
  parent: ISettingsPaths;
  calculated?: ICalculatedPaths;
};

/**
 * Represents the `electron` section of the `uiharness.yml` configuration file.
 */
export class ElectronSettings {
  public readonly data: IElectronConfig;
  public readonly exists: boolean;

  private readonly _config: IConfig;
  private _builderConfig: IElectronBuilderConfig;
  private _paths: IPaths;

  /**
   * Constructor.
   */
  constructor(args: { path: ISettingsPaths; config: IConfig }) {
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

    type IREntry = IRendererEntryConfigItem & { html: string };

    const toHtml = (code: string) => {
      const parent = this._paths.parent;
      let path = code.replace(/^\./, '').replace(/^\//, '');
      path = path.substr(0, path.lastIndexOf('.'));
      path = path.replace(/\//g, '.');
      return fs.join(parent.tmp.html, `electron.${path}.html`);
    };

    const toRendererEntry = (label: string, path: string): IREntry => {
      return { label, path, html: toHtml(path) };
    };

    const parseRenderer = (value?: IRendererEntryConfig): { [key: string]: IREntry } => {
      if (value === undefined) {
        const code = path.renderer.defaultEntry.code;
        return { default: toRendererEntry('default', code) };
      }
      if (typeof value === 'string') {
        return { default: toRendererEntry('default', value) };
      }
      return Object.keys(value).reduce((acc, next) => {
        const item = value[next];
        if (item) {
          const code = typeof item === 'string' ? item : item.path;
          const label = typeof item === 'object' ? item.label || next : next;
          acc = { ...acc, [next]: toRendererEntry(label, code) };
        }
        return acc;
      }, {});
    };

    const renderer = parseRenderer(entry.renderer);
    const html = Object.keys(renderer).map(key => renderer[key].html);

    return {
      main,
      renderer,
      html,
    };
  }

  /**
   * Ensures that all entry-points exist, and copies them if necessary.
   */
  public async ensureEntries() {
    const entry = this.entry;
    const name = this._config.name || constants.UNNAMED;
    const templatesDir = this._paths.parent.templates.html;
    const tmp = this._paths.parent.tmp;
    const targetDir = fs.join(tmp.dir, tmp.html);

    const wait = Object.keys(entry.renderer).map(key => {
      const item = entry.renderer[key];
      return ensureEntries({
        name,
        codePath: item.path,
        templatesDir,
        pattern: 'electron.html',
        targetDir,
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
