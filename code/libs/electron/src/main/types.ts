import { IpcClient, IpcMessage, ISettingsClient } from '@platform/electron';
import { BrowserWindow } from 'electron';

import { IContext as IContextLocal, IEvents, IRuntimeConfig } from '../types';

export { IpcMessage, IpcClient, IRuntimeConfig, ISettingsClient };
export * from '../types';

export type UIHarnessIpc = IpcClient<IEvents>;
export type IContext = IContextLocal<IEvents>;

/**
 * New window.
 */
export type NewWindowFactory = (options?: INewWindowArgs) => BrowserWindow;
export type INewWindowArgs = {
  entry?: string; // The ID of the renderer entry path specified in [uiharness.yml]. Defaults to "default".
  title?: string;
  devTools?: boolean;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultX?: number;
  defaultY?: number;
};
