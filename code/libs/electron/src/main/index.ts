import { isDev, resolve, IUIHarnessRuntimeConfig } from '../common';
import { app, BrowserWindow } from 'electron';
import { format } from 'url';
import { Log } from '@tdb/log';

let window: BrowserWindow | undefined;

export type IMainInitResponse = {
  window: { primary: BrowserWindow };
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
      const primary = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
      });
      window = primary;

      primary.once('ready-to-show', () => {
        primary.show();
        if (isDev) {
          primary.webContents.openDevTools();
        }
      });

      const paths = getPaths(config);
      window.setMenu(null);
      window.loadURL(paths.url);

      // window.on('')

      // Finish up.
      resolve({
        window: { primary },
      });
    });

    app.on('window-all-closed', () => {
      window = undefined;
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
    pathname: resolve(config.electron.renderer),
    protocol: 'file:',
    slashes: true,
  });
  const url = isDev ? dev : prod;
  return { dev, prod, url };
}
