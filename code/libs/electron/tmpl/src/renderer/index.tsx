import '../../node_modules/@uiharness/core/css/normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Hello } from './screens/Hello';

const el = <Hello />;
ReactDOM.render(el, document.getElementById('root'));
