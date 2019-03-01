import { IpcClient, IpcMessage, IStoreClient } from '@platform/electron';
import { BrowserWindow } from 'electron';

import { IContext, IUihEvents, IRuntimeConfig } from '../types';

export { IpcMessage, IpcClient, IRuntimeConfig, IStoreClient };
export * from '../types';

export type UIHarnessIpc = IpcClient<IUihEvents>;
export type IContext = IContext<IUihEvents>;

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
