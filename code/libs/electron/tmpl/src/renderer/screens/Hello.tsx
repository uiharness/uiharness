import * as React from 'react';
import { css, GlamorValue, isDev } from '../../common';

export type IHelloProps = {
  style?: GlamorValue;
};

export class Hello extends React.PureComponent<IHelloProps> {
  public render() {
    const styles = {
      base: css({
        Absolute: 0,
        padding: 30,
        backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      }),
    };
    return (
      <div {...css(styles.base, this.props.style)}>
        <ul>
          <li>Hello</li>
          <li>isDev: {isDev.toString()}</li>
        </ul>
      </div>
    );
  }
}
