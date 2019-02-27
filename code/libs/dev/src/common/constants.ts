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
  TEMPLATES: 'node_modules/@uiharness/dev/templates',
};

export const SCRIPTS = {
  ui: 'ui $@',
  start: 'ui start $@',
};

export const PKG = {
  dependencies: {
    '@uiharness/electron': '__LATEST__',
  },
  devDependencies: {
    '@uiharness/dev': '__LATEST__',
  },
};
