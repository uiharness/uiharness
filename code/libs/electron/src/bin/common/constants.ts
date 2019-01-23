export * from '../../common/constants';

export const PATH = {
  MAIN: {
    ENTRY: './src/main.ts',
    OUT_DIR: './.uiharness/.bundle/main',
  },
  RENDERER: {
    ENTRY: './src/index.html',
    OUT_DIR: './.uiharness/.bundle/renderer/development',
    OUT_DIR_PROD: './.uiharness/.bundle/renderer/production',
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
  clean: 'uiharness-electron clean',
  open: 'uiharness-electron open',
};

export const PKG = {
  dependencies: {
    '@uiharness/electron.ui': '__LATEST__',
  },
  devDependencies: {
    '@uiharness/electron': '__LATEST__',
  },
};
