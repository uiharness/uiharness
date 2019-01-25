import { log, logging } from './libs';
import { Settings } from '../settings';

/**
 * Logs common information about the module.
 */
export function logInfo(args: {
  settings: Settings;
  port?: boolean | number;
  mainEntry?: string;
}) {
  const { settings, mainEntry } = args;
  const pkg = settings.package;
  const formatPath = (path: string) => logging.formatPath(path, true);

  const showPort = Boolean(args.port);
  const port = typeof args.port === 'number' ? args.port : settings.port;

  log.info();
  log.info.gray(`package:          ${log.magenta(pkg.name)}`);
  log.info.gray(`• version:        ${pkg.version}`);
  if (mainEntry) {
    log.info.gray(`• main entry:     ${formatPath(mainEntry || '')}`);
  }
  if (showPort) {
    log.info.gray(`• port:           ${log.yellow(port)}`);
  }
  log.info();
}
