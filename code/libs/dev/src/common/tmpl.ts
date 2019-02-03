import { fs, fsPath, template } from './libs';

/**
 * Utility helpers for working with NPM.
 */
export const npm = template.npm;

/**
 * Initializes a new template.
 */
export function create(source?: template.SourceTemplateArg) {
  return template.create(source);
}

/**
 * Performs template variable replacement.
 */
export function replace(args: { edge?: string }): template.TemplateMiddleware {
  return async (req, res) => {
    const { edge } = args;
    Object.keys(req.variables)
      .map(key => ({ key, value: req.variables[key] }))
      .forEach(({ key, value }) => {
        const pattern = new RegExp(`${edge}${key}${edge}`);
        res.replaceText(pattern, value);
      });
    res.next();
  };
}

/**
 * A template processor for copying files.
 */
export function copyFile(
  args: { force?: boolean; noForce?: string[] } = {},
): template.TemplateMiddleware {
  return async (req, res) => {
    const { force = false, noForce = [] } = args;
    const path = fsPath.resolve(`.${req.path.target}`);
    const dir = fsPath.dirname(path);
    const filename = fsPath.basename(path);
    const exists = await fs.pathExists(path);

    if (!exists || (force && !noForce.includes(filename))) {
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
    const path = fsPath.resolve(`.${req.path.target}`);
    await fs.remove(path);
    res.complete();
  };
}
