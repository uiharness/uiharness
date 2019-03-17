import { fs, log, getTSConfigFiles } from '../../common';

/**
 * Removes temporary generated files.
 */
export async function clean(args: {}) {
  const tsconfigFiles = await getTSConfigFiles('.');
  const outDirs = tsconfigFiles
    .filter(file => Boolean(file.outDir))
    .map(file => file.outDir)
    .map(dir => `./${dir}`);

  const list = ['./.cache', './.uiharness', './.dev', ...outDirs];

  log.info.gray('Removing:\n');
  const remove = (path: string) => {
    log.info.gray(`   ${path}`);
    return fs.remove(fs.resolve(path));
  };
  await Promise.all(list.map(path => remove(path)));

  log.info();
  log.info(`🌳  All clean now.`);
  log.info();
}
