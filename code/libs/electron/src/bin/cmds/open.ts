import { log, fs, fsPath, Settings, exec, logging } from '../common';

/**
 * Opens a built application.
 */
export async function open(args: { settings: Settings; folder?: boolean }) {
  const { settings } = args;

  const formatPath = (path: string) => logging.formatPath(path, true);

  const logRunDist = () => {
    log.info(`\n👉  Run ${log.cyan('yarn dist')} to build it.\n`);
  };

  const runOpen = (path: string, type: 'app' | 'folder') => {
    log.info();
    log.info(`🖐  Opening ${type}: ${formatPath(path)}\n`);
    const cmd = `open "${path}"`;
    exec.run(cmd);
  };

  // console.log('settings.buildArgs', settings.buildArgs);
  const config = settings.builderArgs;
  if (!config) {
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

  // let path = outputDir

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
