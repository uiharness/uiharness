import { expect } from 'chai';
import { Settings } from '.';
import { fsPath, fs } from '../common';

const DIR = './test/sample';
const EMPTY = './test/sample/empty.yml';
const NAME = './test/sample/name.yml';
const tmpDir = './test/.uiharness.tmp';
const templatesDir = './tmpl';

describe('ElectronSettings', () => {
  beforeEach(async () => {
    await fs.remove(fsPath.resolve(tmpDir));
  });

  it('default values', () => {
    const test = (path?: string) => {
      const res = Settings.create(path).electron;
      expect(res.exists).to.eql(false);
      expect(res.port).to.eql(8888);
      expect(res.entry.main).to.eql('./test/app/main.ts');
      expect(res.entry.renderer).to.eql('./test/app/renderer.tsx');
      expect(res.entry.html).to.eql('./.uiharness/html/renderer.html');

      const bundler = res.bundlerArgs;
      expect(bundler.sourcemaps).to.eql(true);
      expect(bundler.treeshake).to.eql(false);
      expect(bundler.cmd).to.eql('--no-source-maps');

      const builder = res.builderArgs;
      expect(builder.exists).to.eql(false);
    };

    test('/NO_EXIST');
    test(EMPTY);
  });

  it('specified values (from file)', () => {
    const electron = Settings.create(DIR).electron;
    expect(electron.exists).to.eql(true);
    expect(electron.port).to.eql(1234);
    expect(electron.entry.main).to.eql('./foo/start.ts');
    expect(electron.entry.renderer).to.eql('./foo/render.html');

    const bundler = electron.bundlerArgs;
    expect(bundler.sourcemaps).to.eql(false);
    expect(bundler.treeshake).to.eql(true);
    expect(bundler.cmd).to.eql('--experimental-scope-hoisting');

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

    const text = fs.readFileSync(
      fsPath.join(tmpDir, 'html', 'renderer.html'),
      'utf8',
    );
    expect(text).to.include(`<title>My App</title>`);
    expect(text).to.include(`<script src="../../../test/app/renderer.tsx">`);
  });
});
