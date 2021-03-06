export * from '@uiharness/types';

export type BundleTarget = 'electron' | 'web';
export type Environment = 'production' | 'development';
export type LogLevel = 3 | 2 | 1;
export type InitTemplate = 'minimal' | 'platform';

/**
 * The `uiharness.yml` configuration file.
 */
export type IConfig = {
  name?: string;
  electron?: IElectronConfig;
  web?: IWebConfig;
  sourcemaps?: Partial<ISourcemapsConfig>;
};

export type ISourcemapsConfig = { strip: string[] };

/**
 * Configuration for the electron app.
 */
export type IElectronConfig = {
  port?: number; // Port the dev-server runs on for electron.
  bundle?: IBundleConfig;
  entry?: {
    main?: string;
    renderer?: IEntryConfig;
  };
};

export type IEntryConfig = string | { [key: string]: string | IEntryConfigItem };
export type IEntryConfigItem = {
  path: string;
  title: string;
};
export type IEntryDef = IEntryConfigItem & { key: string; html: string };
export type IEntryDefs = { [key: string]: IEntryDef };

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
  bundle?: IBundleConfig;
  entry?: IEntryConfig;
  static?: IWebStaticConfig;
  head?: IWebHeadConfig;
};

/**
 * Paths to static resources to include in the bundle.
 */
export type IWebStaticConfig = string[];

/**
 * Declarations to include within the page <head>.
 */
export type IWebHeadConfig = {
  stylesheets?: string[];
};

/**
 * Build args for the Parcel bundler.
 * https://parceljs.org/cli.html
 */
export type IBundleConfig = {
  sourcemaps?: boolean; // Default: true.
  treeshake?: boolean; //  Default:  true
  logLevel?: LogLevel; // Default = 1 (errors only). https://parceljs.org/cli.html#change-log-level
  output?: string; // Optional path to a location to copy the dist bundle to.
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

export type ITSConfig = {
  extends: string;
  include: string[];
  compilerOptions: { outDir: string };
};

export type ITSLint = {
  extends: string;
  rules: {};
};
