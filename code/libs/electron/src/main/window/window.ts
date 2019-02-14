import { BrowserWindow } from 'electron';
import * as WindowState from 'electron-window-state';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { format } from 'url';

import {
  is,
  IUIHarnessRuntimeConfig,
  path,
  value,
  constants,
} from '../../common';
import { IWindowRefs, IContext } from '../types';
import { createMenus } from './menus';

import main from '@platform/electron/lib/main';

/**
 * Creates the main window.
 */
export function create(
  args: IContext & {
    name: string;
    devTools?: boolean;
    defaultWidth?: number;
    defaultHeight?: number;
    windows?: main.IWindows;
  },
) {
  const { id, store, config, log, ipc, windows } = args;
  const context: IContext = { config, id, store, log, ipc };
  const devTools = value.defaultValue(args.devTools, true);
  const defaultWidth = value.defaultValue(args.defaultWidth, 1000);
  const defaultHeight = value.defaultValue(args.defaultHeight, 800);

  const refs: IWindowRefs = {
    window: undefined,
    devTools: undefined,
  };

  const title = args.name || config.name;
  const file = `window-state/[uih].${title.replace(/\s/g, '_')}.json`;
  const state = WindowState({
    defaultWidth,
    defaultHeight,
    file,
  });

  const state$ = new Subject();
  const saveState = () => state.saveState(window);
  state$.pipe(debounceTime(200)).subscribe(() => saveState());

  const window = (refs.window = new BrowserWindow({
    title,
    show: false, // NB: Hidden until ready-to-show.
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    acceptFirstMouse: true,
  }));

  createMenus({ ...context, refs, windows });

  // Show the window when it's ready.
  window.once('ready-to-show', () => {
    window.show();
    window.setTitle(title);
    if (devTools && is.dev()) {
      main.devTools.create({
        ...context,
        parent: window,
        title: constants.NAME,
        windows,
      });
    }
  });

  window.on('moved', () => state$.next());
  window.on('closed', () => {
    refs.window = undefined;
    saveState();
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
