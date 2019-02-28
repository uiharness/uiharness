import { main, command, log, logging, fs } from '../../common';
import { Settings } from '../../settings';
import { Environment } from '../../types';

/**
 * Displays the logs
 */
export async function logs(args: { settings: Settings; env: Environment; tail?: boolean }) {
  const { settings, env, tail } = args;
  const paths = main.paths({ appName: settings.name, env }).log;
  const path = env === 'production' ? paths.prod.path : paths.dev.path;

  /**
   * Ensure the log exists.
   */
  if (!(await fs.pathExists(path))) {
    log.info();
    log.info(`A ${log.magenta(env)} log does not exist yet.`);
    log.info.gray(`${logging.formatPath(path)} (404)`);
    log.info();
    return;
  }

  /**
   * Header
   */
  log.info();
  log.info(logging.formatPath(path));
  log.info();

  /**
   * Display the log contents.
   */
  if (tail) {
    await command()
      .add('tail')
      .alias('-f')
      .add(path)
      .run();
  } else {
    await command()
      .add('cat')
      .add(path)
      .run();
    log.info();
    log.info(logging.formatPath(path, false));
  }
  log.info();
}
