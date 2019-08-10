import { tmpl, fs, t, str } from '../common';

/**
 * Ensures that all entry-points exist, and copies them if necessary.
 */
export async function ensureEntries(args: {
  name: string;
  codePath: string;
  templatesDir: string;
  pattern: string;
  targetDir: string;
  htmlFile?: string;
  stylesheets?: string[];
}) {
  const { codePath, pattern, stylesheets = [] } = args;

  const ensureRendererHtml = async () => {
    // Prepare paths.
    const targetDir = `/${args.targetDir.replace(/^\//, '')}`;
    const hops = targetDir
      .replace(/^\//, '')
      .split('/')
      .map(() => '..')
      .join('/');

    // Create template.
    const template = tmpl
      .create()
      .add({
        dir: fs.resolve(args.templatesDir),
        pattern,
        targetDir,
      })
      .use(tmpl.replace({ edge: '__' }))
      .use(tmpl.copyFile({ force: true, filename: args.htmlFile }));

    const toStylesheet = (path: string) => `<link rel="stylesheet" type="text/css" href="${path}">`;
    const STYLESHEETS = stylesheets
      .map((path, i) => `${i > 0 ? '    ' : ''}${toStylesheet(path)}`)
      .join('\n');

    // Execute template.
    const variables = {
      NAME: args.name,
      PATH: fs.join(hops, codePath),
      STYLESHEETS,
    };

    await template.execute({ variables });
  };

  // Prepare.
  await ensureRendererHtml();
}

/**
 * Converts a YAML entry value (string / object) into a standard set of
 * entry definitions.
 */
export function parseEntry(args: {
  value?: t.IEntryConfig;
  version: string;
  default: { title: string; codePath: string };
  paths: t.ISettingsPaths;
  htmlFilePrefix: string;
}): t.IEntryDefs {
  const { value, version, htmlFilePrefix } = args;
  const defaultTitle = args.default.title;
  const DEFAULT_KEY = 'default';

  const toHtml = (code: string) => {
    const parent = args.paths;
    let path = code.replace(/^\./, '').replace(/^\//, '');
    path = path.substr(0, path.lastIndexOf('.'));
    path = path.replace(/\//g, '.');
    return fs.join(parent.tmp.html, `${htmlFilePrefix}.${path}.html`);
  };

  const formatText = (text: string) => {
    return str.tmpl.replace(text, { version });
  };

  const toRendererEntry = (key: string, title: string, path: string): t.IEntryDef => {
    title = formatText(title);
    return { key, title, path, html: toHtml(path) };
  };

  if (value === undefined) {
    const code = args.default.codePath;
    return { default: toRendererEntry(DEFAULT_KEY, defaultTitle, code) };
  }
  if (typeof value === 'string') {
    return { default: toRendererEntry(DEFAULT_KEY, defaultTitle, value) };
  }
  return Object.keys(value).reduce((acc, key) => {
    const item = value[key];
    if (item) {
      const code = typeof item === 'string' ? item : item.path;
      const title = typeof item === 'object' ? item.title || defaultTitle : defaultTitle;
      acc = { ...acc, [key]: toRendererEntry(key, title, code) };
    }
    return acc;
  }, {});
}
