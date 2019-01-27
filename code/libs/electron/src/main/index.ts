import { isDev, resolve, IUIHarnessRuntimeConfig } from '../common';
import { app, BrowserWindow } from 'electron';
import { format } from 'url';

/**
 * Default loader for a UIHarness [main] process.
 * @param config: The `.uiharess/config.json` file.
 */
export function init(config: IUIHarnessRuntimeConfig) {
  app.on('ready', async () => {
    const mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false,
    });

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      if (isDev) {
        mainWindow.webContents.openDevTools();
      }
    });

    const paths = getPaths(config);
    mainWindow.setMenu(null);
    mainWindow.loadURL(paths.url);
  });

  app.on('window-all-closed', app.quit);
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
