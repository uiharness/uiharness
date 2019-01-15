import { React, css } from '../../common';

// Sample `raw-loader` import.
// @ts-ignore
const txt = require('./file.txt');
console.log('txt', txt);

export interface IFooProps {}

export class Foo extends React.Component<IFooProps> {
  public render() {
    const styles = {
      base: css({
        flex: 1,
        backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
        padding: 30,
      }),
    };
    return <div {...styles.base}>Hello UIHarness (Webpack)!</div>;
  }
}
