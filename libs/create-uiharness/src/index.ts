import { fsPath } from './common';
import * as newFile from 'new-file';

export async function create() {
  const targetDir = fsPath.resolve('.');
  const settingsPath = fsPath.join(__dirname, '../templates.yml');
  const templateName = 'parcel';
  await newFile.create({
    targetDir,
    settingsPath,
    templateName,
  });
}
