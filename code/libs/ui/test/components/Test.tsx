import * as React from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as cli from '../cli';
import { css, GlamorValue, Shell, t } from './common';

export type ITestProps = { style?: GlamorValue };

export class Test extends React.PureComponent<ITestProps, t.ITestState> {
  public state: t.ITestState = {};
  private unmounted$ = new Subject();
  private state$ = new Subject<Partial<t.ITestState>>();
  private cli!: t.ICommandState;

  /**
   * [Lifecycle]
   */
  public componentWillMount() {
    this.state$.pipe(takeUntil(this.unmounted$)).subscribe(e => this.setState(e));
    this.cli = cli.init({ state$: this.state$ });
    const cli$ = this.cli.events$.pipe(takeUntil(this.unmounted$));

    cli$.subscribe(e => {
      console.log('🌳', e.type, e.payload);
    });
  }

  public componentWillUnmount() {
    this.unmounted$.next();
    this.unmounted$.complete();
  }

  /**
   * [Render]
   */
  public render() {
    const styles = {
      base: css({}),
      content: css({ padding: 20 }),
    };
    return (
      <div {...css(styles.base, this.props.style)}>
        <Shell cli={this.cli} tree={{}}>
          <div {...styles.content}>Message: {this.state.message || 'NONE'}</div>
        </Shell>
      </div>
    );
  }
}
