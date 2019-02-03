import { inquirer } from './libs';
import { IPrompt } from '../types';

/**
 * Prompts for a template.
 */
export async function forOption<T extends IPrompt>(
  title: string,
  templates: T[],
) {
  const choices = templates.map(({ label, id }) => ({
    name: label,
    value: id,
  }));
  const confirm = {
    type: 'list',
    name: 'id',
    message: title,
    choices,
  };
  const { id } = (await inquirer.prompt(confirm)) as { id: string };
  const result = templates.find(item => item.id === id);
  return result;
}
