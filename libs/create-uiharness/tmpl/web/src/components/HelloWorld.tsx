import * as React from 'react';

const URL = 'https://uiharness.com';

export class HelloWorld extends React.PureComponent {
  public render() {
    const style = {
      padding: 50,
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
    };
    return (
      <div style={style}>
        <h1>
          Hello <strong>"__NAME__"</strong>
        </h1>
        <a href={URL}>{URL}</a>
      </div>
    );
  }
}
