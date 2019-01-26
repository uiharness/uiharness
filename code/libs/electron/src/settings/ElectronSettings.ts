import { IElectronBuilderConfig, IUIHarnessElectronConfig } from '../types';
import { toBundlerArgs, file, fsPath, constants } from '../common';

const { PATH } = constants;

/**
 * Represents the `electron` section of the `uiharness.yml` configuration file.
 */
export class ElectronSettings {
  public dir: string;
  public data: IUIHarnessElectronConfig;
  public exists: boolean;
  private _builderConfig: IElectronBuilderConfig;

  /**
   * Constructor.
   */
  constructor(args: { dir: string; data?: IUIHarnessElectronConfig }) {
    const { data, dir } = args;
    this.exists = Boolean(data);
    this.dir = dir;
    this.data = data || {};
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
    const entry = typeof this.data.entry === 'object' ? this.data.entry : {};
    const main = entry.main || PATH.MAIN.DEFAULT_ENTRY;
    const renderer = entry.renderer || PATH.RENDERER.DEFAULT_ENTRY;
    return { main, renderer };
  }

  /**
   * The paths that JS us bundled to.
   */
  public out(prod?: boolean) {
    const { MAIN, RENDERER } = PATH;
    const mainDir = MAIN.OUT_DIR;
    const rendererDir = prod ? RENDERER.OUT_DIR.PROD : RENDERER.OUT_DIR.DEV;
    return {
      main: {
        dir: mainDir,
        file: MAIN.OUT_FILE,
        path: fsPath.join(mainDir, MAIN.OUT_FILE),
      },
      renderer: {
        dir: rendererDir,
        file: RENDERER.OUT_FILE,
        path: fsPath.join(rendererDir, RENDERER.OUT_FILE),
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
      const dir = fsPath.resolve(this.dir);
      const path = fsPath.join(dir, 'electron-builder.yml');
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
