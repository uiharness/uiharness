import { BundleTarget } from '../types';

export const BUNDLE_TARGETS: BundleTarget[] = ['electron', 'web'];

/**
 * Converts a value to a known bundle target.
 */
export function toBundleTarget(value: unknown) {
  const includes = (value: BundleTarget) => BUNDLE_TARGETS.includes(value);

  let target = (typeof value === 'string'
    ? value.toLowerCase()
    : 'electron') as BundleTarget;

  if (!includes(target)) {
    const partial = BUNDLE_TARGETS.find(name => name.startsWith(target));
    if (partial) {
      target = partial;
    }
  }

  return includes(target) ? target : undefined;
}
