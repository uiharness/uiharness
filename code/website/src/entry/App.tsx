import * as React from 'react';

import { shell, COLORS } from './common';
import * as splash from './splash';

shell
  // Register application modules.
  .main('main', () => import('./modules/main'))
  .register('Doc', () => import('./modules/Doc'))
  .register('Home', () => import('./modules/Home'))
  .register('Sidebar', () => import('./modules/Sidebar'))
  .initial({
    tree: { width: 0 },
    body: { background: COLORS.DARK },
    sidebar: { width: 0 },
  });

export const App = () => {
  return <shell.Loader splash={splash.factory} theme={'DARK'} loadDelay={1000} />;
};
