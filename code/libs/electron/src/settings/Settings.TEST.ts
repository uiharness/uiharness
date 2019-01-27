import { expect } from 'chai';
import { Settings, ElectronSettings } from '.';
import { fsPath } from '../common';

const DIR = fsPath.resolve('./test/sample');

describe('Settings', () => {
  describe('create', () => {
    it('creates from directory path', () => {
      const settings = Settings.create(DIR);
      expect(settings.exists).to.eql(true);
      expect(settings.package.exists).to.eql(true);
      expect(settings.package.name).to.eql('sample');
    });

    it('creates from file path', () => {
      const path = fsPath.join(DIR, 'uiharness.yml');
      const settings = Settings.create(path);
      expect(settings.exists).to.eql(true);
      expect(settings.package.name).to.eql('sample');
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

  it('has electron settings', () => {
    const test = (path?: string) => {
      const settings = Settings.create(path);
      expect(settings.electron).to.be.an.instanceof(ElectronSettings);
    };
    test();
    test(DIR);
    test('/NO_EXIST');
  });
});
