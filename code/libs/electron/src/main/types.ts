import { IpcClient, IpcMessage } from '@platform/electron';
import { BrowserWindow } from 'electron';

import { IUihContext, IUihEvents, IRuntimeConfig } from '../types';

export { IpcMessage, IpcClient, IRuntimeConfig };
export * from '../types';

export type UIHarnessIpc = IpcClient<IUihEvents>;
export type IContext = IUihContext<IUihEvents>;

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
