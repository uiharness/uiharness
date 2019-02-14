import * as React from 'react';
import { Button, ObjectView } from '@uiharness/electron/lib/renderer';

/**
 * Sample starting point.
 *
 * Referred to by the [renderer] entry-point, see:
 *
 *    - [test/renderer.tsx], and
 *    - [.uiharness.yml]
 *
 */

export type IState = { count?: number };
export class Test extends React.PureComponent<{}, IState> {
  public state: IState = { count: 0 };

  public render() {
    return (
      <div style={{ paddingLeft: 25, lineHeight: 1.5 }}>
        <h1>Hello World!</h1>
        <Button label={'Increment'} onClick={this.increment(1)} />
        <Button label={'Decrement'} onClick={this.increment(-1)} />
        <ObjectView name={'state'} data={this.state} />
      </div>
    );
  }

  private increment = (by: number) => {
    return () => {
      const count = (this.state.count || 0) + by;
      this.setState({ count });
    };
  };
}
