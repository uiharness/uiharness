import main from '@platform/electron/lib/main';
import { BrowserWindow } from 'electron';
import * as WindowState from 'electron-window-state';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { format } from 'url';

import { constants, IRuntimeConfig, path, TAG, value } from '../../common';
import * as t from '../types';

/**
 * Creates the main window.
 */
export function create(args: t.IContext & t.INewWindowArgs) {
  const { id, store, config, log, ipc, windows, entry = 'default' } = args;

  const context: t.IContext = { config, id, store, log, ipc, windows };
  const title = args.name || config.name;
  const devTools = value.defaultValue(args.devTools, true);
  const defaultWidth = value.defaultValue(args.defaultWidth, 1000);
  const defaultHeight = value.defaultValue(args.defaultHeight, 800);
  const index = windows.byTag(TAG.WINDOW.key, TAG.WINDOW.value).length;

  /**
   * Setup window state manager (bounds).
   */
  const file = `window-state/uiharness-${index}.json`;
  const state = WindowState({
    defaultWidth,
    defaultHeight,
    file,
  });
  const saveState = () => state.saveState(window);
  const state$ = new Subject();
  state$.pipe(debounceTime(200)).subscribe(() => saveState());

  /**
   * Create the window.
   */
  const x = value.defaultValue(state.x, args.defaultX);
  const y = value.defaultValue(state.y, args.defaultY);
  const window = new BrowserWindow({
    title,
    show: false, // NB: Hidden until ready-to-show.
    x,
    y,
    width: state.width,
    height: state.height,
    acceptFirstMouse: true,
    fullscreenable: false,
  });
  windows.tag(window.id, { tag: TAG.WINDOW.key, value: TAG.WINDOW.value });

  /**
   * Show when ready.
   */
  window.once('ready-to-show', () => {
    window.show();
    window.setTitle(title);
    if (devTools && main.is.dev) {
      main.devTools.create({
        ...context,
        parent: window,
        title: constants.NAME,
        windows,
      });
    }
  });

  /**
   * Update state on change.
   */
  window.on('moved', () => state$.next());
  window.on('resize', () => state$.next());
  window.on('closed', () => saveState());

  /**
   * Load the window URL.
   */
  const paths = getPaths(config, entry);
  window.loadURL(paths.url);

  // Finish up.
  return window;
}

/**
 * [INTERNAL]
 */
function getPaths(config: IRuntimeConfig, entryKey: string) {
  console.log('entryKey', entryKey);

  const port = config.electron.port;
  const dev = `http://localhost:${port}`;
  const prod = format({
    protocol: 'file:',
    pathname: path.resolve(config.electron.renderer[entryKey]),
    slashes: true,
  });
  const url = main.is.dev ? dev : prod;
  return { dev, prod, url };
}
