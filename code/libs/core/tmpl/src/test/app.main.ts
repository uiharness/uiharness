import { isDev, resolve, IUIHarnessRuntimeConfig } from '@uiharness/electron';
import { app, BrowserWindow } from 'electron';
import { format } from 'url';

const config: IUIHarnessRuntimeConfig = require('../../.uiharness/config.json');

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

  const devPath = `http://localhost:${config.electron.port}`;
  const prodPath = format({
    pathname: resolve(config.electron.renderer),
    protocol: 'file:',
    slashes: true,
  });
  const url = isDev ? devPath : prodPath;

  mainWindow.setMenu(null);
  mainWindow.loadURL(url);
});

app.on('window-all-closed', app.quit);
