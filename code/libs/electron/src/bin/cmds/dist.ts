import {
  constants,
  electron,
  fsPath,
  log,
  logInfo,
  parcel,
  Settings,
  formatDisplayPath,
} from '../common';
import { init } from './init';

const { PATH } = constants;

/**
 * Bundles the application ready for distribution.
 */
export async function dist(args: { settings: Settings }) {
  const { settings } = args;
  const ROOT_DIR = fsPath.resolve('.');
  process.env.NODE_ENV = 'production';

  // Ensure the module is initialized.
  await init({ settings });
  logInfo({ settings, port: false, mainEntry: PATH.MAIN.ENTRY });

  // Build JS bundles and run the electron-builder.
  await parcel.build(settings, { isProd: true });
  log.info();
  await electron.build();

  // Log output
  const config = settings.builderArgs;
  const path =
    config && config.outputDir
      ? formatDisplayPath(config.outputDir, ROOT_DIR)
      : 'UNKNOWN';

  log.info();
  log.info(`🤟  Application packaging complete.\n`);
  log.info.gray(`   • productName: ${log.yellow(config.productName)}`);
  log.info.gray(`   • version:     ${settings.package.version}`);
  log.info.gray(`   • appId:       ${config.appId}`);
  log.info.gray(`   • folder:      ${path}`);
  log.info();
  log.info(`👉  Run ${log.cyan('yarn open')} to run it.`);
  log.info();

  // Finish up.
  process.exit(0);
}
