import { Log } from '@tdb/log';
import { app, BrowserWindow } from 'electron';

import { IUIHarnessRuntimeConfig } from '../common';
import * as mainWindow from './window';

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

    app.on('ready', () => {
      const window = mainWindow.create({ config });
      resolve({ window });
    });

    app.on('window-all-closed', () => {
      app.quit();
    });
  });
}
