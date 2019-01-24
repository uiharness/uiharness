export * from '../../common/constants';

const DIR = './.uiharness';
const BUNDLE_DIR = `${DIR}/.bundle`;

export const PATH = {
  BUNDLE_DIR,
  TEMPLATES: './node_modules/@uiharness/electron/tmpl',
  MAIN: {
    ENTRY: './src/main.ts',
    OUT_DIR: `${BUNDLE_DIR}/main`,
  },
  RENDERER: {
    ENTRY: './src/index.html',
    OUT_DIR: {
      DEV: `${BUNDLE_DIR}/renderer/development`,
      PROD: `${BUNDLE_DIR}/renderer/production`,
    },
  },
  CONFIG: {
    DIR,
    FILE: 'config.json',
  },
};

export const SCRIPTS = {
  postinstall: 'uiharness-electron init',
  start: 'uiharness-electron start',
  bundle: 'uiharness-electron bundle',
  dist: 'uiharness-electron dist',
  open: 'uiharness-electron open',
  stats: 'uiharness-electron stats',
  clean: 'uiharness-electron clean',
};

export const PKG = {
  dependencies: {
    '@uiharness/electron.ui': '__LATEST__',
  },
  devDependencies: {
    '@uiharness/electron': '__LATEST__',
  },
};
