import { inquirer } from './libs';
import { ITemplate } from '../types';

/**
 * Prompts for a template.
 */
export async function forTemplate(templates: ITemplate[]) {
  const choices = templates.map(item => ({ name: item.name, value: item.id }));
  const confirm = {
    type: 'list',
    name: 'id',
    message: 'Select your target platform',
    choices,
  };
  const { id } = (await inquirer.prompt(confirm)) as { id: string };
  const result = templates.find(item => item.id === id);
  return result;
}
