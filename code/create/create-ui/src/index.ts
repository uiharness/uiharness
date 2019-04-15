import { basename, join, resolve } from 'path';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Listr, log, prompt, Template, TemplateType } from './common';
import * as middleware from './middleware';
import * as t from './types';

export * from './types';

/**
 * Initializes a new module.
 */
export async function init() {
  log.info();
  log.info.gray(`👋`);

  // Prompt for target platform.
  const { tmpl, variables, dir } = await prepareTemplate({});
  if (!tmpl || !dir || !variables) {
    return;
  }

  const alerts$ = tmpl.events$.pipe(
    filter(e => e.type === 'ALERT'),
    map(e => e.payload as t.IAlert),
  );

  // Run the template.
  const tasks = new Listr([
    {
      title: 'Setup',
      task: async () =>
        new Observable(observer => {
          (async () => {
            // Copy files and run NPM install.
            alerts$.subscribe(e => observer.next(e.message));
            await tmpl.execute<t.IVariables>({ variables });

            // Finish up.
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
 * [INTERNAL]
 */

/**
 * Builds a template based on the given parameters,
 * or prompts the user for input if parameter is not specified.
 */
async function prepareTemplate(args: { template?: TemplateType; moduleName?: string }) {
  let { template, moduleName } = args;

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
  if (!template) {
    type ITemplate = t.IPrompt<TemplateType>;
    const targets: ITemplate[] = [
      { id: 'platform', label: '@platform toolchain' },
      // { id: 'minimal', label: 'minimal' },
    ];
    const res = await prompt.forOption('Template', targets);
    if (!res) {
      return {};
    }
    template = res.id;
  }

  /**
   * Construct template.
   */

  // NOTE: NPM does not include the `package.json` file in the bundle, so we name it
  //       something different to get it deployed.
  const rename = [{ from: 'pkg.json', to: 'package.json' }];

  const tmpl = Template
    // Prepare the template.
    .create(join(__dirname, '../templates/base'))
    .use(middleware.processPackage({ filename: 'pkg.json' }))
    .use(middleware.saveFile({ rename }))
    .use(middleware.npmInstall())
    .use(middleware.runInitCommand({ template, done: 'COMPLETE' }));

  /**
   * User input variables.
   */
  const dir = resolve(`./${moduleName}`);
  const variables: t.IVariables = {
    template,
    platform: ['ELECTRON', 'WEB'],
    moduleName,
    dir,
  };

  // Finish up.
  return { tmpl, variables, dir };
}

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
