import { BundleTarget, Environment } from '../types';
import { log } from '../common';

export const BUNDLE_TARGETS: BundleTarget[] = ['electron', 'web'];
export const ENVIRONMENTS: Environment[] = ['production', 'development'];

/**
 * Formats an argument and logs if the given value is not supportd.
 */
export function wrangleAndLog<T extends string>(
  title: string,
  value: unknown,
  defaultValue: T,
  supported: T[],
): T | undefined {
  const res = wrangle<T>(value, defaultValue, supported);
  if (res) {
    return res;
  }

  const list = supported
    .map((item, i) => {
      const isLast = i === supported.length - 1;
      const prefix = isLast ? 'or ' : '';
      return `${prefix}"${log.cyan(item)}"`;
    })
    .join(' ')
    .trim();

  let be = '';
  switch (supported.length) {
    case 1:
      be = 'be';
      break;
    case 2:
      be = 'be either';
      break;
    default:
      be = 'be one of';
      break;
  }

  let msg = '';
  msg += `😫  The ${log.cyan(title)} "${log.yellow(value)}" `;
  msg += `is not supported. `;
  msg += `Must ${be} ${list}.`;
  log.info(msg);
  log.info();

  return undefined;
}

/**
 * Wrangles an incoming arbument into a supported type.
 */
export function wrangle<T extends string>(value: unknown, defaultValue: T, supported: T[]) {
  const includes = (value: T) => supported.includes(value);

  let target = (typeof value === 'string' ? value.toLowerCase() : defaultValue) as T;

  if (!includes(target)) {
    const partial = supported.find(name => name.startsWith(target));
    if (partial) {
      target = partial;
    }
  }

  return includes(target) ? target : undefined;
}
