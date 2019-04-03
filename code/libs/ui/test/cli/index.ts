import { Subject } from 'rxjs';
import { CommandState, t } from '../components/common';
import { root } from './cmds';

export function init(args: { state$: Subject<Partial<t.ITestState>> }) {
  const { state$ } = args;
  return CommandState.create({
    root,
    getInvokeArgs: async state => {
      const props: t.ITestCommandProps = { state$ };
      return { props };
    },
  });
}
