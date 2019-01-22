import * as log from 'electron-log';
const isDev = require('electron-is-dev') as boolean;

export { log, isDev };
export { value } from '@tdb/util/lib';
export { resolve } from 'app-root-path';
