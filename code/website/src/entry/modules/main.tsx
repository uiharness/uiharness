import * as React from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { color, css, t, COLORS, shell } from '../common';

const PINK = '#BA6C8B';

// TEMP 🐷
const ROOT: t.ITreeNode = {
  id: 'ROOT',
  props: { label: 'Stages' },
  children: [{ id: '1st Person' }, { id: '2nd Person' }, { id: '3rd Person' }],
};

export const init: t.ShellImportInit = async args => {
  const { shell } = args;
  // shell.state.body.el = <ComponentA />;
  // shell.state.tree.root = ROOT;
  // shell.state.body.background = PINK;

  shell.load('Home');
};
