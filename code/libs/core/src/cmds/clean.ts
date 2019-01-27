import { fs, fsPath } from '../common';

/**
 * Removes temporary generated files.
 */
export async function clean(args: {}) {
  const list = ['./.cache', './.uiharness'];
  const remove = (path: string) => fs.remove(fsPath.resolve(path));
  await Promise.all(list.map(path => remove(path)));
}
