import { constants, log, NpmPackage, Settings, tmpl } from '../common';
import { clean } from './clean';

const { SCRIPTS, PATH } = constants;

/**
 * Ensure the module is initialized.
 */
export async function init(args: {
  settings: Settings;
  pkg: NpmPackage;
  force?: boolean;
  reset?: boolean;
}) {
  const { settings, pkg, force = false } = args;
  const flags = settings.init;

  if (args.reset === true) {
    // Reset instead of initialize.
    return reset({ pkg });
  }

  if (flags.scripts) {
    pkg.addFields('scripts', SCRIPTS).save();
  }

  if (flags.files) {
    await tmpl
      .create(PATH.TEMPLATES)
      .use(tmpl.copyFile({ force }))
      .execute();
  }
}

/**
 * Removes configuration files.
 */
async function reset(args: { pkg: NpmPackage }) {
  const { pkg } = args;
  pkg.removeFields('scripts', SCRIPTS, { exclude: 'postinstall' }).save();

  await tmpl
    .create(PATH.TEMPLATES)
    .use(tmpl.deleteFile())
    .execute();

  await clean({});

  // Log results.
  log.info('');
  log.info(
    '👋   The auto-generated files and scripts from `@uiharness/web` have been removed.',
  );
  log.info(`    Run \`${log.cyan('uiharness init')}\` to recreate them.`);
  log.info('');
}
