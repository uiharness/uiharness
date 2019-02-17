import { expect } from 'chai';
import { Command } from '.';
import { DEFAULT } from './Command';

describe('Command', () => {
  it('minimal construction', () => {
    const cmd = new Command({ title: '  Foo  ' });
    expect(cmd.title).to.eql('Foo'); // NB: trims title.
    expect(cmd.handler).to.eql(DEFAULT.HANDLER);
    expect(cmd.children).to.eql([]);
  });

  it('takes handler in constructor', () => {
    const handler = () => true;
    const cmd = new Command({ title: 'Foo', handler });
    expect(cmd.handler).to.eql(handler);
  });

  it('takes children in constructor', () => {
    const child = new Command({ title: 'child' });
    const parent = new Command({ title: 'parent', children: [child] });
    expect(parent.children).to.eql([child]);
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

  describe('clone', () => {
    it('clones - deep (default)', () => {
      const child = new Command({ title: 'child' });
      const cmd1 = new Command({ title: 'foo', children: [child] });
      const cmd2 = cmd1.clone();
      expect(cmd1).to.eql(cmd2);
      expect(cmd1).to.not.equal(cmd2);

      expect(cmd2.children).to.eql([child]);
      expect(cmd2.children[0]).to.not.equal(child);
    });

    it('clones - shallow (deep: false)', () => {
      const child = new Command({ title: 'child' });
      const cmd1 = new Command({ title: 'foo', children: [child] });
      const cmd2 = cmd1.clone({ deep: false });
      expect(cmd1).to.eql(cmd2);
      expect(cmd1).to.not.equal(cmd2);

      expect(cmd2.children).to.eql([child]);
      expect(cmd2.children[0]).to.equal(child);
    });
  });

  describe('describe (static)', () => {
    it('with args object', () => {
      const cmd = Command.describe({ title: 'foo' });
      expect(cmd.title).to.eql('foo');
    });

    it('with title', () => {
      const handler = () => null;
      const cmd = Command.describe('foo', handler);
      expect(cmd.title).to.eql('foo');
      expect(cmd.handler).to.eql(handler);
    });

    it('with title/handler', () => {
      const handler = () => null;
      const cmd = Command.describe('foo', handler);
      expect(cmd.title).to.eql('foo');
      expect(cmd.handler).to.eql(handler);
    });
  });

  describe('add', () => {
    it('adds a child command', () => {
      const cmd1 = Command.describe('foo');
      const cmd2 = cmd1.add('child');

      expect(cmd1).to.equal(cmd2);
      expect(cmd1.length).to.eql(1);

      expect(cmd2.children[0].title).to.eql('child');
    });

    it('adds a child to a child', () => {
      const cmd = Command.describe('root')
        .add('a')
        .add('b')
        .add('c');

      expect(cmd.length).to.eql(3);
      expect(cmd.children[0].length).to.eql(0);

      const a1 = cmd.children[0].add('a1');
      expect(cmd.length).to.eql(3);
      expect(cmd.children[0].length).to.eql(1);
      expect(cmd.children[0]).to.equal(a1);
    });
  });

  describe('toObject', () => {
    it('deep', () => {
      const cmd = Command.describe('root')
        .add('a')
        .add('b');
      cmd.children[1].add('b1');

      expect(cmd.title).to.eql('root');
      expect(cmd.children[0].title).to.eql('a');
      expect(cmd.children[1].title).to.eql('b');
      expect(cmd.children[1].children[0].title).to.eql('b1');

      const any: any = cmd;
      expect(any.handler).to.eql(undefined);
      expect(any.children[0].handler).to.eql(undefined);
      expect(any.children[1].handler).to.eql(undefined);
    });
  });
});
