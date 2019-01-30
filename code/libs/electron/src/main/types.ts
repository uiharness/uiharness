import { BrowserWindow } from 'electron';

export * from '../types';

export type IWindowRefs = {
  window?: BrowserWindow;
  devTools?: BrowserWindow;
};
