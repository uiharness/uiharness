export const UNNAMED = 'Unnamed';

export const URL = {
  SITE: 'https://uiharness.com',
};

const TMP = './.uiharness';
const DIR = {
  TMP,
  BUNDLE: `${TMP}/.bundle`,
  TEMPLATES: './node_modules/@uiharness/core/tmpl',
};

export const PATH = {
  DIR,
  ELECTRON: {
    MAIN: {
      DEFAULT_ENTRY: './test/app/main.ts',
      OUT_FILE: 'main.js',
      OUT_DIR: `${DIR.BUNDLE}/app.main`,
    },
    RENDERER: {
      DEFAULT_ENTRY: './test/app/renderer.tsx',
      HTML_ENTRY: './.uiharness/html/renderer.html',
      OUT_FILE: 'app.html',
      OUT_DIR: {
        DEV: `${DIR.BUNDLE}/app.renderer/dev`,
        PROD: `${DIR.BUNDLE}/app.renderer/prod`,
      },
    },
    BUILDER: {
      CONFIG: {
        FILE_NAME: `uiharness.builder.yml`,
      },
      FILES: [
        '.uiharness/.bundle/app.main/**',
        '.uiharness/.bundle/app.renderer/prod/**',
      ],
      OUTPUT: '.uiharness/dist',
    },
  },
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
