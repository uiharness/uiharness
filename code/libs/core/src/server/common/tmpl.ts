import { fs, fsPath } from './libs';

/**
 * Copies a template.
 */
export function ensureTemplate(args: {
  tmplDir: string;
  path: string;
  force?: boolean;
}) {
  const { tmplDir, path, force } = args;
  const to = toRootPath(path);
  if (force || !fs.existsSync(to)) {
    const from = toTemplatePath(tmplDir, path);
    fs.copySync(from, to);
  }
}

/**
 * Formats a path from the root of the host module.
 */
export function toRootPath(path: string) {
  path = path.replace(/^\//, '');
  return fsPath.resolve(`./${path}`);
}

/**
 * Formats a path to within the template dir.
 */
export function toTemplatePath(tmplDir: string, path: string) {
  tmplDir = tmplDir.trim().replace(/\/$/, '');
  return fsPath.resolve(`${tmplDir}/${path}`);
}
