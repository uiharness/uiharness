export const URL = {
  SITE: 'https://uiharness.com',
};

const DIR = './.uiharness';
const BUNDLE_DIR = `${DIR}/.bundle`;

export const PATH = {
  UIHARNESS: DIR,
  PACKAGE: `${DIR}/package.json`,
  BUNDLE_DIR,
  TEMPLATES: './node_modules/@uiharness/electron/tmpl',
  CONFIG: {
    DIR,
    FILE: 'config.json',
  },
  ELECTRON: {
    MAIN: {
      DEFAULT_ENTRY: './src/test/app.main.ts',
      OUT_FILE: 'main.js',
      OUT_DIR: `${BUNDLE_DIR}/main`,
    },
    RENDERER: {
      DEFAULT_ENTRY: './src/test/app.renderer.html',
      OUT_FILE: 'renderer.html',
      OUT_DIR: {
        DEV: `${BUNDLE_DIR}/renderer/development`,
        PROD: `${BUNDLE_DIR}/renderer/production`,
      },
    },
  },
  WEB: {
    ENTRY: './src/test/web.html',
    OUT_FILE: 'web.html',
    OUT_DIR: {
      DEV: `${BUNDLE_DIR}/web/development`,
      PROD: `${BUNDLE_DIR}/web/production`,
    },
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
