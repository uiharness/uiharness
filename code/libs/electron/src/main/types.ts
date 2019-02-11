import { IpcClient, IpcMessage } from '@platform/electron';
import { BrowserWindow } from 'electron';

import {
  IUIHarnessContext,
  IUIHarnessEvents,
  IUIHarnessRuntimeConfig,
} from '../types';

export { IpcMessage, IpcClient, IUIHarnessRuntimeConfig };
export * from '../types';

export type UIHarnessIpc = IpcClient<IUIHarnessEvents>;

export type IWindowRefs = {
  window?: BrowserWindow;
  devTools?: BrowserWindow;
};

export type IContext = IUIHarnessContext<IUIHarnessEvents>;
