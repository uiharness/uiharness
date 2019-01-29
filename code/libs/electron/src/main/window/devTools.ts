import { BrowserWindow } from 'electron';
import * as WindowState from 'electron-window-state';

import { IWindowRefs } from '../types';

/**
 * Control the position of the detached dev-tools.
 * Source:
 *    https://stackoverflow.com/questions/53678438/dev-tools-size-and-position-in-electron
 */
export function showDevTools(refs: IWindowRefs) {
  const window = refs.window;
  if (!window) {
    return;
  }

  if (refs.devTools) {
    refs.devTools.show();
    return;
  }

  const bounds = window.getBounds();
  const state = WindowState({
    defaultWidth: bounds.width / 2,
    defaultHeight: bounds.height,
    file: 'uiharness.window.devTools.json',
  });

  const devTools = (refs.devTools = new BrowserWindow({
    show: false,
    title: 'Dev Tools',
    width: state.width,
    height: state.height,
  }));
  state.manage(devTools);

  const webContents = window.webContents;
  webContents.setDevToolsWebContents(devTools.webContents);
  webContents.openDevTools({ mode: 'detach' });

  const updatePosition = () => {
    const bounds = window.getBounds();
    devTools.setPosition(bounds.x + bounds.width + 10, bounds.y);
  };

  devTools.once('ready-to-show', () => {
    updatePosition();
    devTools.show();
  });

  devTools.on('close', e => {
    e.preventDefault();
    devTools.hide();
  });

  webContents.once('did-finish-load', () => {
    devTools.setSize(state.width, state.height);
    updatePosition();
  });

  window.on('move', () => updatePosition());
}
