import { fsPath, toBundlerArgs } from '../common';
import {
  IUIHarnessConfig,
  IUIHarnessPaths,
  IUIHarnessWebConfig,
  IUIHarnessWebPaths,
} from '../types';

const { resolve, join } = fsPath;

type IPaths = {
  parent: IUIHarnessPaths;
  calculated?: IUIHarnessWebPaths;
};

/**
 * Represents the `web` section of the `uiharness.yml` configuration file.
 */
export class WebSettings {
  public readonly data: IUIHarnessWebConfig;
  public readonly exists: boolean;
  private _paths: IPaths;

  /**
   * Constructor.
   */
  constructor(args: { path: IUIHarnessPaths; config: IUIHarnessConfig }) {
    const { config } = args;
    this._paths = { parent: args.path };
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
    return this.data.entry || this.path.defaultEntry.html;
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
      path: fsPath.join(dir, file),
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
  public getPaths() {
    const ROOT = resolve('.');
    const toRelative = (path: string) => path.substr(ROOT.length + 1);

    const parent = this._paths.parent;
    const bundle = toRelative(parent.tmp.bundle);

    const res: IUIHarnessWebPaths = {
      defaultEntry: {
        html: './src/test/web.html',
      },
      out: {
        file: 'index.html',
        dir: {
          dev: join(bundle, 'web/dev'),
          prod: join(bundle, 'web/prod'),
        },
      },
    };

    return res;
  }
}
