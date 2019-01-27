// @ts-ignore
import { DefaultSettings } from 'handsontable';

import * as React from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import '../../styles';

import { css, events, GlamorValue, Handsontable } from '../../common';

export type IGridSettings = DefaultSettings;

export type IGridProps = {
  style?: GlamorValue;
  settings?: IGridSettings;
};

/**
 * A wrapper around the [Handontable].
 *
 *    https://handsontable.com/docs
 *    https://github.com/handsontable/handsontable
 *    https://github.com/handsontable/react-handsontable
 *
 */
export class Grid extends React.PureComponent<IGridProps> {
  private unmounted$ = new Subject();
  private el: HTMLDivElement;
  private elRef = (ref: HTMLDivElement) => (this.el = ref);
  private table: Handsontable;

  public componentDidMount() {
    const { settings = {} } = this.props;

    this.updateSize();
    events.resize$.pipe(takeUntil(this.unmounted$)).subscribe(() => {
      this.updateSize();
      this.table.render();
    });

    this.table = new Handsontable(this.el as Element, settings);
  }

  public componentWillUnmount() {
    this.unmounted$.next();
    if (this.table) {
      this.table.destroy();
    }
  }

  public render() {
    return (
      <div
        ref={this.elRef}
        className={'tdbGrid'}
        {...css(STYLES.base, this.props.style)}
      />
    );
  }

  private updateSize() {
    const el = this.el;
    if (el) {
      this.setState({
        size: { width: el.offsetWidth, height: el.offsetHeight },
      });
    }
  }
}

/**
 * INTERNAL
 */
const STYLES = {
  base: css({
    position: 'relative',
    overflow: 'hidden',
  }),
};
