import { log, prompt, IPrompt, Template, Platform, IVariables } from './common';
export * from './types';
import * as middleware from './middleware';

type TargetOption = 'ALL' | 'ELECTRON' | 'WEB';

/**
 * Initializes a new module.
 */
export async function init() {
  log.info();
  log.info.gray(`👋`);
  log.info.gray('----------------------------------------------');

  // Prompt for target platform.
  const { tmpl, variables } = await buildTemplate({});
  if (!tmpl) {
    return;
  }

  // Run the template.
  await tmpl.execute<IVariables>({ variables });
  log.info();
}

/**
 * Builds a template based on the given parameters,
 * or prompts the user for input if parameter is not specified.
 */
async function buildTemplate(args: { target?: Platform[] }) {
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
