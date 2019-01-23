import { constants, log, logging, parcel, Settings } from '../common';
import { init } from './init';

const { PATH } = constants;

/**
 * Runs the JS bundler.
 */
export async function bundle(args: { settings: Settings; isProd?: boolean }) {
  const { settings, isProd } = args;
  if (isProd) {
    process.env.NODE_ENV = 'production';
  }

  // Ensure the module is initialized.
  await init({ settings });

  // Build JS bundles and run the electron-builder.
  await parcel.build(settings, { isProd });
  const outDir = logging.formatPath(PATH.BUNDLE_DIR, true);
  const mainEntry = logging.formatPath(PATH.MAIN.ENTRY, true);

  // Finish up.
  log.info();
  log.info(`🤟  Javascript bundling complete.\n`);
  log.info.gray(`   • version:     ${settings.package.version}`);
  log.info.gray(`   • prod:        ${isProd}`);
  log.info.gray(`   • main entry:  ${mainEntry}`);
  log.info.gray(`   • folder:      ${outDir}`);
  log.info();
}
