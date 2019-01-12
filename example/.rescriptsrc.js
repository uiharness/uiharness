/**
 * https://github.com/harrysolovay/rescripts
 */

// const logConfig = config => {
//   // (config.plugins || []).forEach(e => {
//   //   console.log(e);
//   //   console.log();
//   // });

//   return config;
// };

// logConfig.isMiddleware = true;

module.exports = [
  ['use-tslint-config', 'tslint.json'],
  // require.resolve('./webpack.config.js'),
  // logConfig,
];
