export const UNNAMED = 'Unnamed';

export const URL = {
  SITE: 'https://uiharness.com',
};

const TMP = './.uiharness';
const DIR = {
  TMP,
  BUNDLE: `${TMP}/.bundle`,
};

export const PATH = {
  TEMPLATES: './node_modules/@uiharness/core/tmpl',
  DIR,
  WEB: {
    ENTRY: './src/test/web.html',
    OUT_FILE: 'index.html',
    OUT_DIR: {
      DEV: `${DIR.BUNDLE}/web/dev`,
      PROD: `${DIR.BUNDLE}/web/prod`,
    },
  },
};

export const SCRIPTS = {
  postinstall: 'uiharness init',
  ui: 'uiharness $@',
};

export const PKG = {
  dependencies: {
    '@uiharness/electron': '__LATEST__',
  },
  devDependencies: {
    '@uiharness/core': '__LATEST__',
  },
};
