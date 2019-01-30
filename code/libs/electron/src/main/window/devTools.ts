import { BrowserWindow } from 'electron';
import * as WindowState from 'electron-window-state';

import { IContext, IWindowRefs } from '../types';

const OPACITY = {
  FULL: 1,
  DIM: 0.9,
};

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
export function showDevTools(
  args: IContext & {
    refs: IWindowRefs;
    title?: string;
  },
) {
  const { refs, title = 'UIHarness' } = args;

  const window = refs.window;
  if (!window) {
    return;
  }

  if (refs.devTools) {
    refs.devTools.show();
    return;
  }

  const file = `[uih.window].${window
    .getTitle()
    .replace(/\s/g, '_')}.devTools.json`;

  const bounds = window.getBounds();
  const state = WindowState({
    defaultWidth: bounds.width / 2,
    defaultHeight: bounds.height,
    file,
  });
  const saveState = () => state.saveState(devTools);

  const devTools = (refs.devTools = new BrowserWindow({
    title,
    width: state.width,
    height: state.height,
    parent: window,
    opacity: 0,
    show: false,
  }));

  const webContents = window.webContents;
  webContents.setDevToolsWebContents(devTools.webContents);
  webContents.openDevTools({ mode: 'detach' });

  const updatePosition = () => {
    const bounds = window.getBounds();
    devTools.setPosition(bounds.x + bounds.width + 10, bounds.y);
  };

  const updateOpacity = () => {
    const isFocused = window.isFocused() || devTools.isFocused();
    const opacity = isFocused ? OPACITY.FULL : OPACITY.DIM;
    devTools.setOpacity(opacity);
  };

  devTools.once('ready-to-show', () => {
    updatePosition();
    updateOpacity();
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

  window.on('close', () => {
    refs.devTools = undefined;
    devTools.close();
  });

  window.on('move', () => updatePosition());

  window.on('focus', () => updateOpacity());
  window.on('blur', () => updateOpacity());
  devTools.on('focus', () => updateOpacity());
  devTools.on('blur', () => updateOpacity());
}
