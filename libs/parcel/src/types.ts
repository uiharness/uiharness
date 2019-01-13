export type IUIHarnessConfig = {
  port?: number;
  entry?: string | string[] | IUIHarnessConfigEntry | IUIHarnessConfigEntry[];
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

export type IBuildArgs = {
  sourcemaps?: boolean;
  treeshaking?: boolean;
  target?: 'browser' | 'node' | 'electron';
};
