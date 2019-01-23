import { log, fs, fsPath, Settings, exec, formatDisplayPath } from '../common';

/**
 * Opens a built application.
 */
export async function open(args: { settings: Settings }) {
  const { settings } = args;
  const ROOT = fsPath.resolve('.');

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
  let path = fsPath.join(outputDir, platform, `${productName}.app`);
  path = `./${path.replace(/^\\/, '')}`;
  path = fsPath.resolve(path);
  const displayPath = formatDisplayPath(path, ROOT);

  // Ensure the app has been built.
  if (!(await fs.pathExists(path))) {
    log.info();
    log.warn(`😩  An app named ${log.magenta(productName)} does not exist.`);
    log.info(`   ${displayPath}`);
    log.info();
    log.info(`👉  Run ${log.cyan('yarn dist')} to build it.`);
    log.info();
    return;
  }

  log.info();
  log.info(`🖐  Opening`);
  log.info(`   ${displayPath}\n`);

  // Run the command.
  const cmd = `open "${path}"`;
  exec.run(cmd);
}
