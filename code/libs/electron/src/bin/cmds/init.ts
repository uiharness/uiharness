import { config, fs, fsPath, log, tmpl } from '../common';

const TEMPLATE_DIR = './node_modules/@uiharness/electron/tmpl';
const SCRIPTS = {
  postinstall: 'uiharness-electron init',
  start: 'uiharness-electron start',
  bundle: 'uiharness-electron bundle',
};

/**
 * Initialize the module.
 */
export async function init(args: {
  settings: config.Settings;
  pkg: config.Package;
  force?: boolean;
  reset?: boolean;
}) {
  const { settings, pkg, force = false } = args;
  if (args.reset) {
    return reset({ pkg });
  }
  const flags = settings.init;

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

  fs.removeSync(fsPath.resolve('./.cache'));
  fs.removeSync(fsPath.resolve('./dist'));
  fs.removeSync(fsPath.resolve('./.uiharness'));

  // Log results.
  log.info('');
  log.info(
    '👋   The auto-generated files and scripts from `@uiharness/electron` have been removed.',
  );
  log.info(
    `    Run \`${log.cyan('uiharness-electron init')}\` to recreate them.`,
  );
  log.info('');
}
