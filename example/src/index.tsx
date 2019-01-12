export type ENTRY = 'This is the entry to the module API.';

import './css/normalize.css';

import { React, ReactDOM } from './common';
import { Foo } from './components/Foo';

ReactDOM.render(<div>Index.tsx</div>, document.getElementById('root'));
