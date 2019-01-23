import { fsPath } from '../common';

export function resolvePath(path?: string) {
  return fsPath.resolve(`./${cleanPath(path)}`);
}

function cleanPath(path?: string) {
  return path
    ? path
        .trim()
        .replace(/^\./, '')
        .replace(/^\//, '')
        .replace(/^\'/, '')
        .replace(/^\"/, '')
        .replace(/\'$/, '')
        .replace(/\"$/, '')
    : path;
}

export function asHtmlPath(path: string, root: string) {
  path = path
    .trim()
    .substr(root.length)
    .replace(/^\//, '')
    .replace(/^src\//, '');
  const absolute = fsPath.join('html', fsPath.dirname(path), 'index.html');

  const depth = path.split('/').length + 1;
  const up = Array.from({ length: depth }).join('../');
  const relative = fsPath.join(up, 'src', path);

  return { absolute: resolvePath(absolute), relative };
}
