import { constants, fsPath, toBundlerArgs } from '../common';
import {
  IUIHarnessWebConfig,
  IUIHarnessPaths,
  IUIHarnessConfig,
} from '../types';

const { PATH } = constants;

/**
 * Represents the `web` section of the `uiharness.yml` configuration file.
 */
export class WebSettings {
  public readonly path: IUIHarnessPaths;
  public readonly data: IUIHarnessWebConfig;
  public readonly exists: boolean;

  /**
   * Constructor.
   */
  constructor(args: { path: IUIHarnessPaths; config: IUIHarnessConfig }) {
    const { config } = args;
    this.path = args.path;
    this.data = config.web || {};
    this.exists = Boolean(config.web);
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
    return this.data.entry || PATH.WEB.ENTRY;
  }

  /**
   * The paths that JS us bundled to.
   */
  public out(prod?: boolean) {
    const WEB = PATH.WEB;
    const dir = prod ? WEB.OUT_DIR.PROD : WEB.OUT_DIR.DEV;
    const file = WEB.OUT_FILE;
    return {
      dir,
      file,
      path: fsPath.join(dir, file),
    };
  }

  /**
   * Arguments to pass to the parcel-bundler.
   */
  public get bundlerArgs() {
    return toBundlerArgs(this.data.bundle);
  }
}
