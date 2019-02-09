import { IpcClient, IpcMessage } from '@platform/electron';
import { BrowserWindow } from 'electron';

import { IUIHarnessContext, IUIHarnessEvents } from '../types';

export { IpcMessage, IpcClient };
export * from '../types';

export type UIHarnessIpc = IpcClient<IUIHarnessEvents>;

export type IWindowRefs = {
  window?: BrowserWindow;
  devTools?: BrowserWindow;
};

export type IContext = IUIHarnessContext<IUIHarnessEvents>;
