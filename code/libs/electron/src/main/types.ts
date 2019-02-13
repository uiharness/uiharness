import { IpcClient, IpcMessage } from '@platform/electron';
import { BrowserWindow } from 'electron';

import {
  IUIHarnessContext,
  IUihEvents,
  IUIHarnessRuntimeConfig,
} from '../types';

export { IpcMessage, IpcClient, IUIHarnessRuntimeConfig };
export * from '../types';

export type UIHarnessIpc = IpcClient<IUihEvents>;

export type IWindowRefs = {
  window?: BrowserWindow;
  devTools?: BrowserWindow;
};

export type IContext = IUIHarnessContext<IUihEvents>;
