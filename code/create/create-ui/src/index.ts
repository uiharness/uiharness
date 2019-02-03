import { log, prompt, ITemplate } from './common';
export * from './types';

/**
 * Initializes a new module.
 */
export async function init() {
  log.info();

  const templates: ITemplate[] = [
    { id: 'ALL', name: 'Electron & Web' },
    { id: 'ELECTRON', name: 'Electron' },
    { id: 'WEB', name: 'Web' },
  ];

  const res = await prompt.forTemplate(templates);

  console.log('-------------------------------------------');
  console.log('res', res);

  // log.info(`👋  Please use ${log.cyan('yarn create uiharness')} instead.`);
  log.info();
}

/**
 * INTERNAL
 */
