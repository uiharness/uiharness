import * as React from 'react';
import { GlamorValue, Handsontable } from '../../common';
import { Grid, IGridSettings } from '.';

const data = Handsontable.helper.createSpreadsheetData(1000, 100);
const settings: IGridSettings = {
  data,
  rowHeaders: true,
  colHeaders: true,
  colWidths: 120,
  manualRowResize: true,
  manualColumnResize: true,
  viewportRowRenderingOffset: 20,
};

export type IFooProps = {
  style?: GlamorValue;
};

export class Test extends React.PureComponent<IFooProps> {
  public render() {
    return <Grid settings={settings} style={this.props.style} />;
  }
}
