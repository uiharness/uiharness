import { Log } from '@tdb/log/lib/types';
export { Log };
export * from '@uiharness/types';

import { IpcClient, IpcMessage } from '@tdb/electron';
import { IUIHarnessRuntimeConfig } from '@uiharness/types';

/**
 * Standard context for a running UIHarness instance that is
 * typically passed as a set of values to functions.
 */
export type IUIHarnessContext<E extends IpcMessage = any> = {
  config: IUIHarnessRuntimeConfig;
  log: Log;
  ipc: IpcClient<E>;
};

/**
 * IPC Events.
 */
export type IUIHarnessEvents = IFooEvent;
type IFooEvent = { type: 'UIH/foo'; payload: {} }; // TEMP placeholder 🐷
