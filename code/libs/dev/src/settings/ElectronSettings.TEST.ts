import { expect } from 'chai';
import { Settings } from '.';
import { fs } from '../common';

const DIR = './test/sample';
const EMPTY = './test/sample/empty.yml';
const NAME = './test/sample/name.yml';
const tmpDir = './test/.uiharness.tmp';
const templatesDir = './templates';

describe('ElectronSettings', () => {
  afterEach(async () => {
    await fs.remove(fs.resolve(tmpDir));
  });

  it('default values', () => {
    const test = (path?: string) => {
      const electron = Settings.create(path).electron;
      expect(electron.exists).to.eql(false);
      expect(electron.port).to.eql(8888);
      expect(electron.logLevel).to.eql(3);

      expect(electron.entry.main).to.eql('test/main.ts');
      expect(electron.entry.renderer.default.code).to.eql('test/renderer.tsx');
      expect(electron.entry.renderer.default.html).to.eql('.uiharness/html/renderer.default.html');

      const bundler = electron.bundlerArgs;
      expect(bundler.sourcemaps).to.eql(true);
      expect(bundler.treeshake).to.eql(false);
      expect(bundler.cmd).to.eql('--no-source-maps --log-level 3');

      const builder = electron.builderArgs;
      expect(builder.exists).to.eql(false);
    };

    test('/NO_EXIST');
    test(EMPTY);
  });

  it('specified values (from file)', () => {
    const electron = Settings.create(DIR).electron;
    expect(electron.exists).to.eql(true);
    expect(electron.port).to.eql(1234);
    expect(electron.logLevel).to.eql(1);

    expect(electron.entry.main).to.eql('./foo/start.ts');
    expect(electron.entry.renderer.default.code).to.eql('./foo/render.tsx');

    const bundler = electron.bundlerArgs;
    expect(bundler.sourcemaps).to.eql(false);
    expect(bundler.treeshake).to.eql(true);
    expect(bundler.cmd).to.eql('--experimental-scope-hoisting --log-level 1');

    const builder = electron.builderArgs;
    expect(builder.exists).to.eql(true);
    expect(builder.productName).to.eql('MY_APP');
    expect(builder.appId).to.eql('com.my-app.app');
    expect(builder.outputDir).to.eql('.foo/bar/release');
  });

  it('copies default entry-point HTML to temporary dir, with application name and path', async () => {
    const settings = Settings.create(NAME, { tmpDir, templatesDir });
    const electron = settings.electron;
    await electron.ensureEntries();

    const text = fs.readFileSync(fs.join(tmpDir, 'html', 'renderer.default.html'), 'utf8');
    expect(text).to.include(`<title>My App</title>`);
    expect(text).to.include(`<script src="../../../test/renderer.tsx">`);
  });
});
