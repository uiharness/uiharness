import * as React from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { css, color, GlamorValue, t, IMAGE } from '../common';

export const init: t.ShellImportInit = async args => {
  const { shell } = args;
  shell.state.sidebar.el = <Sidebar />;
};

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec quam lorem. Praesent fermentum, augue ut porta varius, eros nisl euismod ante, ac suscipit elit libero nec dolor. Morbi magna enim, molestie non arcu id, varius sollicitudin neque. In sed quam mauris. Aenean mi nisl, elementum non arcu quis, ultrices tincidunt augue. Vivamus fermentum iaculis tellus finibus porttitor. Nulla eu purus id dolor auctor suscipit. Integer lacinia sapien at ante tempus volutpat.';

export type ISidebarProps = { style?: GlamorValue };
export type ISidebarState = {};

export class Sidebar extends React.PureComponent<ISidebarProps, ISidebarState> {
  public state: ISidebarState = {};
  private state$ = new Subject<Partial<ISidebarState>>();
  private unmounted$ = new Subject<{}>();

  /**
   * [Lifecycle]
   */
  constructor(props: ISidebarProps) {
    super(props);
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
        Absolute: 0,
        color: 'white',
        fontSize: 14,
        Scroll: true,
        Flex: 'vertical-stretch-stretch',
      }),
      body: css({
        padding: 12,
        flex: 1,
        Scroll: true,
        opacity: 0.5,
      }),
      footer: css({
        Flex: 'center-center',
        boxSizing: 'border-box',
        paddingTop: 5,
      }),
      logo: css({
        Image: IMAGE.LOGO.SPLASH,
        transform: `scale(0.8)`,
      }),
    };
    return (
      <div {...css(styles.base, this.props.style)}>
        <div {...styles.body}>
          <p>{LOREM}</p>
          <p>{LOREM}</p>
          <p>{LOREM}</p>
          <p>{LOREM}</p>
          <p>{LOREM}</p>
        </div>
        <div {...styles.footer}>
          <div {...styles.logo} />
        </div>
      </div>
    );
  }
}
