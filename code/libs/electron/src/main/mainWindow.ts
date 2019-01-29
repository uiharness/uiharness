import { BrowserWindow } from 'electron';
import * as WindowState from 'electron-window-state';
import { format } from 'url';

import { is, IUIHarnessRuntimeConfig, path, time } from '../common';

/**
 * Creates the main window.
 */
export function create(args: { config: IUIHarnessRuntimeConfig }) {
  const { config } = args;

  const state = WindowState({
    defaultWidth: 1200,
    defaultHeight: 800,
    file: 'uiharness.window-main.json',
  });

  const window = new BrowserWindow({
    show: false, // NB: Hidden until ready-to-show.
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
  });
  state.manage(window);

  // Show the window when it's ready.
  window.once('ready-to-show', () => {
    window.show();
    if (is.dev()) {
      devTools(window);
    }
  });

  const paths = getPaths(config);
  window.setMenu(null);
  window.loadURL(paths.url);

  // Finish up.
  return window;
}

/**
 * INTERNAL
 */

function getPaths(config: IUIHarnessRuntimeConfig) {
  const port = config.electron.port;
  const dev = `http://localhost:${port}`;
  const prod = format({
    protocol: 'file:',
    pathname: path.resolve(config.electron.renderer),
    slashes: true,
  });
  const url = is.dev() ? dev : prod;
  return { dev, prod, url };
}

/**
 * Control the position of the detached dev-tools.
 * Source:
 *    https://stackoverflow.com/questions/53678438/dev-tools-size-and-position-in-electron
 */
function devTools(window: BrowserWindow) {
  const devtools = new BrowserWindow({ show: false });

  const webContents = window.webContents;
  webContents.setDevToolsWebContents(devtools.webContents);
  webContents.openDevTools({ mode: 'detach' });

  const updatePosition = () => {
    const bounds = window.getBounds();
    devtools.setPosition(bounds.x + bounds.width + 10, bounds.y);
  };

  devtools.once('ready-to-show', () => {
    updatePosition();
    devtools.show();
  });

  webContents.once('did-finish-load', () => {
    const bounds = window.getBounds();
    devtools.setSize(bounds.width / 2, bounds.height);
    updatePosition();
  });

  window.on('move', () => updatePosition());
}
