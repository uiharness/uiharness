export * from '../../common/constants';

export const PATH = {
  MAIN: {
    ENTRY: './src/main/main.ts',
    OUT_DIR: './src/main/.parcel',
    OUT_FILE: 'main',
  },
  RENDERER: {
    ENTRY: './src/renderer/index.html',
    OUT_DIR: './src/renderer/.parcel/development',
    OUT_DIR_PROD: './src/renderer/.parcel/production',
  },
  CACHE_DIR: './.uiharness/.cache',
  CONFIG: {
    DIR: './.uiharness',
    FILE: 'config.json',
  },
  TEMPLATES: './node_modules/@uiharness/electron/tmpl',
};

export const SCRIPTS = {
  postinstall: 'uiharness-electron init',
  start: 'uiharness-electron start',
  dist: 'uiharness-electron dist',
};

export const PKG = {
  dependencies: {
    '@uiharness/electron.ui': '__LATEST__',
  },
  devDependencies: {
    '@uiharness/electron': '__LATEST__',
  },
};
