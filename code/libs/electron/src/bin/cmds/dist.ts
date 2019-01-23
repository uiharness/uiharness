import {
  constants,
  electron,
  formatDisplayPath,
  fs,
  fsPath,
  IElectronBuilderConfig,
  jsYaml,
  log,
  logInfo,
  parcel,
  Settings,
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

  const config = (await getBuildConfig()) || {};
  const path =
    config && config.directories && config.directories.output
      ? formatDisplayPath(config.directories.output, ROOT_DIR)
      : 'UNKNOWN';

  // Finish up.
  log.info();
  log.info(`🤟  Application packaging complete.\n`);
  log.info.gray(`   - productName: ${log.magenta(config.productName)}`);
  log.info.gray(`   - version:     ${settings.package.version}`);
  log.info.gray(`   - appId:       ${config.appId}`);
  log.info.gray(`   - path:        ${path}`);
  log.info();
  process.exit(0);
}

/**
 * INTERNAL
 */

export async function getBuildConfig() {
  const path = fsPath.resolve('./electron-builder.yml');
  if (!(await fs.pathExists(path))) {
    return;
  }
  const text = await fs.readFile(path, 'utf8');
  return jsYaml.safeLoad(text) as IElectronBuilderConfig;
}
