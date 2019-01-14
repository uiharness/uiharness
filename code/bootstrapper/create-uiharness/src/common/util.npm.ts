import { exec, log } from './libs';

export interface INpmInfo {
  name: string;
  latest: string;
  json: any;
}

/**
 * Lookup latest info for module from NPM.
 */
export async function getInfo(name: string): Promise<INpmInfo | undefined> {
  const cmd = `npm info ${name} --json`;

  const parseJson = (text: string) => {
    try {
      const json = JSON.parse(text);
      return json;
    } catch (error) {
      log.error('Raw JSON text:');
      log.info(text);
      throw error;
    }
  };

  try {
    const result = await exec.run(cmd, { silent: true });
    if (!result.stdout) {
      return undefined;
    }
    const json = parseJson(result.stdout);
    const latest = json['dist-tags'].latest;
    const name = json.name;
    return {
      name,
      latest,
      json,
    };
  } catch (error) {
    if (error.message.includes('Not found')) {
      return undefined; // Return nothing indicating the module was not found on NPM.
    } else {
      throw new Error(
        `Failed while reading info for '${name}' from NPM.\nCMD: ${log.yellow(
          cmd,
        )}\n\n${error.message}`,
      );
    }
  }
}
