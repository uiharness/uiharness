import * as React from 'react';
import { css, GlamorValue, color } from '@platform/react';

export type IAboutProps = {
  style?: GlamorValue;
};

export class About extends React.PureComponent<IAboutProps> {
  constructor(props: IAboutProps) {
    super(props);
  }

  public render() {
    const styles = {
      base: css({}),
    };
    return (
      <div {...css(styles.base, this.props.style)}>
        <div>About UIHarness</div>
      </div>
    );
  }
}
