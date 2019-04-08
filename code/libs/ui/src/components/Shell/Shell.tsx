import * as React from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { color, COLORS, Command, CommandState, css, GlamorValue, t, value } from '../../common';
import { CommandPrompt, CommandTree, ICommandState } from '../primitives';

export type IShellProps = {
  children?: React.ReactNode;
  cli: ICommandState;
  tree?: { width?: number };
  style?: GlamorValue;
};
export type IShellState = {};

export class Shell extends React.PureComponent<IShellProps, IShellState> {
  /**
   * [State]
   */
  public static CommandState = CommandState;
  public static Command = Command;

  /**
   * [Fields]
   */

  public state: IShellState = {};
  private unmounted$ = new Subject();
  private state$ = new Subject<Partial<IShellState>>();
  private tree$ = new Subject<t.CommandTreeEvent>();

  /**
   * [Lifecycle]
   */
  public componentWillMount() {
    // Setup observables.
    const state$ = this.state$.pipe(takeUntil(this.unmounted$));
    // const tree$ = this.tree$.pipe(takeUntil(this.unmounted$));

    // Update state.
    state$.subscribe(e => this.setState(e));
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
    const { tree } = this.props;
    const styles = {
      base: css({
        Absolute: 0,
        Flex: 'vertical',
      }),
      main: css({
        position: 'relative',
        display: 'flex',
        flex: 1,
      }),
      index:
        tree &&
        css({
          width: value.defaultValue(tree.width, 200),
          borderRight: `solid 1px ${color.format(-0.1)}`,
          backgroundColor: color.format(-0.03),
          display: 'flex',
        }),
      body: css({
        flex: 1,
      }),
      footer: css({
        backgroundColor: COLORS.DARK,
        height: 32,
      }),
    };

    const elIndex = tree && (
      <div {...styles.index}>
        <CommandTree cli={this.cli} events$={this.tree$} />
      </div>
    );

    return (
      <div {...css(styles.base, this.props.style)}>
        <div {...styles.main}>
          {elIndex}
          <div {...styles.body}>{this.props.children}</div>
        </div>
        <div {...styles.footer}>
          <CommandPrompt cli={this.cli} theme={'DARK'} />
        </div>
      </div>
    );
  }
}
