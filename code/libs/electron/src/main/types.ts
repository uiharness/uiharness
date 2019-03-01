import { IpcClient, IpcMessage, IStoreClient } from '@platform/electron';
import { BrowserWindow } from 'electron';

import { IContext, IEvents, IRuntimeConfig } from '../types';

export { IpcMessage, IpcClient, IRuntimeConfig, IStoreClient };
export * from '../types';

export type UIHarnessIpc = IpcClient<IEvents>;
export type IContext = IContext<IEvents>;

/**
 * New window.
 */
export type NewWindowFactory = (options?: INewWindowArgs) => BrowserWindow;
export type INewWindowArgs = {
  name?: string;
  devTools?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultX?: number;
  defaultY?: number;
};
