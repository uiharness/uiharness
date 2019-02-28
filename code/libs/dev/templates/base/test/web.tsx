import '../node_modules/@platform/css/reset.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Test } from '../src/Test';

/**
 * [Web] entry-point.
 *
 * Reference your component(s) here or pull in the [UIHarness]
 * visual testing host.
 */
ReactDOM.render(<Test />, document.getElementById('root'));
