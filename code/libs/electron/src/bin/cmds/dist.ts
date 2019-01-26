import { exec, fsPath, Listr, log, logging, logInfo } from '../common';
import { Settings } from '../settings';
import { bundle } from './bundle';
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
    await bundle({ settings, silent, prod: true, noSummary: true });
  } catch (error) {
    handleError(error, 'building javascript for electron distribution');
    return;
  }

  // Run the electron `build` command.
  const tasks = new Listr([
    {
      title: `Building      ${log.yellow('electron app')} 🌼`,
      task: () => {
        let args = '';
        args += ` --x64`;
        args += ` --publish=never`;
        args += ` -c.extraMetadata.main="${out.main.path}"`;
        const cmd = `
          cd ${fsPath.resolve('.')}
          build ${args}
        `;
        return exec.run(cmd, { silent: true });
      },
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
