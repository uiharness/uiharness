import * as cmds from '@platform/electron/lib/bin/cmds';
import { log } from '../../common';

/**
 * Rebuilds native modules.
 *
 * Background:
 *   - https://electronjs.org/docs/tutorial/using-native-node-modules
 *
 * May require `libtool`:
 *   - brew install libtool
 *
 * Found via similar fix in Beaker Browser:
 *   - https://github.com/beakerbrowser/beaker/blob/master/tasks/rebuild.js
 *   - https://github.com/electron/electron/issues/5851
 *
 */
export async function rebuild(options: { silent?: boolean; cwd?: string } = {}) {
  const { silent, cwd } = options;
  await cmds.rebuild({ silent, cwd });

  if (!options.silent) {
    // Print reference to documentation.
    const url = 'https://electronjs.org/docs/tutorial/using-native-node-modules';
    log.info('🤟');
    log.info(`For more information see:`);
    log.info(`- ${log.blue(url)}`);
    log.info();
  }
}
