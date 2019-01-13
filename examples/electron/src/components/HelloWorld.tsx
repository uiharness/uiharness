import * as React from 'react';

export class HelloWorld extends React.PureComponent {
  public render() {
    const style = {
      padding: 50,
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
    };
    return <div style={style}>Hello "electron"!</div>;
  }
}
