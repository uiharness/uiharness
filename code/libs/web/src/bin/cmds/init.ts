import { constants, log, Settings, tmpl } from '../common';
import { clean } from './clean';

const { SCRIPTS, PATH } = constants;

/**
 * Ensure the module is initialized.
 */
export async function init(args: {
  settings: Settings;
  force?: boolean;
  reset?: boolean;
}) {
  const { settings, force = false } = args;
  const flags = settings.init;

  if (args.reset === true) {
    // Reset instead of initialize.
    return reset({ settings });
  }

  if (flags.scripts) {
    await settings.package.addFields('scripts', SCRIPTS).save();
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
async function reset(args: { settings: Settings }) {
  const { settings } = args;
  await settings.package
    .removeFields('scripts', SCRIPTS, { exclude: 'postinstall' })
    .save();

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
