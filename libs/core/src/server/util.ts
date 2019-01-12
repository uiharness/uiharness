import { shell } from './libs';

/**
 * Executes the given shell command (with color).
 */
export function exec(command: string) {
  return shell.exec(`${command} --color always`);
}
