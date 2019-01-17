import { config, fs, fsPath, log, tmpl } from '../common';

const TEMPLATE_DIR = './node_modules/@uiharness/web/tmpl';
const FILES = ['/tsconfig.json', '/tslint.json', '/uiharness.yml'];
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
    FILES.forEach(path =>
      tmpl.ensureTemplate({ tmplDir: TEMPLATE_DIR, path, force }),
    );
  }

  // Insert all the HTML entry points.
  if (flags.html) {
    console.log(
      '🐷🐷 TODO',
      'Perform this operation in a `beforeWrite` callback from `tmpl.ensureTemplate`',
    );

    const tmplPath = tmpl.toTemplatePath(TEMPLATE_DIR, 'html/index.html');
    const text = fs.readFileSync(tmplPath, 'utf-8');
    settings.entries
      .filter(e => force || !fs.pathExistsSync(e.html.absolute))
      .forEach(e => {
        const path = e.html.absolute;
        const html = text
          .replace(/__TITLE__/, e.title)
          .replace(/__ENTRY_SCRIPT__/, e.html.relative);
        fs.ensureDirSync(fsPath.dirname(path));
        fs.writeFileSync(path, html);
      });
  }
}

/**
 * Removes configuration files.
 */
async function reset(args: { pkg: config.Package }) {
  const { pkg } = args;
  pkg.removeScripts({ scripts: SCRIPTS });
  FILES
    // Delete copied template files.
    .map(file => tmpl.toRootPath(file))
    .forEach(file => fs.removeSync(file));

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
