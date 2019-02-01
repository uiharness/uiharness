import * as main from '@tdb/electron/lib/main';
import { app, BrowserWindow } from 'electron';
import { join } from 'path';

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
 */
export function init<M extends IpcMessage>(args: {
  config: IUIHarnessRuntimeConfig; //   The [.uiharess/config.json] file.
  name?: string; //                     The display name of the window.
  ipc?: IpcClient; //                   Existing IPC client if aleady initialized.
  log?: Log; //                         Existing log if already initialized.
  devTools?: boolean; //                Show dev tools on load in running in development (default: true)
}) {
  return new Promise<IResponse<M>>((resolve, reject) => {
    const { config, devTools } = args;
    const { log, ipc } = main.init<M>({
      ipc: args.ipc,
      log: args.log || getLogDir({ config }),
    });

    const context: IContext = {
      config,
      log,
      ipc: ipc as UIHarnessIpc,
    };

    app.on('ready', () => {
      const name = args.name || config.name || app.getName();
      const window = mainWindow.create({ name, devTools, ...context });

      const res: IResponse<M> = {
        window,
        newWindow: e => mainWindow.create({ name: e.name, ...context }),
        log,
        ipc,
      };

      resolve(res);
    });

    app.on('window-all-closed', () => {
      app.quit();
    });
  });
}

export function getLogDir(args: { config: IUIHarnessRuntimeConfig }) {
  const { config } = args;
  const os = require('os');
  const platform = os.platform();
  const home = os.homedir();
  const appName = config.name.replace(/\s/g, '-').toLowerCase();

  switch (platform) {
    case 'darwin':
      return join(home, 'Library/Logs', appName);

    case 'win32':
      return join(home, 'AppData\\Roaming', appName);

    default:
      // Assume Linux.
      return join(home, '.config', appName);
  }
}
