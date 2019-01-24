import * as React from 'react';
import { color, css } from '../common';
import { Test } from './Grid/Test';

export interface IRootProps {}

export class Root extends React.PureComponent<IRootProps> {
  public render() {
    const styles = {
      base: css({
        Absolute: 0,
        padding: 30,
      }),
      grid: css({
        Absolute: [30],
        border: `solid 1px ${color.format(-0.1)}`,
      }),
    };
    return (
      <div {...styles.base}>
        <Test style={styles.grid} />
      </div>
    );
  }
}
