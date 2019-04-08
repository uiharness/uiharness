import { t, Shell } from '../components/common';
const create = Shell.Command.create;

type P = t.ITestCommandProps;

const child = create<P>('child')
  .add('1', async e => null)
  .add('2', async e => null)
  .add('3', async e => null);

const ns = create<P>('ns')
  .add('one', async e => null)
  .add('two', async e => null)
  .add('three', async e => null)
  .add(child);

/**
 * The root of the CLI application.
 */
export const root = create<P>('root')
  //
  .add('foo', async e => {
    const {} = e.props;
    const { params } = e.args;

    count++;
    e.props.state$.next({ message: `👋 Hello ${count}` });
  })
  .add('bar')
  .add('foobar')
  .add(ns);

let count = 0;
