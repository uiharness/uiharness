export type IUIHarnessConfig = {
  port?: number;
  entry?: string | string[] | IUIHarnessConfigEntry | IUIHarnessConfigEntry[];

  /**
   * Build args.
   * https://parceljs.org/cli.html
   */
  sourcemaps?: boolean; // Default: true.
  target?: 'browser' | 'node' | 'electron';
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

export type IUIHarnessConfigEntry = {
  title?: string;
  path?: string;
};

export type IUIHarnessEntry = {
  title: string;
  path: string;
  html: {
    absolute: string;
    relative: string;
  };
  exists: boolean;
};
