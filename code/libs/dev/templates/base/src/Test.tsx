import * as React from 'react';
import { Button, ObjectView } from '@uiharness/electron/lib/components';

/**
 * Sample component.
 *
 * Referred to by the [renderer] and [web] entry-point, see:
 *
 *    - [.uiharness.yml]
 *    - [test/renderer.tsx]
 *    - [test/web.tsx]
 *
 */
export type IState = { count?: number };
export class Test extends React.PureComponent<{}, IState> {
  public state: IState = { count: 0 };

  public render() {
    return (
      <div style={{ paddingLeft: 25 }}>
        <h1>👋 Hello!</h1>
        <ul style={{ lineHeight: 1.6 }}>
          <li>
            <Button label={'Increment'} onClick={this.increment(1)} />
            <Button label={'Decrement'} onClick={this.increment(-1)} />
          </li>
          <li>
            <ObjectView name={'state'} data={this.state} />
          </li>
        </ul>
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
