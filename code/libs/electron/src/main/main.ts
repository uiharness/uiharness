import * as main from '@platform/electron/lib/main';
import { fs } from '@platform/fs';
import { app, BrowserWindow } from 'electron';
import * as os from 'os';

import { IRuntimeConfig, value } from '../common';
import * as menus from './menus';
import * as t from './types';
import * as mainWindow from './window';

export * from '../types';
export const is = main.is;

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
  ipc?: t.IpcClient; //                Existing IPC client if aleady initialized.
  log?: main.IMainLog; //               Existing log if already initialized.
  devTools?: boolean; //                Show dev tools on load when running in development (default: true)
  windows?: main.IWindows; //           The gloal windows manager.
}) {
  return new Promise<IResponse<M>>(async (resolve, reject) => {
    try {
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
      const { log, id, store, windows } = res;
      const ipc = res.ipc as t.IpcClient;
      const context: t.IContext = { config, id, store, log, ipc, windows };

      /**
       * Initialize application when `ready`.
       */
      app.on('ready', () => {
        try {
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
        } catch (error) {
          reject(error);
        }
      });

      /**
       * [Quit] when all windows are closed.
       */
      app.on('window-all-closed', () => {
        app.quit();
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Determines the path to the logs for the app.
 */
export function logDir(args: { appName: string; env?: t.Environment }) {
  const env = toEnv(args.env);
  const appName = args.appName.replace(/\s/g, '-').toLowerCase();

  if (env === 'development') {
    return fs.join(fs.resolve('./.dev/log'), appName);
  }

  // Platform specific paths.
  const platform = os.platform();
  const home = os.homedir();
  switch (platform) {
    case 'darwin':
      return fs.join(home, 'Library/Logs', appName);

    case 'win32':
      return fs.join(home, 'AppData\\Roaming', appName);

    case 'linux':
      return fs.join(home, '.config', appName);

    default:
      throw new Error(`Platorm '${platform}' not supported. Must be Mac/OSX, Windows or Linux.`);
  }
}

/**
 * Derives the set of log related paths for the app.
 */
export function paths(args: { appName: string; env?: t.Environment }) {
  const { appName } = args;
  const env = toEnv(args.env);
  const log = main.logger.getPaths({ dir: logDir({ appName, env }) });
  return { env, log };
}

/**
 * [INTERNAL]
 */
function toEnv(env?: t.Environment) {
  return value.defaultValue(env, main.is.prod ? 'production' : 'development');
}

function getNewWindowPosition(offset: number) {
  const window = BrowserWindow.getFocusedWindow();
  const bounds = window && window.getBounds();
  const x = bounds ? bounds.x + offset : undefined;
  const y = bounds ? bounds.y + offset : undefined;
  return { x, y };
}
