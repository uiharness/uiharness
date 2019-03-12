import { expect } from 'chai';
import uiharness from '../main';

describe('types', () => {
  it('main', () => {
    const config: uiharness.IRuntimeConfig = {
      name: 'Foo',
      electron: { port: 123, main: 'main.ts', renderer: { default: 'renderer.tsx' } },
    };
    expect(config.name).to.eql('Foo');
    expect(config.electron.renderer.default).to.eql('renderer.tsx');
  });
});
