import { log, prompt, ITemplate } from './common';
export * from './types';

/**
 * Initializes a new module.
 */
export async function init() {
  log.info();
  log.info.gray(`👋`);
  log.info.gray('----------------------------------------------');

  const templates: ITemplate[] = [
    { id: 'ALL', name: 'Electron & Web' },
    { id: 'ELECTRON', name: 'Electron' },
    { id: 'WEB', name: 'Web' },
  ];

  const res = await prompt.forTemplate(templates);

  log.info('-------------------------------------------');
  log.info('res', res);

  // log.info(`👋  Please use ${log.cyan('yarn create uiharness')} instead.`);
  log.info();
}
