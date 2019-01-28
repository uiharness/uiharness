import '../node_modules/@uiharness/core/css/normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * Renderer entry point.
 *
 * Reference your component(s) here or pull in the [UIHarness]
 * visual testing host.
 */

const el = <div style={{ padding: 20 }}>Hello World!</div>;
ReactDOM.render(el, document.getElementById('root'));
