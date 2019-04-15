import { join } from 'path';
import { exec, fs, IVariables, npm, TemplateMiddleware } from './common';
import * as t from './types';

const alert = (res: t.ITemplateResponse, message: string) => res.alert<t.IAlert>({ message });

/**
 * Processes a [package.json] file.
 */
export function processPackage(args: {
  filename: string;
  done?: t.AfterTemplateMiddleware;
}): TemplateMiddleware<IVariables> {
  return async (req, res) => {
    if (!req.path.source.endsWith(args.filename)) {
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

    // Add @platform toolchain options.
    if (req.variables.template === 'platform') {
      pkg.setFields('scripts', {
        test: 'ts test',
        tdd: 'ts test --watch',
        lint: 'ts lint',
        build: 'ts build $@',
        'build-test': 'ts build --tsconfig=tsconfig.test $@',
        prepare: 'ts prepare',
      });
    }

    // Finish up.
    res.text = pkg.toJson();
    res.done(args.done);
  };
}

/**
 * Saves a template file.
 */
export function saveFile(
  args: {
    rename?: Array<{ from: string; to: string }>;
    done?: t.AfterTemplateMiddleware;
  } = {},
): TemplateMiddleware<IVariables> {
  return async (req, res) => {
    const { rename = [] } = args;
    const { dir } = req.variables;

    let target = join(dir, req.path.target);
    rename
      .filter(item => target.endsWith(item.from))
      .forEach(item => {
        target = target.substr(0, target.length - item.from.length);
        target += item.to;
      });

    alert(res, `Saving: ${target}`);

    await fs.ensureDir(dir);
    await fs.writeFile(target, req.buffer);

    res.done(args.done);
  };
}

/**
 * Run NPM install on the package.
 */
export function npmInstall(
  args: {
    done?: t.AfterTemplateMiddleware;
  } = {},
): TemplateMiddleware<IVariables> {
  return async (req, res) => {
    const { dir } = req.variables;
    const pkg = npm.pkg(dir);
    const ver = pkg.devDependencies['@uiharness/dev'];
    const msg = `🌼  Installing UIHarness v${ver}...`;
    alert(res, msg);

    await npm.install({ dir });

    res.done(args.done);
  };
}

/**
 * Run `ui init` command.
 */
export function runInitCommand(args: {
  template: t.TemplateType;
  done: t.AfterTemplateMiddleware;
}): TemplateMiddleware<IVariables> {
  return async (req, res) => {
    const { dir, template } = req.variables;

    alert(res, `Initializing...`);
    const cmd = `cd ${dir} && node node_modules/.bin/ui init --template=${template}`;
    await exec.cmd.run(cmd, { silent: true });

    res.done(args.done);
  };
}
