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

export type INewWindowArgs = { name?: string; devTools?: boolean };
export type NewWindowFactory = (options?: INewWindowArgs) => BrowserWindow;
