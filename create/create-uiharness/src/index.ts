import { fsPath, npm, log } from './common';
import * as newFile from 'new-file';

export async function create() {
  log.info();
  const targetDir = fsPath.resolve('.');
  const settingsPath = fsPath.join(__dirname, '../templates.yml');
  const res = await newFile.create({
    targetDir,
    settingsPath,
    beforeWrite,
  });
  log.info();

  if (!res.success) {
    return;
  }

  log.info.gray(`See ${log.blue('https://uiharness.com')} for more.`);
  log.info();

  log.info.gray('To start development server, run:\n');
  log.info.cyan(`   cd ${log.white(fsPath.basename(res.dir))}`);
  log.info.cyan(`   yarn start`);
  log.info();
}

/**
 * INTERNAL
 */
const beforeWrite: newFile.BeforeWriteFile = async e => {
  let text = e.text;

  // Update to the latest version of the package.
  if (e.path.endsWith('/package.json')) {
    const res = await npm.getInfo('@uiharness/parcel');
    const version = res ? `^${res.latest}` : 'ERROR';
    text = text.replace(/__UIHARNESS_VERSION__/g, version);
  }

  return text;
};
