import { init } from '@uiharness/electron/lib/main';

/**
 * Start the [main] UIHarness window.
 *
 * NOTE:
 *  To do something different simply write your own
 *  electron [main] entry-point here.
 *
 *  See:
 *    https://electronjs.org/docs/tutorial/first-app#electron-development-in-a-nutshell
 *
 */
const config = require('../../.uiharness/config.json');
init(config);
