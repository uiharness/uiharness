import { fs, fsPath } from '../common';

/**
 * Removes temporary generated files.
 */
export async function clean(args: {}) {
  await fs.remove(fsPath.resolve('./.cache'));
  await fs.remove(fsPath.resolve('./.uiharness'));
}
