import * as React from 'react';
import { color, css } from '../common';

/**
 * A styled <hr> element.
 */
export const Hr = (props: { color?: string | number; margin?: number } = {}) => {
  const { margin = 20 } = props;
  const styles = {
    base: css({
      border: 'none',
      borderBottom: `solid 1px ${color.format(props.color || -0.1)}`,
      MarginY: margin,
    }),
  };
  return <hr {...styles.base} />;
};
