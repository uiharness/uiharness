import { command, fs, fsPath, log, logging } from '../../common';
import { Settings } from '../../settings';

/**
 * Opens a built application.
 */
export async function open(args: { settings: Settings; folder?: boolean }) {
  const { settings } = args;

  const formatPath = (path: string) => logging.formatPath(path, true);

  const logRunDist = () => {
    log.info(`\n👉  Run ${log.cyan('yarn ui dist')} to build it.\n`);
  };

  const runOpen = (path: string, type: 'app' | 'folder') => {
    log.info();
    log.info(`🖐  Open ${formatPath(path)}\n`);
    return command()
      .add(`open "${path}"`)
      .run();
  };

  const config = settings.electron.builderArgs;
  if (!config.exists) {
    log.warn(
      `😩  An 'electron-builder.yml' file does not exist in the project.`,
    );
    return;
  }

  // Derive the path to the app.
  const platform = 'mac'; // TODO 🐷 - make this platform aware.
  const { outputDir = '', productName = 'UNKNOWN' } = config;

  if (!(await fs.pathExists(outputDir))) {
    log.info();
    log.warn(`😩  The app distribution has not been built yet.`);
    log.info(`   ${formatPath(outputDir)}`);
    logRunDist();
    return;
  }
  if (args.folder) {
    return runOpen(outputDir, 'folder');
  }

  let path = fsPath.join(outputDir, platform, `${productName}.app`);
  path = `./${path.replace(/^\\/, '')}`;
  path = fsPath.resolve(path);

  // Ensure the app has been built.
  if (!(await fs.pathExists(path))) {
    log.info();
    log.warn(`😩  An app named ${log.magenta(productName)} does not exist.`);
    log.info(`   ${formatPath(path)}`);
    logRunDist();
    return;
  }

  return runOpen(path, 'app');
}
