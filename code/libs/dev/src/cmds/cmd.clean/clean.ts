import { fs, fsPath, log } from '../../common';

/**
 * Removes temporary generated files.
 */
export async function clean(args: {}) {
  const list = ['./.cache', './.uiharness'];

  log.info.gray('Removing:\n');
  const remove = (path: string) => {
    log.info.gray(`   🧹  ${path}`);
    return fs.remove(fsPath.resolve(path));
  };
  await Promise.all(list.map(path => remove(path)));

  log.info();
  log.info(`🌳  All clean.`);
  log.info();
}
