export * from '@uiharness/types';

export type BundleTarget = 'electron' | 'web';

/**
 * The `uiharness.yml` configuration file.
 */
export type IUIHarnessConfig = {
  electron?: IUIHarnessElectronConfig;
  web?: IUIHarnessWebConfig;

  /**
   * Flags used to determine what to
   * inclue/exclude within the `init` script.
   */
  init?: {
    scripts?: boolean;
    files?: boolean;
    html?: boolean;
    deps?: boolean;
  };
};

/**
 * Configuration for the electron app.
 */
export type IUIHarnessElectronConfig = {
  name?: string;
  port?: number; // Port the dev-server runs on for electron.
  bundle?: IParcelBuildConfig;
  entry?: {
    main?: string;
    renderer?: string;
  };
};

/**
 * The shape of the `electron-builder.yml` configuration file.
 */
export type IElectronBuilderConfig = {
  productName?: string;
  appId?: string;
  files?: string[];
  directories?: { output?: string };
};

/**
 * Configuration for the web (browser) app.
 */
export type IUIHarnessWebConfig = {
  port?: number; // Port the dev-server runs on for electron.
  bundle?: IParcelBuildConfig;
  entry?: string;
};

/**
 * Build args for the Parcel bundler.
 * https://parceljs.org/cli.html
 */
export type IParcelBuildConfig = {
  sourcemaps?: boolean; // Default: true.
  treeshake?: boolean; //  Default:  true
};
