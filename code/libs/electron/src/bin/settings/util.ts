import { value } from '../common';
import { IParcelBuildConfig } from '../../types';
const defaultValue = value.defaultValue;

/**
 * Extract JS bundler args (Parcel-JS) or deaults.
 */
export function toBundlerArgs(data: IParcelBuildConfig = {}) {
  const sourcemaps = defaultValue(data.sourcemaps, true);
  const treeshake = defaultValue(data.treeshake, false);
  return { sourcemaps, treeshake };
}
