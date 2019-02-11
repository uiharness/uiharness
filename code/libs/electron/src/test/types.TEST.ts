import { expect } from 'chai';
import uiharness from '../main';

describe('types', () => {
  it('main', () => {
    const config: uiharness.IUIHarnessRuntimeConfig = {
      name: 'Foo',
      electron: { port: 123, main: 'main.ts', renderer: 'renderer.tsx' },
    };
    expect(config.name).to.eql('Foo');
  });
});
