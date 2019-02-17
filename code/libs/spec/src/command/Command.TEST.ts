import { expect } from 'chai';
import { Command } from '.';

describe('Command', () => {
  it('minimal construction', () => {
    const handler = () => true;
    const cmd = new Command({ title: '  Foo  ', handler });
    expect(cmd.title).to.eql('Foo'); // Trims title.
    expect(cmd.handler).to.eql(handler);
  });

  it('throws if a title is not passed', () => {
    const test = (title?: any) => {
      const fn = () => new Command({ title, handler: () => null });
      expect(fn).to.throw();
    };
    test('');
    test('  ');
    test();
  });
});
