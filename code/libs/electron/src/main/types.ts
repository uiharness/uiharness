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
export type IContext = IUIHarnessContext<IUihEvents>;

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
