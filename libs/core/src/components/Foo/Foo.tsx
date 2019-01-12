import { React, css, color, GlamorValue } from '../../common';

export type IFooProps = {
  style?: GlamorValue;
};

export class Foo extends React.PureComponent<IFooProps> {
  public render() {
    const styles = {
      base: css({}),
    };
    return (
      <div {...css(styles.base, this.props.style)}>
        <div>Foo</div>
      </div>
    );
  }
}
