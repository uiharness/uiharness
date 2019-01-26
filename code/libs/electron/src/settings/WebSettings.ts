import { constants, file, fsPath, toBundlerArgs } from '../common';
import { IUIHarnessWebConfig } from '../types';

const { PATH } = constants;

/**
 * Represents the `web` section of the `uiharness.yml` configuration file.
 */
export class WebSettings {
  public dir: string;
  public data: IUIHarnessWebConfig;
  public exists: boolean;

  /**
   * Constructor.
   */
  constructor(args: { dir: string; data?: IUIHarnessWebConfig }) {
    const { data, dir } = args;
    this.exists = Boolean(data);
    this.dir = dir;
    this.data = data || {};
  }

  /**
   * The port to run the dev-server on.
   */
  public get port() {
    return this.data.port || 1234;
  }

  /**
   * Retrieves the entry paths used by the JS bundler.
   */
  public get entry() {
    // const entry = typeof this.data.entry === 'object' ? this.data.entry : {};
    // const main = entry.main || PATH.MAIN.DEFAULT_ENTRY;
    // const renderer = entry.renderer || PATH.RENDERER.DEFAULT_ENTRY;
    return '';
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
}
