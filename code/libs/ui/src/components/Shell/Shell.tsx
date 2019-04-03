import * as React from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { css, color, GlamorValue } from '../../common';

export type IShellProps = { style?: GlamorValue };
export type IShellState = {};

export class Shell extends React.PureComponent<IShellProps, IShellState> {
  public state: IShellState = {};
  private unmounted$ = new Subject();
  private state$ = new Subject<Partial<IShellState>>();

  /**
   * [Lifecycle]
   */
  public componentWillMount() {
    this.state$.pipe(takeUntil(this.unmounted$)).subscribe(e => this.setState(e));
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
      base: css({
        backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
        Absolute: 0,
        padding: 30,
      }),
    };
    return (
      <div {...css(styles.base, this.props.style)}>
        <h1>Shell</h1>
      </div>
    );
  }
}
