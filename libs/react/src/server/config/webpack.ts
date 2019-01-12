import { IWebpackConfig } from '../../types';
import { fsPath } from '../common/libs';
import { Settings } from './Settings';

/**
 * Performs configuration on the given webpack.
 */
export function webpack(config: IWebpackConfig) {
  const settings = Settings.create(fsPath.resolve('.'));
  if (!settings) {
    // There is no `uiharness.yml` settings file to read.
    return config;
  }
  config = { ...config };
  const webpack = settings.webpack;

  // Entry point(s).
  if (webpack.entry) {
    let entry = config.entry;
    entry = entry ? (Array.isArray(entry) ? entry : [entry]) : [];
    config.entry = [...entry.slice(0, entry.length - 1), webpack.entry];
  }

  // Finish up.
  return config;
}
