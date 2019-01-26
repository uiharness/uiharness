import { expect } from 'chai';
import { Settings } from '.';
import { fsPath } from '../common';

const DIR = fsPath.resolve('./test/sample');

describe('WebSettings', () => {
  it.skip('default values', () => {
    const test = (path?: string) => {
      const res = Settings.create(path).web;
      expect(res.exists).to.eql(false);
      expect(res.port).to.eql(1234);
      expect(res.bundlerArgs.sourcemaps).to.eql(true);
      expect(res.bundlerArgs.treeshake).to.eql(false);
      expect(res.entry).to.eql('./src/main.ts');
    };
    test('/NO_EXIST');
    test(fsPath.join(DIR, 'empty.yml'));
  });

  it.skip('specified values (from file)', () => {
    const res = Settings.create(DIR).web;
    expect(res.exists).to.eql(true);
    expect(res.port).to.eql(1234);
    expect(res.bundlerArgs.sourcemaps).to.eql(false);
    expect(res.bundlerArgs.treeshake).to.eql(true);
    expect(res.entry).to.eql('./foo/main/start.ts');
  });
});
