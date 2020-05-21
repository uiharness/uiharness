import { exec, fs, log, logNoConfig } from '../../common';
import { Settings } from '../../settings';
import { bundleWeb } from '../cmd.bundle';
import { stats as renderStats } from '../cmd.stats';

/**
 * Serve the web distribution.
 */
export async function serve(args: { settings: Settings; bundle?: boolean }) {
  const { settings } = args;
  const tmp = settings.path.tmp;
  const web = settings.web;

  if (!web.exists) {
    logNoConfig({ target: 'web' });
    return;
  }

  const prod = true;
  const out = settings.web.out(prod);
  const dir = fs.resolve(fs.join(tmp.dir, out.dir));
  const exists = await fs.pathExists(dir);

  // Ensure the distribution has been built.
  if (!exists || args.bundle === true) {
    await bundleWeb({ settings, prod, stats: false });
  } else {
    log.info(`👉   To build a fresh distribution bundle, run:`);
    log.info(`    ${log.cyan('yarn ui')} ${log.magenta('bundle web')}`);
    log.info();
  }

  renderStats({ settings, prod, target: 'web' });

  // Start the server.
  await exec.cmd.create().add(`cd ${dir}`).newLine().add(`serve`).run();
}
