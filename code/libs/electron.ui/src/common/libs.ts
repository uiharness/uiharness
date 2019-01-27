import * as log from 'electron-log';
const isDev = require('electron-is-dev') as boolean;

export { log, isDev };
export { resolve } from 'app-root-path';
