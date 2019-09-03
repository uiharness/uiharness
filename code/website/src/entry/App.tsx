import * as React from 'react';

import { shell } from './common';
import * as splash from './splash';

shell
  // Register application modules.
  .register('Doc', () => import('./modules/Doc'))
  .register('Home', () => import('./modules/Home'))
  .register('Sidebar', () => import('./modules/Sidebar'))
  .register('main', () => import('./modules/main'))
  .default('Home');

export const App = () => {
  return <shell.Loader splash={splash.factory} theme={'DARK'} loadDelay={1000} />;
};
