import { BrowserWindow } from 'electron';
import * as WindowState from 'electron-window-state';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { format } from 'url';

import { is, IUIHarnessRuntimeConfig, path } from '../../common';
import { IWindowRefs } from '../types';
import { showDevTools } from './devTools';
import { createMenus } from './menus';

/**
 * Creates the main window.
 */
export function create(args: { config: IUIHarnessRuntimeConfig }) {
  const { config } = args;

  const refs: IWindowRefs = {
    window: undefined,
    devTools: undefined,
  };

  const state = WindowState({
    defaultWidth: 1200,
    defaultHeight: 800,
    file: `[uih.${config.name.replace(/\s/g, '_')}].main-window.json`,
  });

  const state$ = new Subject();
  const saveState = () => state.saveState(window);
  state$.pipe(debounceTime(200)).subscribe(() => saveState());

  const window = (refs.window = new BrowserWindow({
    show: false, // NB: Hidden until ready-to-show.
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
  }));

  createMenus({ refs, config });

  // Show the window when it's ready.
  window.once('ready-to-show', () => {
    window.show();
    if (is.dev()) {
      showDevTools({ refs, config });
    }
  });

  window.on('moved', () => state$.next());
  window.on('closed', () => {
    saveState();
    refs.window = undefined;
  });

  const paths = getPaths(config);
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
