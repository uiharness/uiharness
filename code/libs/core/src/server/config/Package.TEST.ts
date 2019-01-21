import { expect } from 'chai';
import { Package } from '.';

const NAME = '@uiharness/core';

describe('Package (package.json)', () => {
  describe('create', () => {
    it('loads with no path (default to containing module)', () => {
      const pkg = Package.create();
      expect(pkg.name).to.eql(NAME);
    });

    it('loads with relative dir', () => {
      const pkg = Package.create('.');
      expect(pkg.name).to.eql(NAME);
    });

    it('loads with explicit path', () => {
      const pkg = Package.create('./package.json');
      expect(pkg.name).to.eql(NAME);
    });
  });

  it('exposes data fields', () => {
    const pkg = Package.create();
    expect(pkg.name).to.eql(pkg.json.name);
    expect(pkg.description).to.eql(pkg.json.description);
    expect(pkg.version).to.eql(pkg.json.version);
    expect(pkg.main).to.eql(pkg.json.main);
    expect(pkg.scripts).to.eql(pkg.json.scripts);
    expect(pkg.dependencies).to.eql(pkg.json.dependencies);
    expect(pkg.devDependencies).to.eql(pkg.json.devDependencies);
  });

  describe('addFields', () => {
    it('adds a set of fields', () => {
      const pkg = Package.create();
      expect(pkg.scripts.script1).to.eql(undefined);
      expect(pkg.scripts.script2).to.eql(undefined);
      expect(pkg.scripts.script3).to.eql(undefined);
      pkg
        .addFields('scripts', { script1: 'echo 1', script2: 'echo 2' })
        .addFields('scripts', { script3: 'echo 3' });
      expect(pkg.scripts.script1).to.eql('echo 1');
      expect(pkg.scripts.script2).to.eql('echo 2');
      expect(pkg.scripts.script3).to.eql('echo 3');
    });

    it('does not overwrite existing field', () => {
      const pkg = Package.create();
      pkg.addFields('scripts', { foo: 'v1' });
      pkg.addFields('scripts', { foo: 'v2' });
      expect(pkg.scripts.foo).to.eql('v1');
    });

    it('does overwrites existing field (force)', () => {
      const pkg = Package.create();
      pkg.addFields('scripts', { foo: 'v1' });
      pkg.addFields('scripts', { foo: 'v2' }, { force: true });
      expect(pkg.scripts.foo).to.eql('v2');
    });
  });

  describe('removeFields', () => {
    it('removes fields when values match', () => {
      const fields = { foo: '123', bar: '456' };
      const pkg = Package.create().addFields('scripts', fields);
      expect(pkg.scripts.foo).to.eql('123');
      expect(pkg.scripts.bar).to.eql('456');

      pkg.removeFields('scripts', fields);
      expect(pkg.scripts.foo).to.eql(undefined);
      expect(pkg.scripts.bar).to.eql(undefined);
    });

    it('does not remove fields when values differ', () => {
      const SCRIPTS_1 = { foo: '123', bar: '456' };
      const SCRIPTS_2 = { ...SCRIPTS_1, bar: 'abc' };

      const pkg = Package.create().addFields('scripts', SCRIPTS_1);
      expect(pkg.scripts.foo).to.eql('123');
      expect(pkg.scripts.bar).to.eql('456');

      pkg.removeFields('scripts', SCRIPTS_2);
      expect(pkg.scripts.foo).to.eql(undefined);
      expect(pkg.scripts.bar).to.eql('456');
    });

    it('force removes fields', () => {
      const SCRIPTS_1 = { foo: '123', bar: '456' };
      const SCRIPTS_2 = { foo: 'abc', bar: 'def' };
      const pkg = Package.create().addFields('scripts', SCRIPTS_1);

      // No change (values differ, and not forced)
      pkg.removeFields('scripts', SCRIPTS_2);
      expect(pkg.scripts.foo).to.eql('123');
      expect(pkg.scripts.bar).to.eql('456');

      // Force remove.
      pkg.removeFields('scripts', SCRIPTS_2, { force: true });
      expect(pkg.scripts.foo).to.eql(undefined);
      expect(pkg.scripts.bar).to.eql(undefined);
    });

    it('force removes when keys are passed', () => {
      const fields = { foo: '123', bar: '456' };
      const pkg = Package.create().addFields('scripts', fields);
      expect(pkg.scripts.foo).to.eql('123');
      expect(pkg.scripts.bar).to.eql('456');

      pkg.removeFields('scripts', Object.keys(fields));
      expect(pkg.scripts.foo).to.eql(undefined);
      expect(pkg.scripts.bar).to.eql(undefined);
    });

    it('excludes the removal of specified keys', () => {
      const fields = { foo: '123', bar: '456' };
      const pkg = Package.create().addFields('scripts', fields);
      expect(pkg.scripts.foo).to.eql('123');
      expect(pkg.scripts.bar).to.eql('456');
      pkg.removeFields('scripts', Object.keys(fields), {
        force: true,
        exclude: 'foo',
      });
      expect(pkg.scripts.foo).to.eql('123');
      expect(pkg.scripts.bar).to.eql(undefined);
    });

    it('does nothing when script does not exist', () => {
      const pkg = Package.create();
      const scripts = { ...pkg.scripts };
      pkg.removeFields('scripts', { foo: 'no-exist' });
      expect(pkg.scripts).to.eql(scripts);
    });
  });
});
