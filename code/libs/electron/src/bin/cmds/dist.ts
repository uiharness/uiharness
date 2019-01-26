import { fsPath, Listr, log, logging, logInfo, command } from '../common';
import { Settings } from '../settings';
import { bundleElectron } from './bundle';
import { init } from './init';

/**
 * Bundles the application ready for distribution.
 */
export async function dist(args: { settings: Settings; silent?: boolean }) {
  const { settings, silent = false } = args;
  const prod = true;
  const electron = settings.electron;
  const out = electron.out(prod);
  process.env.NODE_ENV = 'production';

  const handleError = (error: Error, step: string) => {
    if (silent) {
      throw error;
    } else {
      log.info();
      log.warn(`😩  Failed while ${step}.`);
      log.error(error.message);
      log.info();
      return;
    }
  };

  // Ensure the module is initialized.
  await init({ settings, prod });
  if (!silent) {
    log.info();
    logInfo({ settings, port: false });
  }

  // Build JS bundles and run the electron-builder.
  try {
    await bundleElectron({ settings, silent, prod: true, summary: false });
  } catch (error) {
    handleError(error, 'building javascript for electron distribution');
    return;
  }

  const cmd = command()
    .addLine(`cd ${fsPath.resolve('.')}`)
    .add(`build`)
    .arg(`--x64`)
    .arg(`--publish=never`)
    .alias(`-c.extraMetadata.main="${out.main.path}"`);

  // Run the electron `build` command.
  const tasks = new Listr([
    {
      title: `Building      ${log.yellow('electron app')} 🌼`,
      task: () => cmd.run({ silent: true }),
    },
  ]);
  try {
    await tasks.run();
  } catch (error) {
    handleError(error, 'building electron distribution');
    return;
  }

  // Log output
  const config = settings.electron.builderArgs;
  const path = config.outputDir
    ? logging.formatPath(config.outputDir, true)
    : 'UNKNOWN';

  if (!silent) {
    log.info();
    log.info(`🤟  Application packaging complete.\n`);
    log.info.gray(`   • productName: ${log.yellow(config.productName)}`);
    log.info.gray(`   • version:     ${settings.package.version}`);
    log.info.gray(`   • appId:       ${config.appId}`);
    log.info.gray(`   • folder:      ${path}`);
    log.info();
    log.info(`👉  Run ${log.cyan('yarn open')} to run it.`);
    log.info();
  }
}
