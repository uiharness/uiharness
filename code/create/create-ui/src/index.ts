import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {
  takeUntil,
  take,
  takeWhile,
  map,
  filter,
  share,
  delay,
  distinctUntilChanged,
} from 'rxjs/operators';

import {
  log,
  prompt,
  IPrompt,
  Template,
  Platform,
  IVariables,
  Listr,
} from './common';
export * from './types';
import * as middleware from './tmpl.middleware';

type TargetOption = 'ALL' | 'ELECTRON' | 'WEB';

/**
 * Initializes a new module.
 */
export async function init() {
  log.info();
  log.info.gray(`👋`);
  log.info.gray('----------------------------------------------');

  // Prompt for target platform.
  const { tmpl, variables } = await prepareTemplate({});
  if (!tmpl) {
    return;
  }

  // Run the template.
  const tasks = new Listr([
    {
      title: 'Installing',
      task: async () =>
        new Observable(observer => {
          observer.next('Foo');

          setTimeout(() => {
            observer.next('Bar');
          }, 2000);

          setTimeout(() => {
            // observer.complete();

            tmpl
              .execute<IVariables>({ variables })
              .then(() => observer.complete());
          }, 4000);
        }),
    },
  ]);

  try {
    tasks.run();
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
async function prepareTemplate(args: { target?: Platform[] }) {
  let target = args.target;

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

  // Prepare the template.
  const tmpl = Template.create('./tmpl/base')
    .use(middleware.processPackage)
    .use(middleware.saveFile);

  // Run the template.
  const variables: IVariables = { target };

  // Finish up.
  return { variables, tmpl };
}
