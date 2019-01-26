import { expect } from 'chai';
import { Settings } from '.';
import { fsPath } from '../common';

const DIR = fsPath.resolve('./test/sample');

describe('ElectronSettings', () => {
  it('default values', () => {
    const test = (path?: string) => {
      const res = Settings.create(path).electron;
      expect(res.exists).to.eql(false);
      expect(res.port).to.eql(8888);
      expect(res.entry.main).to.eql('./src/test/app.main.ts');
      expect(res.entry.renderer).to.eql('./src/test/app.renderer.html');

      const bundler = res.bundlerArgs;
      expect(bundler.sourcemaps).to.eql(true);
      expect(bundler.treeshake).to.eql(false);
      expect(bundler.cmd).to.eql('--no-source-maps');

      const builder = res.builderArgs;
      expect(builder.exists).to.eql(false);
    };
    test('/NO_EXIST');
    test(fsPath.join(DIR, 'empty.yml'));
  });

  it('specified values (from file)', () => {
    const res = Settings.create(DIR).electron;
    expect(res.exists).to.eql(true);
    expect(res.port).to.eql(1234);
    expect(res.entry.main).to.eql('./foo/main/start.ts');
    expect(res.entry.renderer).to.eql('./foo/renderer/index.html');

    const bundler = res.bundlerArgs;
    expect(bundler.sourcemaps).to.eql(false);
    expect(bundler.treeshake).to.eql(true);
    expect(bundler.cmd).to.eql('--experimental-scope-hoisting');

    const builder = res.builderArgs;
    expect(builder.exists).to.eql(true);
    expect(builder.productName).to.eql('MY_APP');
    expect(builder.appId).to.eql('com.my-app.app');
    expect(builder.outputDir).to.eql('.foo/bar/release');
  });
});
