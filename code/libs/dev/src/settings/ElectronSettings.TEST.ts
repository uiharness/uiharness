import { expect } from 'chai';
import { Settings } from '.';
import { fs } from '../common';

const DIR = './test/sample';
const EMPTY = './test/sample/empty.yml';
const NAME = './test/sample/name.yml';
const MULTI_RENDERER = './test/sample/multi-renderer.yml';
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

      expect(electron.entry.renderer.default.title).to.eql('Unnamed');
      expect(electron.entry.renderer.default.path).to.eql('test/renderer.tsx');
      expect(electron.entry.renderer.default.html).to.eql('html/electron.test.renderer.html');

      const out = electron.out();
      expect(out.main.file).to.eql('main.js');
      expect(out.main.dir).to.eql('bundle/app.main/dev');
      expect(out.main.path).to.eql('bundle/app.main/dev/main.js');

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
    expect(electron.logLevel).to.eql(3);

    expect(electron.entry.main).to.eql('./foo/start.ts');
    expect(electron.entry.renderer.default.title).to.eql('my-app');
    expect(electron.entry.renderer.default.path).to.eql('foo/render.tsx');

    const builder = electron.builderArgs;
    expect(builder.exists).to.eql(true);
    expect(builder.productName).to.eql('MY_APP');
    expect(builder.appId).to.eql('com.my-app.app');
    expect(builder.outputDir).to.eql('.foo/bar/release');
  });

  describe('bundlerArgs', () => {
    it('default values', () => {
      const electron = Settings.create(fs.join(DIR, 'uiharness.yml')).electron;
      const bundler = electron.bundlerArgs;
      expect(bundler.sourcemaps).to.eql(true);
      expect(bundler.treeshake).to.eql(false);
      expect(bundler.cmd).to.eql('--no-source-maps --log-level 3');
      expect(bundler.output).to.eql(undefined);
    });

    it('custom values', () => {
      const electron = Settings.create(fs.join(DIR, 'electron.bundle.yml')).electron;
      const bundler = electron.bundlerArgs;
      expect(bundler.sourcemaps).to.eql(false);
      expect(bundler.treeshake).to.eql(true);
      expect(bundler.cmd).to.eql('--experimental-scope-hoisting --log-level 1');
      expect(bundler.output).to.eql('static/dist');
    });
  });

  it('multiple renderer entry points', () => {
    const electron = Settings.create(MULTI_RENDERER).electron;
    const renderer = electron.entry.renderer;

    expect(renderer.default.path).to.eql('./foo/multi/index.tsx');
    expect(renderer.default.html).to.eql('html/electron.foo.multi.index.html');

    expect(renderer.admin.title).to.eql('Administration (v0.0.0)');
    expect(renderer.admin.path).to.eql('./admin.tsx');
    expect(renderer.admin.html).to.eql('html/electron.admin.html');
  });

  it('copies default entry-point HTML to temporary dir, with application name and path', async () => {
    const settings = Settings.create(NAME, { tmpDir, templatesDir });
    const electron = settings.electron;
    await electron.ensureEntries();

    const path = fs.join(tmpDir, 'html', 'electron.test.renderer.html');
    const text = fs.readFileSync(path, 'utf8');

    expect(text).to.include(`<title>My App</title>`);
    expect(text).to.include(`<script src="../../../test/renderer.tsx">`);
  });

  it('copies multi entry-point HTML to temporary dir, with application name and path', async () => {
    const settings = Settings.create(MULTI_RENDERER, { tmpDir, templatesDir });
    const electron = settings.electron;
    await electron.ensureEntries();

    const path1 = fs.join(tmpDir, 'html', 'electron.admin.html');
    const path2 = fs.join(tmpDir, 'html', 'electron.foo.multi.index.html');

    const text1 = fs.readFileSync(path1, 'utf8');
    const text2 = fs.readFileSync(path2, 'utf8');

    expect(text1).to.include(`<script src="../../../admin.tsx">`);
    expect(text2).to.include(`<script src="../../../foo/multi/index.tsx">`);
  });
});
