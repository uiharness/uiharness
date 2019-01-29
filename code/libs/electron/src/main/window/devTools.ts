import { BrowserWindow } from 'electron';
import * as WindowState from 'electron-window-state';

import { IWindowRefs, IUIHarnessRuntimeConfig } from '../types';

/**
 * Control the position of the detached dev-tools.
 *
 * Source:
 *    https://stackoverflow.com/questions/53678438/dev-tools-size-and-position-in-electron
 *
 * Docs for dev-tools:
 *    https://github.com/electron/electron/blob/master/docs/tutorial/devtools-extension.md
 *
 */
export function showDevTools(args: {
  refs: IWindowRefs;
  config: IUIHarnessRuntimeConfig;
}) {
  const { refs, config } = args;
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
    file: `[uih.${config.name.replace(/\s/g, '_')}].devTools-window.json`,
  });
  const saveState = () => state.saveState(devTools);

  const devTools = (refs.devTools = new BrowserWindow({
    show: false,
    title: 'Dev Tools',
    width: state.width,
    height: state.height,
  }));

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
    saveState();
  });

  devTools.on('resize', () => {
    saveState(); // NB: Should be debounced.
  });

  webContents.once('did-finish-load', () => {
    devTools.setSize(state.width, state.height);
    updatePosition();
  });

  window.on('move', () => updatePosition());
}
