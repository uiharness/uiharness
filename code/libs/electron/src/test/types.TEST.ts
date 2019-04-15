import { expect } from 'chai';
import uiharness from '../main';

describe('types', () => {
  it('main', () => {
    const config: uiharness.IRuntimeConfig = {
      name: 'Foo',
      electron: {
        port: 123,
        main: 'main.ts',
        renderer: { default: { title: 'Foo', path: 'renderer.tsx' } },
      },
    };
    expect(config.name).to.eql('Foo');
    expect(config.electron.renderer.default.title).to.eql('Foo');
    expect(config.electron.renderer.default.path).to.eql('renderer.tsx');
  });
});
