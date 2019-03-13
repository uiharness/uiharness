import { fs, log } from '../../common';

/**
 * Removes temporary generated files.
 */
export async function clean(args: {}) {
  const list = ['./.cache', './.uiharness', './.dev'];

  log.info.gray('Removing:\n');
  const remove = (path: string) => {
    log.info.gray(`   🐷  ${path}`);
    return fs.remove(fs.resolve(path));
  };
  await Promise.all(list.map(path => remove(path)));

  log.info();
  log.info(`🌳  All clean now.`);
  log.info();
}
