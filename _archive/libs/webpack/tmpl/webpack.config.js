const uiharness = require('@uiharness/webpack');

/**
 * Webpack Configuration.
 * See:
 *    https://webpack.js.org/configuration/
 */
module.exports = config => {
  /**
   * Apply UIHarness configurations to webpack.
   */
  config = uiharness.webpack(config);

  /**
   * Example loader:
   * https://github.com/webpack-contrib/raw-loader
   */
  config.module.rules.push({
    test: /\.txt$/,
    use: 'raw-loader',
  });

  return config;
};
