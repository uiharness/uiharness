import './css/normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// import * as React from 'react';

import { HelloWorld } from './screens/HelloWorld';

const el = <HelloWorld />;

ReactDOM.render(el, document.getElementById('root'));
