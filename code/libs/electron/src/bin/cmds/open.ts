import { log, fs, fsPath, Settings, exec } from '../common';

/**
 * Opens a built application.
 */
export async function open(args: { settings: Settings }) {
  const { settings } = args;

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

  // Ensure the app has been built.
  if (!(await fs.pathExists(path))) {
    log.info();
    log.warn(
      `😩  An app named '${productName}' for [${platform}] does not exist.`,
    );
    log.info(`   Run ${log.cyan('yarn dist')} to build it.`);
    log.info();
    return;
  }

  // Run the command.
  const cmd = `open "${path}"`;
  exec.run(cmd);
}
