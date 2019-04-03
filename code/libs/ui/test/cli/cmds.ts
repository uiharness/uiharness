import { Command, t } from '../components/common';

type P = t.ITestCommandProps;

/**
 * The root of the CLI application.
 */
export const root = Command.create<P>('root')
  //
  .add('foo', async e => {
    const {} = e.props;
    const { params } = e.args;

    count++;
    e.props.state$.next({ message: `👋 Hello ${count}` });
  });

let count = 0;
