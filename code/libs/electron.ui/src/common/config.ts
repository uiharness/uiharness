import { log } from './libs';
import { IUIHarnessRuntimeConfig } from '../types';

let json: IUIHarnessRuntimeConfig | undefined;

try {
  // Step up out of `node_modules` and into the host module.
  json = require('../../../../../.uiharness/config.json');
} catch (error) {
  log.warn(`Failed to load '/.uiharness/config.json'.`);
}

export const config = json as IUIHarnessRuntimeConfig;
