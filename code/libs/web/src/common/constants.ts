export { IS_DEV, IS_BROWSER } from '@tdb/util/lib/constants';

export const URL = {
  SITE: 'https://uiharness.com',
};

export const PATH = {
  ENTRY: './src/index.html',
  CACHE_DIR: './.uiharness/.cache',
  OUT_DIR: './.uiharness/dist',
  TEMPLATES: './node_modules/@uiharness/web/tmpl',
};

export const SCRIPTS = {
  postinstall: 'uiharness init',
  start: 'uiharness start',
  dist: 'uiharness dist',
  stats: 'uiharness stats',
  clean: 'uiharness clean',
  serve: 'serve -s .uiharness/dist',
};
