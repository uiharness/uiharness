export { IStoreClient, IpcClient, ILog } from '@platform/electron/lib/types';

export * from '@uiharness/types';

import { IpcMessage, IContext as ICoreContext, StoreJson } from '@platform/electron/lib/types';
import { IRuntimeConfig } from '@uiharness/types';

/**
 * Standard context for a running UIHarness instance that is
 * typically passed as a set of values to functions.
 */

export type IContext<E extends IpcMessage = any, S extends StoreJson = any> = ICoreContext<E, S> & {
  config: IRuntimeConfig;
};

/**
 * IPC Events.
 */
export type IUihEvents = IFooEvent;
type IFooEvent = { type: 'UIH/foo'; payload: {} }; // TEMP placeholder 🐷
