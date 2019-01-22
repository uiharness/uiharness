/**
 * The `uiharness.yml` configuration file structure.
 */
export type IUIHarnessConfig = {
  port?: number;

  /**
   * Build args.
   * https://parceljs.org/cli.html
   */
  build?: {
    sourcemaps?: boolean; // Default: true.
    treeshake?: boolean; // Default:true
  };

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
