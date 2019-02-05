import { join } from 'path';

import { exec, fs, IVariables, npm, TemplateMiddleware } from './common';
import { AfterTemplateMiddleware, IAlert, ITemplateResponse } from './types';

const alert = (res: ITemplateResponse, message: string) =>
  res.alert<IAlert>({ message });

/**
 * Processes a [package.json] file.
 */
export function processPackage(
  args: {
    done?: AfterTemplateMiddleware;
  } = {},
): TemplateMiddleware<IVariables> {
  return async (req, res) => {
    if (!req.path.source.endsWith('package.json')) {
      return res.next();
    }

    // Get latest NPM versions.
    alert(res, `Retrieving latest version information...`);
    const pkg = npm.pkg({ json: JSON.parse(req.text || '') });
    await pkg.updateVersions({
      filter: (name, version) => version === 'latest',
    });

    // Update the package JSON.
    alert(res, 'Updating [package.json] file');
    pkg.json.name = req.variables.moduleName;
    res.text = pkg.toJson();

    // Finish up.
    res.done(args.done);
  };
}

/**
 * Saves a template file.
 */
export function saveFile(
  args: {
    done?: AfterTemplateMiddleware;
  } = {},
): TemplateMiddleware<IVariables> {
  return async (req, res) => {
    const { dir } = req.variables;
    const path = join(dir, req.path.target);
    alert(res, `Saving: ${path}`);

    await fs.ensureDir(dir);
    await fs.writeFile(path, req.buffer);
    res.done(args.done);
  };
}

/**
 * Run NPM install on the package.
 */
export function npmInstall(
  args: {
    done?: AfterTemplateMiddleware;
  } = {},
): TemplateMiddleware<IVariables> {
  return async (req, res) => {
    const { dir } = req.variables;
    const pkg = npm.pkg(dir);
    const ver = pkg.devDependencies['@uiharness/dev'];
    const msg = `Installing v${ver} of the UIHarness...`;
    alert(res, msg);

    await npm.install({ dir });

    res.done(args.done);
  };
}

/**
 * Run `ui init` command.
 */
export function runInitCommand(
  args: {
    done?: AfterTemplateMiddleware;
  } = {},
): TemplateMiddleware<IVariables> {
  return async (req, res) => {
    const { dir } = req.variables;

    alert(res, `Initializing...`);
    const cmd = `cd ${dir} && node node_modules/.bin/ui init`;
    await exec.run(cmd, { silent: true });

    res.done(args.done);
  };
}
