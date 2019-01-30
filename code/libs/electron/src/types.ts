import { IUIHarnessRuntimeConfig } from '@uiharness/types';

import { Log } from '@tdb/log/lib/types';

export * from '@uiharness/types';
export { Log };

export type IContext = {
  config: IUIHarnessRuntimeConfig;
  log: Log;
};
