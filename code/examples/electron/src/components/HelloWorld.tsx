import * as React from 'react';

export class HelloWorld extends React.PureComponent {
  public render() {
    const style = {
      padding: 50,
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
    };
    const URL = 'https://uiharness.com';
    return (
      <div style={style}>
        <h1>
          Hello <strong>"electron"</strong>
        </h1>
        <a href={URL}>{URL}</a>
      </div>
    );
  }
}
