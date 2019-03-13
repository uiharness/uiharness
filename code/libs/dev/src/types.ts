export * from '@uiharness/types';

export type BundleTarget = 'electron' | 'web';
export type Environment = 'production' | 'development';
export type LogLevel = 3 | 2 | 1;

/**
 * The `uiharness.yml` configuration file.
 */
export type IConfig = {
  name?: string;
  electron?: IElectronConfig;
  web?: IWebConfig;
  sourcemaps?: Partial<ISourcemapsConfig>;
};

export type ISourcemapsConfig = {
  strip: string[];
};

/**
 * Configuration for the electron app.
 */
export type IElectronConfig = {
  port?: number; // Port the dev-server runs on for electron.
  bundle?: IParcelBuildConfig;
  entry?: {
    main?: string;
    renderer?: IRendererEntryConfig;
  };
};

export type IRendererEntryConfig = string | { [key: string]: string | IRendererEntryConfigItem };
export type IRendererEntryConfigItem = {
  path: string;
  label: string;
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
export type IWebConfig = {
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
  logLevel?: LogLevel; // Default = 1 (errors only). https://parceljs.org/cli.html#change-log-level
};

/**
 * The set of paths to various assets that make up a UIHarness project.
 */
export type ISettingsPaths = {
  self: string;
  dir: string;
  package: string;
  tmp: {
    dir: string;
    html: string;
    bundle: string;
    config: string;
  };
  templates: {
    base: string;
    electron: string;
    html: string;
  };
};
