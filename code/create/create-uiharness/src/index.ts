import { fsPath, log, inquirer } from './common';
import * as newFile from 'new-file';

export type ITemplate = {
  name: string;
  dir: string;
};

export async function create() {
  log.info();
  log.info('☝️');

  const targetDir = fsPath.resolve('.');
  const settingsPath = fsPath.join(__dirname, '../templates.yml');
  const res = await newFile.create({
    targetDir,
    settingsPath,
  });
  log.info();

  if (!res.success) {
    return;
  }

  // Finish up.
  const dir = res.dir;
  logComplete({ dir });
}

/**
 * INTERNAL
 */
function logComplete(args: { dir: string }) {
  const dir = fsPath.basename(args.dir);
  log.info.gray(`See ${log.blue('https://uiharness.com')} for more.`);
  log.info.gray('✌️  To start your development server:\n');
  log.info.cyan(`     cd ${log.white(dir)}`);
  log.info.cyan(`     yarn start`);
  log.info();
  log.info.gray('🖐  To see all available UIHarness commands:\n');
  log.info.cyan(`     cd ${log.white(dir)}`);
  log.info.cyan(`     yarn ui`);
  log.info();
}

async function promptForTemplate(templates: ITemplate[]) {
  const choices = templates.map(item => ({ name: item.name, value: item.dir }));
  const confirm = {
    type: 'list',
    name: 'path',
    message: 'Select a template',
    choices,
  };
  const { path } = (await inquirer.prompt(confirm)) as { path: string };
  const result = templates.find(item => item.dir === path);
  return result;
}
