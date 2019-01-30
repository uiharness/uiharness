import { expect } from 'chai';
import {
  Settings,
  ElectronSettings,
  WebSettings,
  IUIHarnessSettingsOptions,
} from '.';
import { fsPath, constants } from '../common';

const { PATH } = constants;
const DIR = fsPath.resolve('./test/sample');

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
      const path = fsPath.join(DIR, 'uiharness.yml');
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
});
