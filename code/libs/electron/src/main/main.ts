import * as main from '@platform/electron/lib/main';
import { app, BrowserWindow } from 'electron';
import * as os from 'os';
import { join } from 'path';

import { IRuntimeConfig } from '../common';
import * as menus from './menus';
import * as t from './types';
import * as mainWindow from './window';

export * from '../types';

type IResponse<M extends t.IpcMessage> = {
  window: BrowserWindow;
  newWindow: t.NewWindowFactory;
  windows: main.IWindows;
  log: main.IMainLog;
  ipc: t.IpcClient<M>;
  store: main.IStoreClient;
};

/**
 * Default loader for a UIHarness [main] process.
 */
export function init<M extends t.IpcMessage>(args: {
  config: IRuntimeConfig; //   The [.uiharess/config.json] file.
  name?: string; //                     The display name of the window.
  ipc?: t.IpcClient<M>; //                Existing IPC client if aleady initialized.
  log?: main.IMainLog; //               Existing log if already initialized.
  devTools?: boolean; //                Show dev tools on load when running in development (default: true)
  windows?: main.IWindows; //           The gloal windows manager.
}) {
  return new Promise<IResponse<M>>(async (resolve, reject) => {
    const { config, devTools } = args;

    /**
     * Initialize [@platform/electron] module.
     */
    const appName = config.name;
    const res = await main.init<M>({
      log: args.log || logDir({ appName }),
      ipc: args.ipc,
      windows: args.windows,
    });
    const { log, ipc, id, store, windows } = res;
    const context: t.IContext = { config, id, store, log, ipc, windows };

    /**
     * Initialize application when `ready`.
     */
    app.on('ready', () => {
      const name = args.name || config.name || app.getName();
      const window = mainWindow.create({ ...context, name, devTools, windows });

      /**
       * Factory for spawning a new window.
       */
      const newWindow: t.NewWindowFactory = (options = {}) => {
        const { x, y } = getNewWindowPosition(20);
        return mainWindow.create({
          name: options.name || name,
          defaultX: x,
          defaultY: y,
          ...context,
          ...options,
        });
      };

      /**
       * Start the menu manager.
       */
      menus.manage({ ...context, newWindow });

      // Finish up.
      const res: IResponse<M> = { window, newWindow, log, ipc, windows, store };
      resolve(res);
    });

    /**
     * [Quit] when all windows are closed.
     */
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
      throw new Error(`Platorm '${platform}' not supported. Must be Mac/OSX, Windows or Linux.`);
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

/**
 * [INTERNAL]
 */
function getNewWindowPosition(offset: number) {
  const window = BrowserWindow.getFocusedWindow();
  const bounds = window && window.getBounds();
  const x = bounds ? bounds.x + offset : undefined;
  const y = bounds ? bounds.y + offset : undefined;
  return { x, y };
}
