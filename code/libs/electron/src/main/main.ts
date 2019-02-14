import * as main from '@platform/electron/lib/main';
import { value as valueUtil } from '@platform/util.value';
import { app, BrowserWindow } from 'electron';
import * as os from 'os';
import { join } from 'path';

import { is, IUIHarnessRuntimeConfig } from '../common';
import { IContext, IpcClient, IpcMessage } from './types';
import * as mainWindow from './window';

export * from '../types';

type IResponse<M extends IpcMessage> = {
  window: BrowserWindow;
  newWindow: NewWindowFactory;
  log: main.IMainLog;
  ipc: IpcClient<M>;
  windows: main.IWindows;
};
type INewWindowArgs = { name: string; devTools?: boolean };
type NewWindowFactory = (e: INewWindowArgs) => BrowserWindow;

/**
 * Default loader for a UIHarness [main] process.
 */
export function init<M extends IpcMessage>(args: {
  config: IUIHarnessRuntimeConfig; //   The [.uiharess/config.json] file.
  name?: string; //                     The display name of the window.
  ipc?: IpcClient<M>; //                Existing IPC client if aleady initialized.
  log?: main.IMainLog; //               Existing log if already initialized.
  devTools?: boolean; //                Show dev tools on load when running in development (default: true)
  windows?: main.IWindows; //           The gloal windows manager.
}) {
  return new Promise<IResponse<M>>(async (resolve, reject) => {
    const { config, devTools } = args;
    const { log, ipc, id, store } = await main.init<M>({
      log: args.log || logDir({ appName: config.name }),
      ipc: args.ipc,
    });

    const context: IContext = { config, id, store, log, ipc: ipc as IpcClient };
    const windows = args.windows || main.createWindows({ ipc });

    app.on('ready', () => {
      const name = args.name || config.name || app.getName();
      const window = mainWindow.create({ ...context, name, devTools, windows });

      const newWindow: NewWindowFactory = e => {
        const devTools = valueUtil.defaultValue(
          e.devTools,
          is.dev() ? args.devTools : undefined,
        );
        return mainWindow.create({
          ...context,
          name: e.name,
          devTools,
          windows,
        });
      };

      const res: IResponse<M> = { window, newWindow, log, ipc, windows };
      resolve(res);
    });

    app.on('window-all-closed', () => {
      app.quit();
    });
  });
}

/**
 * Determines the path to the logs for the app.
 */
export function logDir(args: { appName: string }) {
  const platform = os.platform();
  const home = os.homedir();
  const appName = args.appName.replace(/\s/g, '-').toLowerCase();

  switch (platform) {
    case 'darwin':
      return join(home, 'Library/Logs', appName);

    case 'win32':
      return join(home, 'AppData\\Roaming', appName);

    case 'linux':
      return join(home, '.config', appName);

    default:
      throw new Error(
        `Platorm '${platform}' not supported. Must be Mac/OSX, Windows or Linux.`,
      );
  }
}

/**
 * Derives the set of log related paths for the app.
 */
export function logPaths(args: { appName: string }) {
  const { appName } = args;
  const dir = logDir({ appName });
  return main.logger.getPaths({ dir });
}
