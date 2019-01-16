import { core } from './common';

const pkg = core.config.Package.create();
console.log('pkg.version', pkg.version);

/**
 * Initialize the module.
 */
export async function init(options: { force?: boolean; reset?: boolean } = {}) {
  console.log('options', options);
}
