export { ISettingsClient, IpcClient, ILog } from '@platform/electron/lib/types';
export * from '@uiharness/types';

import { IpcMessage, IContext as ICoreContext, SettingsJson } from '@platform/electron/lib/types';
import { IRuntimeConfig } from '@uiharness/types';

/**
 * Standard context for a running UIHarness instance that is
 * typically passed as a set of values to functions.
 */

export type IContext<E extends IpcMessage = any, S extends SettingsJson = any> = ICoreContext<
  E,
  S
> & {
  config: IRuntimeConfig;
};

/**
 * IPC Events.
 */
export type IEvents = IFooEvent;
type IFooEvent = { type: 'UIHARNESS/foo'; payload: {} }; // TEMP placeholder 🐷
