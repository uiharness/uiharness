import { constants, log, logging, parcel, Settings } from '../common';
import { init } from './init';
import { stats } from './stats';

/**
 * Runs the JS bundler.
 */
export async function bundle(args: { settings: Settings; isProd?: boolean }) {
  const { settings, isProd } = args;
  if (isProd) {
    process.env.NODE_ENV = 'production';
  }

  const { PATH } = constants;
  const { MAIN, RENDERER } = PATH;

  // Ensure the module is initialized.
  await init({ settings });

  // Build JS bundles and run the electron-builder.
  await parcel.build(settings, { isProd });

  // Log results.
  const formatPath = (path: string) => logging.formatPath(path, true);
  const rendererDir = isProd ? RENDERER.OUT_DIR.PROD : RENDERER.OUT_DIR.DEV;

  log.info();
  log.info(`🤟  Javascript bundling complete.\n`);
  log.info.gray(`   • version:     ${settings.package.version}`);
  log.info.gray(`   • prod:        ${isProd}`);
  log.info.gray(`   • main entry:  ${formatPath(MAIN.ENTRY)}`);
  log.info.gray(`   • output:      ${formatPath(MAIN.OUT_DIR)}`);
  log.info.gray(`                  ${formatPath(rendererDir)}`);

  log.info();
  await stats({ settings, isProd, moduleInfo: false });

  // Finish up.
  log.info();
  process.exit(0);
}
