/**
 * The `.uiharness.yml` configuration file structure.
 */
export type IUIHarnessConfig = {
  port?: number;
  entry?: string | string[] | IUIHarnessConfigEntry | IUIHarnessConfigEntry[];

  /**
   * Build args.
   * https://parceljs.org/cli.html
   */
  sourcemaps?: boolean; // Default: true.
  treeshake?: boolean; // Default:true

  /**
   * Flags used to determine what to
   * inclue/exclude within the `init` script.
   */
  init?: {
    scripts?: boolean;
    files?: boolean;
    html?: boolean;
  };
};

/**
 * Entry
 */
export type IUIHarnessConfigEntry = {
  title?: string;
  path?: string;
};

/**
 * An entry point for the UIHarness.
 */
export type IUIHarnessEntry = {
  title: string;
  path: string;
  html: {
    absolute: string;
    relative: string;
  };
  exists: boolean;
};

/**
 * NPM Package.
 */
export type IPackageJson = {
  name?: string;
  description?: string;
  version?: string;
  main?: string;
  scripts?: IPackageScripts;
};
export type IPackageScripts = { [key: string]: string };
