import { format } from 'url';
import { BrowserWindow, app } from 'electron';
import { resolve } from 'app-root-path';
const isDev = require('electron-is-dev');

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

  const devPath = 'http://localhost:8800';
  const prodPath = format({
    pathname: resolve('src/renderer/.parcel/production/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  const url = isDev ? devPath : prodPath;

  mainWindow.setMenu(null);
  mainWindow.loadURL(url);
});

app.on('window-all-closed', app.quit);
