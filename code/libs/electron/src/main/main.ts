import electron from '@tdb/electron/lib/main';
import { app, BrowserWindow } from 'electron';

import { IUIHarnessRuntimeConfig } from '../common';
import { Log } from '../types';
import { IContext, IpcClient, IpcMessage, UIHarnessIpc } from './types';
import * as mainWindow from './window';

type IResponse<M extends IpcMessage> = {
  window: BrowserWindow;
  newWindow: (args: { name: string }) => BrowserWindow;
  log: Log;
  ipc: IpcClient<M>;
};

/**
 * Default loader for a UIHarness [main] process.
 * @param config: The `.uiharess/config.json` file.
 */
export function init<M extends IpcMessage>(args: {
  config: IUIHarnessRuntimeConfig;
  name?: string;
}) {
  return new Promise<IResponse<M>>((resolve, reject) => {
    const { config } = args;
    const { log, ipc } = electron.init<M>();
    const context: IContext = {
      config,
      log,
      ipc: ipc as UIHarnessIpc,
    };

    app.on('ready', () => {
      const name = args.name || app.getName();
      const window = mainWindow.create({ name, ...context });
      resolve({
        window,
        newWindow: e => mainWindow.create({ name: e.name, ...context }),
        log,
        ipc,
      });
    });

    app.on('window-all-closed', () => {
      app.quit();
    });
  });
}
