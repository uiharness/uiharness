import { basename, join, resolve } from 'path';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { fs, Listr, log, prompt, Template, TemplateType } from './common';
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

            // Configure [tsconfig] files.
            observer.next('Updating tsconfig.json files...');
            await updateTSConfigFiles({ variables });

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
async function prepareTemplate(args: {
  template?: TemplateType;
  moduleName?: string;
}) {
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
      { id: 'PLATFORM', label: '@platform toolchain' },
      { id: 'MINIMAL', label: 'minimal' },
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

async function updateTSConfigFiles(args: { variables: t.IVariables }) {
  const { variables } = args;
  const files = await getTSConfigFiles(variables.dir);

  // Add the base [tsconfig] template from @platform.
  if (variables.template === 'PLATFORM') {
    files.forEach(
      file => (file.json.extends = './node_modules/@platform/ts/tsconfig.json'),
    );
  }

  // Remove any empty "extends" entries.
  files
    .filter(file => !Boolean(file.json.extends))
    .forEach(file => delete file.json.extends);

  // Save files.
  await Promise.all(
    files
      .map(file => ({
        path: file.path,
        json: JSON.stringify(file.json, null, '  '),
      }))
      .map(file => fs.writeFile(file.path, file.json)),
  );
}

async function getTSConfigFiles(dir: string) {
  const paths = (await fs.readdir(dir))
    .filter(name => name.endsWith('.json'))
    .filter(name => name.includes('tsconfig'))
    .map(name => fs.join(dir, name));
  return Promise.all(
    paths.map(async path => {
      const json = await fs.file.loadAndParse<t.ITSConfig>(path);
      const include = json.include || [];
      const compilerOptions = json.compilerOptions || {};
      const outDir = compilerOptions.outDir || '';
      return { path, dir, outDir, json: { ...json, include, compilerOptions } };
    }),
  );
}
