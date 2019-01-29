import { BrowserWindow } from 'electron';
export { IUIHarnessRuntimeConfig } from '../types';

export type IWindowRefs = {
  window?: BrowserWindow;
  devTools?: BrowserWindow;
};
