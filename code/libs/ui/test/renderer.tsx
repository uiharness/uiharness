import '../node_modules/@uiharness/electron/css/normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * [Renderer] entry-point.
 *
 * Reference your component(s) here or pull in the [UIHarness]
 * visual testing host.
 */

try {
  const el = (
    <div style={{ paddingLeft: 20 }}>
      <h1>Hello World!</h1>
    </div>
  );
  ReactDOM.render(el, document.getElementById('root'));
} catch (error) {
  /**
   * 🐷 TODO  Do something with the error, like:
   *          - Log it somewhere.
   *          - Alert the main process, etc.
   */
}
