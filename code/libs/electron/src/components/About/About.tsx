import { css, CssValue } from '@platform/react';
import * as React from 'react';

export type IAboutProps = {
  style?: CssValue;
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
