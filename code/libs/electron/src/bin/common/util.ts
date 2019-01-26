import { log, logging } from './libs';
import { Settings } from '../settings';

/**
 * Logs common information about the module.
 */
export function logInfo(args: { settings: Settings; port?: boolean | number }) {
  const { settings } = args;
  const pkg = settings.package;
  const formatPath = (path: string) => logging.formatPath(path, true);

  const showPort = Boolean(args.port);
  const port =
    typeof args.port === 'number' ? args.port : settings.electron.port;

  const entry = settings.electron.entry;

  log.info.gray(`package:          ${log.magenta(pkg.name)}`);
  log.info.gray(`• version:        ${pkg.version}`);
  if (showPort) {
    log.info.gray(`• port:           ${port}`);
  }
  if (entry.main) {
    log.info.gray(`• entry:          ${formatPath(entry.main)}`);
    log.info.gray(`                  ${formatPath(entry.renderer)}`);
  }

  log.info();
}
