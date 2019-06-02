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
}) {
  const { codePath, pattern } = args;

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

    // Execute template.
    const variables = {
      NAME: args.name,
      PATH: fs.join(hops, codePath),
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
}): { [key: string]: t.IEntryConfigDef } {
  const { value, version, htmlFilePrefix } = args;
  const defaultTitle = args.default.title;

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

  const toRendererEntry = (title: string, path: string): t.IEntryConfigDef => {
    title = formatText(title);
    return { title, path, html: toHtml(path) };
  };

  if (value === undefined) {
    const code = args.default.codePath;
    return { default: toRendererEntry(defaultTitle, code) };
  }
  if (typeof value === 'string') {
    return { default: toRendererEntry(defaultTitle, value) };
  }
  return Object.keys(value).reduce((acc, next) => {
    const item = value[next];
    if (item) {
      const code = typeof item === 'string' ? item : item.path;
      const title = typeof item === 'object' ? item.title || defaultTitle : defaultTitle;
      acc = { ...acc, [next]: toRendererEntry(title, code) };
    }
    return acc;
  }, {});
}
