import { join } from 'path';

import { toBundlerArgs, constants } from '../common';
import {
  IUIHarnessConfig,
  IUIHarnessPaths,
  IUIHarnessWebConfig,
  IUIHarnessWebPaths,
} from '../types';
import { ensureEntries } from './util';

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

  private readonly _config: IUIHarnessConfig;
  private _paths: IPaths;

  /**
   * Constructor.
   */
  constructor(args: { path: IUIHarnessPaths; config: IUIHarnessConfig }) {
    const { config } = args;
    this._paths = { parent: args.path };
    this._config = config;
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
    const path = this.path;
    const code = this.data.entry || path.defaultEntry.code;
    const html = code.endsWith('.html') ? code : path.defaultEntry.html;
    return {
      code,
      html,
    };
  }

  /**
   * Ensures that all entry-points exist, and copies them if necessary.
   */
  public async ensureEntries() {
    const entry = this.entry;
    const name = this._config.name || constants.UNNAMED;
    const codePath = entry.code;
    const templatesDir = this._paths.parent.templates.html;
    const targetDir = this._paths.parent.tmp.html;

    return ensureEntries({
      name,
      codePath,
      templatesDir,
      targetDir,
      pattern: 'web.html',
    });
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
      path: join(dir, file),
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
  public getPaths(): IUIHarnessWebPaths {
    const parent = this._paths.parent;
    const bundle = parent.tmp.bundle;
    const html = parent.tmp.html;
    return {
      defaultEntry: {
        code: 'test/web.tsx',
        html: join(html, 'web.html'),
      },
      out: {
        file: 'index.html',
        dir: {
          dev: join(bundle, 'web/dev'),
          prod: join(bundle, 'web/prod'),
        },
      },
    };
  }
}
