export const UNNAMED = 'Unnamed';

export const URL = {
  SITE: 'https://uiharness.com',
};

export const PATH = {
  TMP: './.uiharness',
  TEMPLATES: './node_modules/@uiharness/core/tmpl',
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
