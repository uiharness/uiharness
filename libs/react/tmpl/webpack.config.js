/**
 * Webpack Configuration.
 * See:
 *    https://webpack.js.org/configuration/
 */
module.exports = config => {
  // Example:
  //    https://github.com/webpack-contrib/raw-loader

  config.module.rules.push({
    test: /\.txt$/,
    use: 'raw-loader',
  });

  return config;
};
