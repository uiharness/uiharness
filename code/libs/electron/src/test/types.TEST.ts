import { expect } from 'chai';
import uiharness from '../main';

describe('types', () => {
  it('main', () => {
    const config: uiharness.IRuntimeConfig = {
      name: 'Foo',
      version: '1.2.3',
      electron: {
        port: 123,
        main: 'main.ts',
        renderer: { default: { title: 'Foo', path: 'renderer.tsx' } },
      },
    };
    expect(config.name).to.eql('Foo');
    expect(config.version).to.eql('1.2.3');
    expect(config.electron.renderer.default.title).to.eql('Foo');
    expect(config.electron.renderer.default.path).to.eql('renderer.tsx');
  });
});
