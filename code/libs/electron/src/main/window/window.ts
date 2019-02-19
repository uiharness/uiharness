import main from '@platform/electron/lib/main';
import { BrowserWindow } from 'electron';
import * as WindowState from 'electron-window-state';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { format } from 'url';

import {
  constants,
  is,
  IUIHarnessRuntimeConfig,
  path,
  value,
} from '../../common';
import * as t from '../types';

const TAG = constants.TAG.WINDOW;

/**
 * Creates the main window.
 */
export function create(args: t.IContext & t.INewWindowArgs) {
  const { id, store, config, log, ipc, windows } = args;
  const context: t.IContext = { config, id, store, log, ipc, windows };
  const title = args.name || config.name;
  const devTools = value.defaultValue(args.devTools, true);
  const defaultWidth = value.defaultValue(args.defaultWidth, 1000);
  const defaultHeight = value.defaultValue(args.defaultHeight, 800);
  const index = getIndex(windows);

  /**
   * Setup window state manager (bounds).
   */
  const file = `window-state/uiharness-${index}.json`;
  const state = WindowState({
    defaultWidth,
    defaultHeight,
    file,
  });
  const state$ = new Subject();
  const saveState = () => state.saveState(window);
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
  windows.tag(window.id, { tag: TAG.key, value: TAG.value });

  /**
   * Show when ready.
   */
  window.once('ready-to-show', () => {
    window.show();
    window.setTitle(title);
    if (devTools && is.dev) {
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
  window.on('closed', () => saveState());

  // Finish up.
  window.loadURL(getPaths(config).url);
  return window;
}

/**
 * [INTERNAL]
 */
function getPaths(config: IUIHarnessRuntimeConfig) {
  const port = config.electron.port;
  const dev = `http://localhost:${port}`;
  const prod = format({
    protocol: 'file:',
    pathname: path.resolve(config.electron.renderer),
    slashes: true,
  });
  const url = is.dev ? dev : prod;
  return { dev, prod, url };
}

function getIndex(windows: main.IWindows) {
  const matches = windows.refs.filter(ref =>
    ref.tags.some(({ tag, value }) => tag === TAG.key && value === TAG.value),
  );

  return matches.length;
}
