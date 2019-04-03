import '../../node_modules/@platform/css/reset.css';
import '@babel/polyfill';

import * as React from 'react';

import { Shell } from '../../src';

/**
 * Test Component
 */
export type IState = { count?: number };
export class Test extends React.PureComponent<{}, IState> {
  public state: IState = {};

  public render() {
    return <Shell />;
  }
}
