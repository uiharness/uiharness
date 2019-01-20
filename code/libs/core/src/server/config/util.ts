import { fsPath, fs } from '../common';
import { IUIHarnessConfigEntry, IUIHarnessEntry } from '../../types';

export type EntryArg =
  | undefined
  | string
  | string[]
  | IUIHarnessConfigEntry
  | IUIHarnessConfigEntry[];

/**
 * Formats an `entry` value in a YAML config.
 */
export function toEntries(args: {
  entry: EntryArg;
  defaultValue: string;
  dir: string;
  moduleName?: string;
}) {
  const value = args.entry || args.defaultValue;
  // const value =
  //   this._data && this._data.entry ? this._data.entry : '/src/uiharness.tsx';
  const paths = Array.isArray(value) ? value : [value];
  return paths
    .map(e => (typeof e === 'object' ? e : { path: e }) as IUIHarnessEntry)
    .map(e => ({ ...e, path: resolvePath(e.path) }))
    .map(e => ({ ...e, html: asHtmlPath(e.path, args.dir) }))
    .map(e => ({ ...e, exists: fs.existsSync(e.path) }))
    .map(e => ({ ...e, title: e.title || args.moduleName || 'Unnamed' }));
}

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
