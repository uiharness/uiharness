import * as cmds from '@platform/electron/lib/bin/cmds';
import { Settings } from '../../settings';

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
export async function rebuild() {
  await cmds.rebuild();
}
