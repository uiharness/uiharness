import { ILog } from '@platform/log/lib/types';
export { ILog };
export * from '@uiharness/types';

import {
  IRendererContext,
  IpcMessage,
  IContext,
  StoreJson,
} from '@platform/electron';
import { IUIHarnessRuntimeConfig } from '@uiharness/types';

/**
 * Standard context for a running UIHarness instance that is
 * typically passed as a set of values to functions.
 */

export type IUIHarnessContext<
  E extends IpcMessage = any,
  S extends StoreJson = any
> = IContext<E, S> & {
  config: IUIHarnessRuntimeConfig;
};

/**
 * IPC Events.
 */
export type IUihEvents = IFooEvent;
type IFooEvent = { type: 'UIH/foo'; payload: {} }; // TEMP placeholder 🐷
