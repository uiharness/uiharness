import { Command, t } from '../common';

type P = t.ICommandProps & { count: number };

/**
 * The root of the CLI application.
 */
export const root = Command.create<P>('root', e => {
  // Setup initial screen.
})
  .add('title', e => {
    // Sample command.
    const title = (e.args.params[0] || 'Untitled').toString();
    e.props.state$.next({ title });
  })

  .add('increment', e => {
    // Sample command.
    const count = e.get('count', 0) + 1;
    e.set('count', count);
    e.props.state$.next({ count });
  })
  .add('decrement', e => {
    // Sample command.
    const count = e.get('count', 0) - 1;
    e.set('count', count);
    e.props.state$.next({ count });
  });
