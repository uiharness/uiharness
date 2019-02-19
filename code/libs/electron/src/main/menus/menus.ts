import { Menu, MenuItemConstructorOptions } from 'electron';

import { IContext } from '../types';
import * as about from './menu.about';
import * as edit from './menu.edit';
import * as help from './menu.help';
import * as view from './menu.view';
import * as window from './menu.window';

/**
 * Handles the creation of menus.
 */
export function createMenus(args: IContext) {
  const { config, id, store, log, ipc, windows } = args;
  const context: IContext = { config, id, store, log, ipc, windows };

  const template: MenuItemConstructorOptions[] = [
    edit.current(context),
    view.current(context),
    window.current(context),
    help.current(context),
  ];

  if (process.platform === 'darwin') {
    template.unshift(about.current(context));
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
