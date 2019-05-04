import * as React from 'react';
import { color as colorUtil, css, COLORS, value } from '../../common';

/**
 * A styled <hr> element.
 */
export const Hr = (
  props: {
    color?: string | number | 'PINK' | 'CYAN';
    margin?: string | number | Array<string | number | null>;
    dashed?: boolean;
    opacity?: number;
  } = {},
) => {
  const { dashed } = props;
  const margin = props.margin === undefined ? [20, 0] : props.margin;
  const opacity = value.defaultValue(props.opacity, 0.1);

  let color = props.color;
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
  return <hr {...styles.base} />;
};
