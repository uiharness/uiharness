// import { TemplateMiddleware } from 'create-tmpl';
import { TemplateMiddleware, IVariables } from './common';
import { resolve } from 'path';

/**
 * Processes a [package.json] file.
 */
export const processPackage: TemplateMiddleware<IVariables> = async (
  req,
  res,
) => {
  if (!req.path.source.endsWith('package.json')) {
    return res.next();
  }

  console.group('\n🌳 process');

  console.log('path', req.path);
  console.log('req.variables', req.variables);
  console.groupEnd();

  res.next();
};

/**
 * Saves a template file.
 */
export const saveFile: TemplateMiddleware<IVariables> = async (req, res) => {
  const dir = resolve('.');
  console.group('\n🌳 save');

  console.log('dir', dir);
  console.groupEnd();

  res.complete();
};
