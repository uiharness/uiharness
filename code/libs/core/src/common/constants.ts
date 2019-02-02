import { LogLevel } from '../types';

export const UNNAMED = 'Unnamed';

export const DEFAULT = {
  LOG_LEVEL: 3 as LogLevel,
};

export const URL = {
  SITE: 'https://uiharness.com',
};

export const PATH = {
  TMP: '.uiharness',
  TEMPLATES: 'node_modules/@uiharness/core/tmpl',
};

export const SCRIPTS = {
  postinstall: 'uiharness init',
  ui: 'uiharness $@',
  start: 'uiharness start $@',
};

export const PKG = {
  dependencies: {
    '@uiharness/electron': '__LATEST__',
  },
  devDependencies: {
    '@uiharness/core': '__LATEST__',
  },
};
