import * as React from 'react';
import { GlamorValue, Handsontable } from '../../common';
import { Grid, IGridSettings } from '.';

// renderer.

// const createColumns = (length: number) => {
//   return Array.from({ length }).map(() => {
//     return {
//       // editor: CustomEditor,
//       renderer: renderer.MY_CELL,
//     };
//   });
// };

const data = Handsontable.helper.createSpreadsheetData(1000, 100);
const settings: IGridSettings = {
  data,
  rowHeaders: true,
  colHeaders: true,
  // colHeaders: col => renderer.renderHeader({ col }),
  colWidths: 120,
  // columns: createColumns(100),
  // viewportRowRenderingOffset: 120,
  // viewportColumnRenderingOffset: 80,
  manualRowResize: true,
  manualColumnResize: true,
};

export type IFooProps = {
  style?: GlamorValue;
};

export class Test extends React.PureComponent<IFooProps> {
  public render() {
    return <Grid settings={settings} style={this.props.style} />;
  }
}
