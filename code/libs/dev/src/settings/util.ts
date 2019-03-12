import { join, resolve } from 'path';

import { tmpl } from '../common';

/**
 * Ensures that all entry-points exist, and copies them if necessary.
 */
export async function ensureEntries(args: {
  name: string;
  codePath: string;
  templatesDir: string;
  pattern: string;
  targetDir: string;
  targetFile?: string;
}) {
  const { codePath, pattern } = args;

  const ensureRendererHtml = async () => {
    // Prepare paths.
    const targetDir = `/${args.targetDir.replace(/^\//, '')}`;
    const hops = targetDir
      .replace(/^\//, '')
      .split('/')
      .map(() => '..')
      .join('/');

    // Create template.
    const template = tmpl
      .create()
      .add({
        dir: resolve(args.templatesDir),
        pattern,
        targetDir,
      })
      .use(tmpl.replace({ edge: '__' }))
      .use(tmpl.copyFile({ force: true, filename: args.targetFile }));

    // Execute template.
    const variables = {
      NAME: args.name,
      PATH: join(hops, codePath),
    };
    await template.execute({ variables });
  };

  // Prepare.
  await ensureRendererHtml();
}
