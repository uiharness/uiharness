import { fs, fsPath } from '../common';

/**
 * Removes temporary generated files.
 */
export async function clean(args: {}) {
  await fs.remove(fsPath.resolve('./.uiharness'));

  // TEMP 🐷
  await fs.remove(fsPath.resolve('./src/main/.parcel'));
  await fs.remove(fsPath.resolve('./src/renderer/.parcel'));
}
