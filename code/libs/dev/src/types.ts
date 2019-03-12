export * from '@uiharness/types';

export type BundleTarget = 'electron' | 'web';
export type Environment = 'production' | 'development';
export type LogLevel = 3 | 2 | 1;

/**
 * The `uiharness.yml` configuration file.
 */
export type IUIHarnessConfig = {
  name?: string;
  electron?: IUIHarnessElectronConfig;
  web?: IUIHarnessWebConfig;
  sourcemaps?: Partial<IUIHarnessSourcemapsConfig>;
};

export type IUIHarnessSourcemapsConfig = {
  strip: string[];
};

/**
 * Configuration for the electron app.
 */
export type IUIHarnessElectronConfig = {
  port?: number; // Port the dev-server runs on for electron.
  bundle?: IParcelBuildConfig;
  entry?: {
    main?: string;
    renderer?: IUIHarnessElectronRendererEntry;
  };
};

export type IUIHarnessElectronRendererEntry = string | { [key: string]: string };

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
  logLevel?: LogLevel; // Default = 1 (errors only). https://parceljs.org/cli.html#change-log-level
};

/**
 * The set of paths to various assets that make up a UIHarness project.
 */
export type IUIHarnessPaths = {
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

/**
 * The set of paths related to electron.
 */
export type IUIHarnessElectronPaths = {
  main: {
    defaultEntry: {
      code: string;
    };
    out: { file: string; dir: string };
  };
  renderer: {
    defaultEntry: {
      code: string;
      html: string;
    };
    out: {
      file: string;
      dir: { prod: string; dev: string };
    };
  };
  builder: {
    configFilename: string;
    files: string[];
    output: string;
  };
};

export type IUIHarnessWebPaths = {
  defaultEntry: {
    code: string;
    html: string;
  };
  out: {
    file: string;
    dir: { prod: string; dev: string };
  };
};
