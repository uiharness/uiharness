import { command, fs, fsPath } from '../common';
import { Settings } from '../settings';
import { bundleWeb } from './bundle';
import { stats as renderStats } from './stats';

/**
 * Serve the web distribution.
 */
export async function serve(args: { settings: Settings }) {
  const { settings } = args;
  const prod = true;
  const out = settings.web.out(prod);
  const dir = fsPath.resolve(out.dir);
  const exists = await fs.pathExists(dir);

  // Ensure the distribution has been built.
  if (!exists) {
    await bundleWeb({ settings, prod, stats: false });
  }

  renderStats({ settings, prod, target: 'web' });

  // Start the server.
  await command()
    .addLine(`cd ${dir}`)
    .add(`serve`)
    .run();
}
