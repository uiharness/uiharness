export * from '@uiharness/types';

/**
 * The `uiharness.yml` configuration file.
 */
export type IUIHarnessConfig = {
  port?: number;
  electron?: IUIHarnessElectronConfig;

  bundle?: IParcelBuildConfig;

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

export type IUIHarnessElectronConfig = {
  port?: number; // Port the dev-server runs on for electron.
  bundle?: IParcelBuildConfig;
};

/**
 * Build args for the Parcel bundler.
 * https://parceljs.org/cli.html
 */
export type IParcelBuildConfig = {
  sourcemaps?: boolean; // Default: true.
  treeshake?: boolean; // Default:  true
};

/**
 * The `electron-builder.yml` configuration file.
 */
export type IElectronBuilderConfig = {
  productName?: string;
  appId?: string;
  files?: string[];
  directories?: { output?: string };
};
