import * as React from 'react';
import { color as colorUtil, css, COLORS, value, GlamorValue } from '../../common';

export type IHrProps = {
  color?: string | number | 'PINK' | 'CYAN';
  margin?: string | number | Array<string | number | null>;
  dashed?: boolean;
  opacity?: number;
  style?: GlamorValue;
};

export class Hr extends React.PureComponent<IHrProps> {
  /**
   * [Static]
   */
  public static Dashed(props: IHrProps) {
    return <Hr dashed={true} opacity={0.3} {...props} />;
  }
  public static Pink(props: IHrProps) {
    return <Hr color={'PINK'} opacity={0.4} {...props} />;
  }
  public static PinkDashed(props: IHrProps) {
    return <Hr.Pink dashed={true} {...props} />;
  }
  public static Cyan(props: IHrProps) {
    return <Hr color={'CYAN'} opacity={0.7} {...props} />;
  }
  public static CyanDashed(props: IHrProps) {
    return <Hr.Cyan dashed={true} opacity={0.8} {...props} />;
  }

  /**
   * [Render]
   */
  public render() {
    const { dashed } = this.props;
    const margin = this.props.margin === undefined ? [20, 0] : this.props.margin;
    const opacity = value.defaultValue(this.props.opacity, 0.15);

    let color = this.props.color;
    color = color === 'PINK' ? COLORS.PINK : color;
    color = color === 'CYAN' ? COLORS.CLI.CYAN : color;
    color = colorUtil.format(color || -1);

    const styles = {
      base: css({
        ...css.toMargins(margin),
        border: 'none',
        borderBottom: `${dashed ? 'dashed' : 'solid'} 1px ${color}`,
        opacity,
      }),
    };
    return <hr {...css(styles.base, this.props.style)} />;
  }
}
