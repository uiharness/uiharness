import * as React from 'react';
import { css, GlamorValue, isDev } from '../../common';

export type IHelloWorldProps = {
  style?: GlamorValue;
};

export class HelloWorld extends React.PureComponent<IHelloWorldProps> {
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
          <li>@uiharness/electron</li>
          <li>isDev: {isDev.toString()}</li>
        </ul>
      </div>
    );
  }
}
