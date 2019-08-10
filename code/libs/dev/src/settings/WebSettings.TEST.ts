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

      expect(web.entry.default.html).to.eql('html/web.test.web.html');
      expect(web.entry.default.path).to.eql('test/web.tsx');

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
    expect(web.logLevel).to.eql(3);
    expect(web.entry.default.html).to.eql('html/web.foo.web.html');
  });

  describe('bundlerArgs', () => {
    it('default values', () => {
      const web = Settings.create(fs.join(DIR, 'uiharness.yml')).web;
      const bundler = web.bundlerArgs;
      expect(bundler.sourcemaps).to.eql(true);
      expect(bundler.treeshake).to.eql(false);
      expect(bundler.cmd).to.eql('--no-source-maps --log-level 3');
      expect(bundler.output).to.eql(undefined);
    });

    it('custom values', () => {
      const web = Settings.create(fs.join(DIR, 'web.bundle.yml')).web;
      const bundler = web.bundlerArgs;
      expect(bundler.sourcemaps).to.eql(false);
      expect(bundler.treeshake).to.eql(true);
      expect(bundler.cmd).to.eql('--experimental-scope-hoisting --log-level 1');
      expect(bundler.output).to.eql('static/dist');
    });
  });

  it('multiple entry points', () => {
    const web = Settings.create(fs.join(DIR, 'web.multi-entry.yml')).web;
    expect(web.exists).to.eql(true);

    const entry = web.entry;

    expect(entry.default.title).to.eql('my-app');
    expect(entry.default.path).to.eql('./foo/web.html');
    expect(entry.default.html).to.eql('html/web.foo.web.html');

    expect(entry.admin.title).to.eql('my-app');
    expect(entry.admin.path).to.eql('./foo/admin.tsx');
    expect(entry.default.html).to.eql('html/web.foo.web.html');

    expect(entry.chat.title).to.eql('My Chat');
    expect(entry.chat.path).to.eql('./foo/chat.tsx');
    expect(entry.chat.html).to.eql('html/web.foo.chat.html');
  });

  describe('static resources', () => {
    it('empty', () => {
      const web = Settings.create(fs.join(DIR, 'uiharness.yml')).web;
      expect(web.static.paths).to.eql([]);
    });

    it('paths (declared)', () => {
      const web = Settings.create(fs.join(DIR, 'web.static.yml')).web;
      expect(web.static.paths).to.eql(['favicon.ico', 'css/', 'images/']);
    });
  });

  describe('<head>', () => {
    it('empty', () => {
      const web = Settings.create(fs.join(DIR, 'uiharness.yml')).web;
      expect(web.head.stylesheets).to.eql([]);
    });

    it('paths (declared)', () => {
      const web = Settings.create(fs.join(DIR, 'web.head.yml')).web;
      expect(web.head.stylesheets).to.eql(['/css/normalize.css', '/css/global.css']);
    });
  });
});
