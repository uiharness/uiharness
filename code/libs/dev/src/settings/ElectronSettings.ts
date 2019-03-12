import { join, resolve } from 'path';

import { constants, fs, value, toBundlerArgs } from '../common';
import {
  IElectronBuilderConfig,
  IUIHarnessConfig,
  IUIHarnessElectronConfig,
  IUIHarnessElectronPaths,
  IUIHarnessPaths,
  LogLevel,
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
    const renderer = entry.renderer || path.renderer.defaultEntry.code;

    // const html = renderer.endsWith('.html') ? renderer : path.renderer.defaultEntry.html;
    const html = path.renderer.defaultEntry.html;

    return {
      main,
      renderer: {
        default: { code: renderer, html },
      },
    };
  }

  /**
   * Ensures that all entry-points exist, and copies them if necessary.
   */
  public async ensureEntries() {
    const entry = this.entry;
    const name = this._config.name || constants.UNNAMED;
    const codePath = entry.renderer.default.code;
    const templatesDir = this._paths.parent.templates.html;
    const targetDir = this._paths.parent.tmp.html;

    return ensureEntries({
      name,
      codePath,
      templatesDir,
      targetDir,
      pattern: 'renderer.default.html',
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
        path: join(main.dir, main.file),
      },
      renderer: {
        dir: renderer.dir,
        file: renderer.file,
        path: join(renderer.dir, renderer.file),
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
      const dir = resolve(this._paths.parent.dir);
      const path = join(dir, this.path.builder.configFilename);
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
          dir: join(bundle, 'app.main'),
        },
      },
      renderer: {
        defaultEntry: {
          code: 'test/renderer.tsx',
          html: join(html, 'renderer.default.html'),
        },
        out: {
          file: 'renderer.html',
          dir: {
            dev: join(bundle, 'app.renderer/dev'),
            prod: join(bundle, 'app.renderer/prod'),
          },
        },
      },
      builder: {
        configFilename: `uiharness.builder.yml`,
        output: join(tmp, 'dist'),
        files: [join(bundle, 'app.main/**'), join(bundle, 'app.renderer/prod/**')],
      },
    };
  }
}
