import { Log } from '@tdb/log';
import { app, BrowserWindow } from 'electron';

import { IUIHarnessRuntimeConfig } from '../common';
import * as mainWindow from './mainWindow';

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
  return new Promise<IMainInitResponse>((resolve, reject) => {
    const { config } = args;

    app.on('ready', async () => {
      const window = (win = mainWindow.create({ config }));
      resolve({ window });
    });

    app.on('window-all-closed', () => {
      win = undefined;
      app.quit();
    });
  });
}
