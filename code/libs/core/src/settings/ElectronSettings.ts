import { constants, file, fs, fsPath, tmpl, toBundlerArgs } from '../common';
import {
  IElectronBuilderConfig,
  IUIHarnessConfig,
  IUIHarnessElectronConfig,
  IUIHarnessElectronPaths,
  IUIHarnessPaths,
} from '../types';

const { join, resolve } = fsPath;

type IPaths = {
  parent: IUIHarnessPaths;
  calculated?: IUIHarnessElectronPaths;
};

/**
 * Represents the `electron` section of the `uiharness.yml` configuration file.
 */
export class ElectronSettings {
  public readonly config: IUIHarnessConfig;
  public readonly data: IUIHarnessElectronConfig;
  public readonly exists: boolean;

  private _builderConfig: IElectronBuilderConfig;
  private _paths: IPaths;

  /**
   * Constructor.
   */
  constructor(args: { path: IUIHarnessPaths; config: IUIHarnessConfig }) {
    const { config } = args;
    this._paths = { parent: args.path };
    this.config = config;
    this.data = config.electron || {};
    this.exists = Boolean(config.electron);
  }

  /**
   * The port to run the dev-server on.
   */
  public get port() {
    return this.data.port || 8888;
  }

  /**
   * Retrieves the entry paths used by the JS bundler.
   */
  public get entry() {
    const path = this.path;
    const entry = typeof this.data.entry === 'object' ? this.data.entry : {};
    const main = entry.main || path.main.defaultEntry.code;
    const renderer = entry.renderer || path.renderer.defaultEntry.code;
    const html = renderer.endsWith('.html')
      ? renderer
      : path.renderer.defaultEntry.html;
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
    const exists = fs.pathExists;

    const ensureRendererHtml = async () => {
      const isDefault = entry.html === this.path.renderer.defaultEntry.html;
      const entryHtmlFile = resolve(entry.html);

      // - Always overwrite if this is the default path.
      // - Don't overwrite if a custom HTML path is set, and it already exists.
      if (!isDefault || (await exists(entryHtmlFile))) {
        return;
      }

      // Prepare paths.
      // const root = resolve('.');
      let targetDir = this._paths.parent.tmp.html;
      targetDir = `/${targetDir.replace(/^\//, '')}`;
      const hops = targetDir
        .replace(/^\//, '')
        .split('/')
        .map(() => '..')
        .join('/');

      // Create template.
      const template = tmpl
        .create()
        .add({
          dir: resolve(this._paths.parent.templates.html),
          pattern: 'renderer.html',
          targetDir,
        })
        .use(tmpl.replace({ edge: '__' }))
        .use(tmpl.copyFile());

      // Execute template.
      const variables = {
        NAME: this.config.name || constants.UNNAMED,
        PATH: join(hops, entry.renderer),
      };
      await template.execute({ variables });
    };

    // Prepare.
    await ensureRendererHtml();
  }

  /**
   * The paths that JS us bundled to.
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
      return file.loadAndParseSync<IElectronBuilderConfig>(path, {});
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
  public getPaths() {
    const parent = this._paths.parent;
    const tmp = parent.tmp.dir;
    const bundle = parent.tmp.bundle;
    const html = parent.tmp.html;

    const res: IUIHarnessElectronPaths = {
      main: {
        defaultEntry: {
          code: 'test/app/main.ts',
        },
        out: {
          file: 'main.js',
          dir: join(bundle, 'app.main'),
        },
      },
      renderer: {
        defaultEntry: {
          code: 'test/app/renderer.tsx',
          html: join(html, 'renderer.html'),
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
        files: [
          join(bundle, 'app.main/**'),
          join(bundle, 'app.renderer/prod/**'),
        ],
      },
    };

    return res;
  }
}
