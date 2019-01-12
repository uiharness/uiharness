import { React, css } from '../../common';

// import foo from './TEXT.txt';
const foo = require('./TEXT.txt');
// console.log('f', f);
console.log('foo', foo);

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
    return <div {...styles.base}>Foo Example</div>;
  }
}
