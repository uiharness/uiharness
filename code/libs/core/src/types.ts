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
