import * as os from 'os';

import { exec, fs, log, logging, main } from '../../common';
import { Settings } from '../../settings';

/**
 * Opens a built application.
 */
export async function open(args: { settings: Settings; folder?: boolean; silent?: boolean }) {
  const { settings, silent } = args;
  const tmp = settings.path.tmp;

  const formatPath = (path: string) => logging.formatPath(path, true);

  const logRunDist = () => {
    log.info(`\n👉  Run ${log.cyan('yarn ui dist')} to build it.\n`);
  };

  const tailCommand = (dir: string, file: string) => {
    let msg = log.white('tail -f');
    msg = `${msg} ${dir}/${log.cyan(file)}`;
    return log.gray(msg);
  };

  const runOpen = (path: string, type: 'app' | 'folder') => {
    const appName = settings.name;
    const paths = main.paths({ appName, env: 'production' });

    if (!silent) {
      const logCmd = tailCommand(paths.log.dir, paths.log.prod.filename);
      const action = type === 'app' ? 'Open  ' : 'Folder';
      log.info();
      log.info(`🖐  ${action}  ${formatPath(path)}`);
      log.info.gray(`   logs:   ${logCmd}`);
      log.info();
    }

    return exec.cmd
      .create()
      .add(`open "${path}"`)
      .run();
  };

  const config = settings.electron.builderArgs;
  if (!config.exists) {
    const filename = log.cyan('uiharness.builder.yml');
    log.warn(`😩  A ${filename} file does not exist in the project.`);
    return;
  }

  const getPlatformDir = () => {
    const platform = os.platform();
    switch (platform) {
      case 'darwin':
        return 'mac';
      case 'win32':
        return 'win';
      case 'linux':
        return 'linux';
      default:
        throw new Error(`Platorm '${platform}' not supported. Must be Mac/OSX, Windows or Linux.`);
    }
  };

  // Derive the path to the app.
  const platform = getPlatformDir();
  const { productName = 'UNKNOWN' } = config;
  const outputDir = fs.join(tmp.dir, config.outputDir || '');

  if (!silent && !(await fs.pathExists(outputDir))) {
    log.info();
    log.warn(`😩  The app distribution has not been built yet.`);
    log.info(`   ${formatPath(outputDir)}`);
    logRunDist();
    return;
  }
  if (args.folder) {
    return runOpen(outputDir, 'folder');
  }

  let path = fs.join(outputDir, platform, `${productName}.app`);
  path = `./${path.replace(/^\\/, '')}`;
  path = fs.resolve(path);

  // Ensure the app has been built.
  if (!silent && !(await fs.pathExists(path))) {
    log.info();
    log.warn(`😩  An app named ${log.magenta(productName)} does not exist.`);
    log.info(`   ${formatPath(path)}`);
    logRunDist();
    return;
  }

  return runOpen(path, 'app');
}
