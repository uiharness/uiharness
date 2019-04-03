import * as React from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { css, color, COLORS, GlamorValue } from '../../common';
import { CommandPrompt, ICommandState } from '../primitives';

export type IShellProps = {
  children?: React.ReactNode;
  cli: ICommandState;
  style?: GlamorValue;
};
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
   * [Properties]
   */
  public get cli() {
    return this.props.cli;
  }

  /**
   * [Render]
   */
  public render() {
    const styles = {
      base: css({
        Absolute: 0,
        Flex: 'vertical',
      }),
      main: css({
        position: 'relative',
        display: 'flex',
        flex: 1,
        padding: 20,
      }),
      footer: css({
        backgroundColor: COLORS.DARK,
        height: 32,
      }),
    };

    return (
      <div {...css(styles.base, this.props.style)}>
        <div {...styles.main}>{this.props.children}</div>
        <div {...styles.footer}>
          <CommandPrompt cli={this.cli} theme={'DARK'} />
        </div>
      </div>
    );
  }
}
