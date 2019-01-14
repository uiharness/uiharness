export type IUIHarnessConfig = {
  port?: number;
  entry?: string | string[] | IUIHarnessConfigEntry | IUIHarnessConfigEntry[];

  // Build args.
  // https://parceljs.org/cli.html
  sourcemaps?: boolean; // Default: true.
  target?: 'browser' | 'node' | 'electron';
  treeshake?: boolean; // Default:true
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
