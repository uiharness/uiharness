import '../../node_modules/@platform/css/reset.css';
import '@babel/polyfill';
import * as React from 'react';

// import { Button, ObjectView } from '@uiharness/electron/lib/components';

import { Button, ObjectView, Hr } from '../../src';

/**
 * Test Component
 */
export type IState = { count?: number };
export class Test extends React.PureComponent<{}, IState> {
  public state: IState = {};

  public render() {
    return (
      <div style={{ padding: 30 }}>
        <div style={{ marginBottom: 10 }}>
          <Button label={'Increment'} onClick={this.increment(1)} />
          <Button label={'Decrement'} onClick={this.increment(-1)} />
        </div>
        <Hr />
        <ObjectView name={'state'} data={this.state} />
      </div>
    );
  }

  private increment = (amount: number) => {
    return () => {
      this.setState({ count: (this.state.count || 0) + amount });
    };
  };
}
