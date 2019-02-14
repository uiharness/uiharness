import '../node_modules/@uiharness/dev/css/normalize.css';

import { renderer } from '@platform/electron/lib/renderer';
import * as React from 'react';

import { Test } from '../src/components/Test';

/**
 * [Renderer] entry-point.
 *
 * Reference your component(s) here or pull in the [UIHarness]
 * visual testing host.
 */
renderer
  .render(<Test />, 'root')
  .then(context => context.log.info('renderer loaded!'));
