import { Log } from '../types';
import { app, BrowserWindow } from 'electron';

import { IUIHarnessRuntimeConfig } from '../common';
import * as mainWindow from './window';

import { log as defaultLog } from '@tdb/log/lib/server';

export type IMainInitArgs = {
  config: IUIHarnessRuntimeConfig;
  log?: Log;
  name?: string;
};

export type IMainInitResponse = {
  window: BrowserWindow;
  newWindow: (args: { name: string }) => BrowserWindow;
};

/**
 * Default loader for a UIHarness [main] process.
 * @param config: The `.uiharess/config.json` file.
 */
export function init(args: IMainInitArgs) {
  return new Promise<IMainInitResponse>((resolve, reject) => {
    const { config, log = defaultLog } = args;

    app.on('ready', () => {
      const name = args.name || app.getName();
      const window = mainWindow.create({ config, name, log });
      resolve({
        window,
        newWindow: e => mainWindow.create({ config, name: e.name, log }),
      });
    });

    app.on('window-all-closed', () => {
      app.quit();
    });
  });
}
