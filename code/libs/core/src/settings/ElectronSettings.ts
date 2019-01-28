import {
  IElectronBuilderConfig,
  IUIHarnessElectronConfig,
  IUIHarnessPaths,
  IUIHarnessConfig,
} from '../types';
import { toBundlerArgs, file, fsPath, constants, fs, tmpl } from '../common';

const { PATH } = constants;
const { join, resolve } = fsPath;

/**
 * Represents the `electron` section of the `uiharness.yml` configuration file.
 */
export class ElectronSettings {
  public readonly config: IUIHarnessConfig;
  public readonly data: IUIHarnessElectronConfig;
  public readonly exists: boolean;

  private _builderConfig: IElectronBuilderConfig;
  public readonly _parentPaths: IUIHarnessPaths;

  /**
   * Constructor.
   */
  constructor(args: { path: IUIHarnessPaths; config: IUIHarnessConfig }) {
    const { config } = args;
    this._parentPaths = args.path;
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
    const { MAIN, RENDERER } = PATH.ELECTRON;
    const entry = typeof this.data.entry === 'object' ? this.data.entry : {};
    const main = entry.main || MAIN.DEFAULT_ENTRY;
    const renderer = entry.renderer || RENDERER.DEFAULT_ENTRY;
    const html = renderer.endsWith('.html') ? renderer : RENDERER.HTML_ENTRY;
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
    const { RENDERER } = PATH.ELECTRON;
    const entry = this.entry;
    const exists = fs.pathExists;

    const ensureRendererHtml = async () => {
      const isDefault = entry.html === RENDERER.HTML_ENTRY;
      const path = resolve(entry.html);

      // - Always overwrite if this is the default path.
      // - Don't overwrite if a custom HTML path is set, and it already exists.
      if (!isDefault || (await exists(path))) {
        return;
      }

      // Prepare paths.
      const root = resolve('.');
      const targetDir = this._parentPaths.tmp.html.substr(root.length);
      const hops = targetDir
        .replace(/^\//, '')
        .split('/')
        .map(() => '..')
        .join('/');

      // Create template.
      const template = tmpl
        .create()
        .add({
          dir: this._parentPaths.templates.html,
          pattern: 'renderer.html',
          targetDir,
        })
        .use(tmpl.replace({ edge: '__' }))
        .use(tmpl.copyFile());

      // Execute template.
      const variables = {
        NAME: this.config.name || constants.UNNAMED,
        PATH: entry.renderer.replace(/^\./, hops),
      };
      await template.execute({ variables });
    };

    await ensureRendererHtml();
  }

  /**
   * The paths that JS us bundled to.
   */
  public out(prod?: boolean) {
    const { MAIN, RENDERER } = PATH.ELECTRON;
    const mainDir = MAIN.OUT_DIR;
    const rendererDir = prod ? RENDERER.OUT_DIR.PROD : RENDERER.OUT_DIR.DEV;
    return {
      main: {
        dir: mainDir,
        file: MAIN.OUT_FILE,
        path: join(mainDir, MAIN.OUT_FILE),
      },
      renderer: {
        dir: rendererDir,
        file: RENDERER.OUT_FILE,
        path: join(rendererDir, RENDERER.OUT_FILE),
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
      const dir = resolve(fsPath.dirname(this._parentPaths.self));
      const path = join(dir, PATH.ELECTRON.BUILDER.CONFIG.FILE_NAME);
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
}
