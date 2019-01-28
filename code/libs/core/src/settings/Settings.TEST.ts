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
      expect(settings.tmpDir).to.eql(fsPath.resolve(PATH.DIR.TMP));
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
      expect(settings.tmpDir).to.eql(fsPath.resolve(tmpDir));
    });

    it('returns default settings if file does not exist', () => {
      const settings = Settings.create('/NO_EXIST');
      expect(settings.exists).to.eql(false);
      expect(settings.package.exists).to.eql(false);

      expect(settings.init.scripts).to.eql(true);
      expect(settings.init.files).to.eql(true);
      expect(settings.init.html).to.eql(true);
      expect(settings.init.deps).to.eql(true);
    });
  });

  it('has electron/web settings', () => {
    const test = (path?: string, options?: IUIHarnessSettingsOptions) => {
      const settings = Settings.create(path, options);
      const { web, electron } = settings;
      expect(electron).to.be.an.instanceof(ElectronSettings);
      expect(web).to.be.an.instanceof(WebSettings);
      expect(electron.tmpDir).to.eql(settings.tmpDir);
      expect(web.tmpDir).to.eql(settings.tmpDir);
    };
    test();
    test(DIR);
    test('/NO_EXIST');
  });
});
