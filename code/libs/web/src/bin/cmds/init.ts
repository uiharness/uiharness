import { config, fs, fsPath, log, tmpl } from '../common';

const TEMPLATE_DIR = './node_modules/@uiharness/web/tmpl';
const SCRIPTS = {
  postinstall: 'uiharness init',
  start: 'uiharness start',
  bundle: 'uiharness bundle',
  stats: 'uiharness stats',
  serve: 'serve -s dist',
};

/**
 * Ensure the module is initialized.
 */
export async function init(args: {
  settings: config.Settings;
  pkg: config.Package;
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
    pkg.addScripts({ scripts: SCRIPTS });
  }

  if (flags.files) {
    const entries = settings.entries;
    await tmpl
      .create(TEMPLATE_DIR)
      .process(tmpl.transformEntryHtml({ entries }))
      .process(tmpl.copyFile({ force }))
      .execute();
  }
}

/**
 * Removes configuration files.
 */
async function reset(args: { pkg: config.Package }) {
  const { pkg } = args;
  pkg.removeScripts({ scripts: SCRIPTS });

  await tmpl
    .create(TEMPLATE_DIR)
    .process(tmpl.deleteFile())
    .execute();

  fs.removeSync(fsPath.resolve('./html'));
  fs.removeSync(fsPath.resolve('./.cache'));
  fs.removeSync(fsPath.resolve('./dist'));

  // Log results.
  log.info('');
  log.info(
    '👋   The auto-generated files and scripts from `@uiharness/web` have been removed.',
  );
  log.info(`    Run \`${log.cyan('uiharness init')}\` to recreate them.`);
  log.info('');
}
