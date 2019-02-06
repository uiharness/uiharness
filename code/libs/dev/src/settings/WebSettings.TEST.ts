import { expect } from 'chai';
import { Settings } from '.';
import { fs } from '../common';

const DIR = fs.resolve('./test/sample');

describe('WebSettings', () => {
  it('default values', () => {
    const test = (path?: string) => {
      const web = Settings.create(path).web;

      expect(web.exists).to.eql(false);
      expect(web.port).to.eql(1234);
      expect(web.logLevel).to.eql(3);

      expect(web.entry.html).to.eql('.uiharness/html/web.html');
      expect(web.entry.code).to.eql('test/web.tsx');

      const bundler = web.bundlerArgs;
      expect(bundler.sourcemaps).to.eql(true);
      expect(bundler.treeshake).to.eql(false);
      expect(bundler.cmd).to.eql('--no-source-maps --log-level 3');
    };
    test('/NO_EXIST');
    test(fs.join(DIR, 'empty.yml'));
  });

  it('specified values (from file)', () => {
    const web = Settings.create(DIR).web;

    expect(web.exists).to.eql(true);
    expect(web.port).to.eql(3030);
    expect(web.logLevel).to.eql(1);
    expect(web.entry.html).to.eql('./foo/web.html');

    const bundler = web.bundlerArgs;
    expect(bundler.sourcemaps).to.eql(false);
    expect(bundler.treeshake).to.eql(true);
    expect(bundler.cmd).to.eql('--experimental-scope-hoisting --log-level 1');
  });
});
