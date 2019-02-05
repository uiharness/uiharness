import { main, command, log, logging } from '../../common';
import { Settings } from '../../settings';
import { Environment } from '../../types';

/**
 * Displays the logs
 */
export async function logs(args: {
  settings: Settings;
  env: Environment;
  tail?: boolean;
}) {
  const { settings, env, tail } = args;
  const paths = main.logPaths({ appName: settings.name });
  const path = env === 'production' ? paths.prod.path : paths.dev.path;

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
