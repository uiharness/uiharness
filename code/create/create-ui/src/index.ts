import { join, resolve, basename } from 'path';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  IAlert,
  IPrompt,
  IVariables,
  Listr,
  log,
  Platform,
  prompt,
  Template,
} from './common';
import * as middleware from './middleware';

export * from './types';
type TargetOption = 'ALL' | 'ELECTRON' | 'WEB';

/**
 * Initializes a new module.
 */
export async function init() {
  log.info();
  log.info.gray(`👋`);
  // log.info.gray('----------------------------------------------');

  // Prompt for target platform.
  const { tmpl, variables, dir } = await prepareTemplate({});
  if (!tmpl || !dir) {
    return;
  }

  const alerts$ = tmpl.events$.pipe(
    filter(e => e.type === 'ALERT'),
    map(e => e.payload as IAlert),
  );

  // Run the template.
  const tasks = new Listr([
    {
      title: 'Setup',
      task: async () =>
        new Observable(observer => {
          (async () => {
            alerts$.subscribe(e => observer.next(e.message));
            await tmpl.execute<IVariables>({ variables });
            observer.complete();
          })();
        }),
    },
  ]);

  try {
    log.info();
    await tasks.run();
    log.info();
    logComplete({ dir });
  } catch (error) {
    log.error(error);
  }

  // Finish up.
  log.info();
}

/**
 * Builds a template based on the given parameters,
 * or prompts the user for input if parameter is not specified.
 */
async function prepareTemplate(args: {
  target?: Platform[];
  moduleName?: string;
}) {
  let { target, moduleName } = args;

  /**
   * Module name.
   */
  if (!moduleName) {
    const res = await prompt.forText('Module name');
    if (!res) {
      return {};
    }
    moduleName = res;
  }

  /**
   * Target platform.
   */
  if (!target) {
    type ITarget = IPrompt<TargetOption>;
    const targets: ITarget[] = [
      { id: 'ALL', label: 'Electron & Web' },
      { id: 'ELECTRON', label: 'Electron' },
      { id: 'WEB', label: 'Web' },
    ];
    const res = await prompt.forOption('Target platform', targets);
    if (!res) {
      return {};
    }
    target = res.id === 'ALL' ? ['ELECTRON', 'WEB'] : [res.id];
  }

  /**
   * Construct template.
   */
  const tmpl = Template
    // Prepare the template.
    .create(join(__dirname, '../templates/base'))
    .use(middleware.processPackage())
    .use(middleware.saveFile())
    .use(middleware.npmInstall())
    .use(middleware.runInitCommand({ done: 'COMPLETE' }));

  /**
   * User input variables.
   */
  const dir = resolve(`./${moduleName}`);
  const variables: IVariables = { target, moduleName, dir };

  // Finish up.
  return { tmpl, variables, dir };
}

/**
 * INTERNAL
 */
function logComplete(args: { dir: string }) {
  const dir = basename(args.dir);
  log.info.gray('🖐  To start your development server:\n');
  log.info.cyan(`     cd ${log.white(dir)}`);
  log.info.cyan(`     yarn start`);
  log.info();
  log.info.gray('👉  To see all available UIHarness commands:\n');
  log.info.cyan(`     cd ${log.white(dir)}`);
  log.info.cyan(`     yarn ui`);
  log.info();
  log.info.gray(`See ${log.blue('https://uiharness.com')} for more.\n`);
  log.info();
}
