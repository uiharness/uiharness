import { value } from '../common';
import { IParcelBuildConfig } from '../../types';
const defaultValue = value.defaultValue;

/**
 * Extract JS bundler args (Parcel-JS) or deaults.
 */
export function toBundlerArgs(data: IParcelBuildConfig = {}) {
  // Default values.
  const sourcemaps = defaultValue(data.sourcemaps, true);
  const treeshake = defaultValue(data.treeshake, false);

  // Build command-line arguments.
  // See:
  //    https://parceljs.org/cli.html
  let cmd = '';
  cmd = sourcemaps === false ? `${cmd} --no-source-maps` : cmd;
  cmd = treeshake ? `${cmd} --experimental-scope-hoisting` : cmd;

  // Finish up.
  return { sourcemaps, treeshake, cmd };
}
