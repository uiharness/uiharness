export * from '../../common/constants';

export const PATH = {
  TEMPLATES: './node_modules/@uiharness/electron/tmpl',
  MAIN_ENTRY: './src/main/main.ts',
  CONFIG: {
    DIR: './.uiharness',
    FILE: 'config.json',
  },
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
