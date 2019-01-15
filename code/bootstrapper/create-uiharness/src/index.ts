import { fsPath, log } from './common';
import * as newFile from 'new-file';

export async function create() {
  log.info();
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

  log.info.gray(`See ${log.blue('https://uiharness.com')} for more.`);
  log.info.gray('To start your development server:\n');
  log.info.cyan(`   cd ${log.white(fsPath.basename(res.dir))}`);
  log.info.cyan(`   yarn start`);
  log.info();
}
