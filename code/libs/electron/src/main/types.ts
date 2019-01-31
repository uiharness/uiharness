import { BrowserWindow } from 'electron';
import { IUIHarnessRuntimeConfig, Log, IUIHarnessEvents } from '../types';
import { IpcClient, IpcMessage } from '@tdb/electron';

export { IpcMessage, IpcClient };
export * from '../types';

export type UIHarnessIpc = IpcClient<IUIHarnessEvents>;

export type IWindowRefs = {
  window?: BrowserWindow;
  devTools?: BrowserWindow;
};

export type IContext = {
  config: IUIHarnessRuntimeConfig;
  log: Log;
  ipc: UIHarnessIpc;
};
