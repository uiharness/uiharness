import { fs, TemplateMiddleware, Template } from './libs';

/**
 * Initializes a new template.
 */
export const create = Template.create;

/**
 * Performs template variable replacement.
 */
export function replace(args: { edge?: string }): TemplateMiddleware {
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
  args: {
    force?: boolean;
    filename?: string;
    noForce?: string[];
    filter?: (path: string) => boolean;
  } = {},
): TemplateMiddleware {
  const filter = (path: string) => (args.filter ? args.filter(path) : true);

  return async (req, res) => {
    const { force = false, noForce = [] } = args;
    const requestedPath = fs.resolve(`.${req.path.target}`);
    const dir = fs.dirname(requestedPath);
    const filename = args.filename || fs.basename(requestedPath);
    const path = fs.join(dir, filename);
    const exists = await fs.pathExists(path);

    if (!exists || (force && !noForce.includes(filename))) {
      if (filter(path)) {
        await fs.ensureDir(dir);
        await fs.writeFile(path, req.buffer);
      }
    }

    res.complete();
  };
}

/**
 * A template processor for deleting files.
 */
export function deleteFile(args: {} = {}): TemplateMiddleware {
  return async (req, res) => {
    const path = fs.resolve(`.${req.path.target}`);
    await fs.remove(path);
    res.complete();
  };
}
