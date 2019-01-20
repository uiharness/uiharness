import { fs, fsPath, IUIHarnessEntry, template } from './libs';

/**
 * Initializes a new template.
 */
export function create(source?: template.SourceTemplateArg) {
  return template.create(source);
}

/**
 * A template processor for copying files.
 */
export function copyFile(
  args: { force?: boolean } = {},
): template.TemplateMiddleware {
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
export function deleteFile(args: {} = {}): template.TemplateMiddleware {
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
}): template.TemplateMiddleware {
  return (req, res) => {
    args.entries.forEach(e => {
      res
        .replaceText(/__TITLE__/g, e.title)
        .replaceText(/__ENTRY_SCRIPT__/g, e.html.relative);
    });
    res.next();
  };
}
