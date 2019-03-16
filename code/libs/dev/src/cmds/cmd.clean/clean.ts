import { fs, log, t } from '../../common';

/**
 * Removes temporary generated files.
 */
export async function clean(args: {}) {
  const tsconfigFiles = await getTSConfigFiles();
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

/**
 * [Internal]
 */

async function getTSConfigFiles() {
  const dir = fs.resolve('.');
  const paths = (await fs.readdir(dir))
    .filter(name => name.endsWith('.json'))
    .filter(name => name.includes('tsconfig'))
    .map(name => fs.join(dir, name));
  return Promise.all(
    paths.map(async path => {
      const json = await fs.file.loadAndParse<t.ITSConfig>(path);
      const include = json.include || [];
      const compilerOptions = json.compilerOptions || {};
      const outDir = compilerOptions.outDir || '';
      return { path, dir, outDir, json: { include, compilerOptions } };
    }),
  );
}
