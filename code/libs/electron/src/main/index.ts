import { is, path, IUIHarnessRuntimeConfig } from '../common';
import { app, BrowserWindow } from 'electron';
import { format } from 'url';
import { Log } from '@tdb/log';

let win: BrowserWindow | undefined;

export type IMainInitResponse = {
  window: BrowserWindow;
};

export type IMainInitArgs = {
  config: IUIHarnessRuntimeConfig;
  log?: Log;
};

/**
 * Default loader for a UIHarness [main] process.
 * @param config: The `.uiharess/config.json` file.
 */
export function init(args: IMainInitArgs) {
  const { config } = args;

  return new Promise<IMainInitResponse>((resolve, reject) => {
    app.on('ready', async () => {
      const window = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
      });
      win = window;

      window.once('ready-to-show', () => {
        window.show();
        if (is.dev()) {
          window.webContents.openDevTools();
        }
      });

      const paths = getPaths(config);
      win.setMenu(null);
      win.loadURL(paths.url);

      // Finish up.
      resolve({ window });
    });

    app.on('window-all-closed', () => {
      win = undefined;
      app.quit();
    });
  });
}

/**
 * INTERNAL
 */

function getPaths(config: IUIHarnessRuntimeConfig) {
  const dev = `http://localhost:${config.electron.port}`;
  const prod = format({
    protocol: 'file:',
    pathname: path.resolve(config.electron.renderer),
    slashes: true,
  });
  const url = is.dev() ? dev : prod;
  return { dev, prod, url };
}
