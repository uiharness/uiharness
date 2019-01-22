import '@uiharness/core/css/normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { css } from '@tdb/util';

const Foo = () => {
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 20,
    }),
  };
  return <div {...styles.base}>Hello</div>;
};

ReactDOM.render(<Foo />, document.getElementById('root'));
