import { fs, fsPath, IUIHarnessEntry, template } from './libs';

export const create = template.create;

/**
 * A template processor for copying files.
 */
export function copyFile(
  args: { force?: boolean } = {},
): template.TemplateProcessor {
  const { force = false } = args;
  return async (req, res) => {
    const path = fsPath.resolve(`.${req.path}`);
    const dir = fsPath.dirname(path);
    if (force || !(await fs.pathExists(path))) {
      await fs.ensureDir(dir);
      await fs.writeFile(path, req.buffer);
    }
    res.complete();
  };
}

/**
 * A template processor for deleting files.
 */
export function deleteFile(args: {} = {}): template.TemplateProcessor {
  return async (req, res) => {
    const path = fsPath.resolve(`.${req.path}`);
    await fs.remove(path);
    res.complete();
  };
}

/**
 * Transforms the entry `index.html` file with data from the YAML configuration.
 */
export function transformEntryHtml(args: {
  entries: IUIHarnessEntry[];
}): template.TemplateProcessor {
  return (req, res) => {
    if (req.path.endsWith('.html')) {
      args.entries.forEach(e => {
        res
          .replaceText(/__TITLE__/g, e.title)
          .replaceText(/__ENTRY_SCRIPT__/g, e.html.relative);
      });
    }
    res.next();
  };
}
