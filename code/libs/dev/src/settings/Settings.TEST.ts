import { expect } from 'chai';
import { Settings, ElectronSettings, WebSettings, IUIHarnessSettingsOptions } from '.';
import { fs, constants } from '../common';

const { PATH } = constants;
const DIR = fs.resolve('./test/sample');

describe('Settings', () => {
  describe('create', () => {
    it('creates from directory path', () => {
      const settings = Settings.create(DIR);
      expect(settings.exists).to.eql(true);
      expect(settings.package.exists).to.eql(true);
      expect(settings.package.name).to.eql('sample');
      expect(settings.path.tmp.dir).to.eql(PATH.TMP);
    });

    it('creates from file path', () => {
      const path = fs.join(DIR, 'uiharness.yml');
      const settings = Settings.create(path);
      expect(settings.exists).to.eql(true);
      expect(settings.package.name).to.eql('sample');
    });

    it('creates with alternate `tmpDir`', () => {
      const tmpDir = './test/.foo';
      const settings = Settings.create(DIR, { tmpDir });
      expect(settings.path.tmp.dir).to.eql(tmpDir);
    });

    it('creates with alternate `templatesDir`', () => {
      const templatesDir = 'test/my-templates';
      const settings = Settings.create(DIR, { templatesDir });
      const base = settings.path.templates.base;
      expect(base).to.eql(`${templatesDir}/base`);
    });

    it('returns default settings if file does not exist', () => {
      const settings = Settings.create('/NO_EXIST');
      expect(settings.exists).to.eql(false);
      expect(settings.package.exists).to.eql(false);
    });
  });

  it('has electron/web settings', () => {
    const test = (path?: string, options?: IUIHarnessSettingsOptions) => {
      const settings = Settings.create(path, options);
      const { web, electron } = settings;
      expect(electron).to.be.an.instanceof(ElectronSettings);
      expect(web).to.be.an.instanceof(WebSettings);
    };
    test();
    test(DIR);
    test('/NO_EXIST');
  });

  it('has [web] settings only', () => {
    const settings = Settings.create(fs.join(DIR, 'only-web.yml'));
    expect(settings.web.exists).to.eql(true);
    expect(settings.electron.exists).to.eql(false);
  });

  it('has [electron] settings only', () => {
    const settings = Settings.create(fs.join(DIR, 'only-electron.yml'));
    expect(settings.web.exists).to.eql(false);
    expect(settings.electron.exists).to.eql(true);
  });

  describe('sourcemaps', () => {
    it('has no sourcemaps configuration', () => {
      const settings = Settings.create(DIR);
      expect(settings.sourcemaps.strip).to.eql([]);
    });

    it('has paths to strip of sourcemaps', () => {
      const settings = Settings.create(fs.join(DIR, 'sourcemaps.yml'));
      const strip = settings.sourcemaps.strip;
      expect(strip[0]).to.eql('node_modules/rxjs');
      expect(strip[1]).to.eql('node_modules/foo');
    });
  });
});
