import { t, CommandShell } from '../common';
const create = CommandShell.Command.create;

type P = t.ITestCommandProps;

const child = create<P>('child')
  .add('1', async e => null)
  .add('2', async e => null)
  .add('3', async e => null);

const ns = create<P>('ns', () => {
  console.log('🌼 invoke:ns');
})
  .add('one', async e => {
    console.log('🌼 invoke:one');
  })
  .add('two', async e => null)
  .add('three', async e => null)
  .add(child);

/**
 * The root of the CLI application.
 */
export const root = create<P>('root', e => {
  console.log('🌼 invoke:root');
})
  //
  .add('foo', async e => {
    console.log('🌼 invoke:foo');
    const {} = e.props;
    const { params } = e.args;

    count++;
    e.props.state$.next({ message: `👋 Hello ${count}` });
  })
  .add('bar')
  .add('foobar')
  .add(ns);

let count = 0;
