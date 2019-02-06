import { fs } from '@platform/fs';

export type IRemoveSourceMapsResponse = {
  total: number;
  changed: Array<{ path: string }>;
};

/**
 * Strips source maps references from JS files within the given path.
 * NOTE:
 *    This is useful when referenced modules has published JS files
 *    with references to source-maps but not actually published
 *    the `.map.js` files.
 *
 *    Removing the references from the files will prevent annoying warnings
 *    in the console when Parcel bundles.
 *
 * Example:
 *
 *    await utils.removeSourceMapRefs('node_modules/rxjs');
 *
 */
export async function removeSourceMapRefs(...dirs: string[]) {
  const result: IRemoveSourceMapsResponse = { total: 0, changed: [] };
  const remove = async (dir: string) => {
    const paths = await fs.glob.find(fs.join(dir, '**/*.js'));
    for (const path of paths) {
      const wasRemoved = await removeSourceMapRef(path);
      if (wasRemoved) {
        result.changed = [...result.changed, { path }];
      }
    }
  };
  await Promise.all(dirs.map(dir => remove(dir)));
  return { ...result, total: result.changed.length };
}

/**
 * Removes the source-map ref from theh given file.
 */
export async function removeSourceMapRef(file: string) {
  try {
    const text = await fs.readFile(file, 'utf8');
    const lines = text.split('\n');
    let isChanged = false;

    lines.forEach((line, i) => {
      if (isSourceMapRef(line)) {
        lines[i] = '\n';
        isChanged = true;
      }
    });

    if (isChanged) {
      await fs.writeFile(file, lines.join('\n'));
    }

    return isChanged;
  } catch (error) {
    // Ignore.
    return false;
  }
}

/**
 * INTERNAL
 */
function isSourceMapRef(line: string) {
  return line.includes('//# sourceMappingURL=');
}

/**
 * TEMP
 */
removeSourceMapRefs('node_modules/monaco-editor/esm');
removeSourceMapRefs('node_modules/rxjs');
