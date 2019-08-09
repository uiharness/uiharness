import { fs } from './libs';
import { Settings } from '../settings';

/**
 * Copies static assets to the web bundle.
 */
export async function copyWeb(args: { settings: Settings; prod: boolean }) {
  const { settings, prod } = args;
  const web = settings.web;
  if (web.static.paths.length === 0) {
    return [];
  }

  // Prepare paths.
  const paths = web.getPaths();
  const sourcePaths = web.static.paths.map(path => fs.join(fs.resolve('static'), path));
  const base = settings.getPaths().tmp.dir;
  const targetDir = fs.join(base, prod ? paths.out.dir.prod : paths.out.dir.dev);

  // Copy files.
  const copying = sourcePaths.map(async source => {
    const target = fs.join(targetDir, fs.basename(source));
    if (await fs.pathExists(source)) {
      await fs.copy(source, target);
    }
  });

  // Finish up.
  await Promise.all(copying);
  return sourcePaths;
}
