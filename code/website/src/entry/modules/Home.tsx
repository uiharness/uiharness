import * as React from 'react';

import { COLORS, css, IMAGE, shell, t } from '../common';

export const init: t.ShellImportInit = async args => {
  const { shell } = args;
  const state = shell.state;
  state.body.background = COLORS.DARK;
  state.body.el = <Home />;
  state.sidebar.width = 0;
  state.tree.width = 0;
};

export class Home extends React.PureComponent {
  public static contextType = shell.Context;
  public context!: t.IShellContext;

  /**
   * [Render]
   */
  public render() {
    const styles = {
      base: css({
        Absolute: 0,
        Flex: 'horizontal-center-center',
      }),
      logo: css({
        Image: IMAGE.LOGO.MAIN,
      }),
    };
    return (
      <div {...styles.base}>
        <div {...styles.logo} />
      </div>
    );
  }

  /**
   * [Handlers]
   */
  private loadAside = () => {
    this.context.shell.load('Sidebar');
  };
}
