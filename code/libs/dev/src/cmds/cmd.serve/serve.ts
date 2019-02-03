import { command, fs, fsPath, log, logNoConfig } from '../../common';
import { Settings } from '../../settings';
import { bundleWeb } from '../cmd.bundle';
import { stats as renderStats } from '../cmd.stats';

/**
 * Serve the web distribution.
 */
export async function serve(args: { settings: Settings }) {
  const { settings } = args;
  const web = settings.web;

  if (!web.exists) {
    logNoConfig({ target: 'web' });
    return;
  }

  const prod = true;
  const out = settings.web.out(prod);
  const dir = fsPath.resolve(out.dir);
  const exists = await fs.pathExists(dir);

  // Ensure the distribution has been built.
  if (!exists) {
    await bundleWeb({ settings, prod, stats: false });
  } else {
    log.info(`👉   To build a fresh distribution bundle, run:`);
    log.info(`    ${log.cyan('yarn ui')} ${log.magenta('bundle web')}`);
    log.info();
  }

  renderStats({ settings, prod, target: 'web' });

  // Start the server.
  await command()
    .addLine(`cd ${dir}`)
    .add(`serve`)
    .run();
}
