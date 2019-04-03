import '../../node_modules/@platform/css/reset.css';
import '@babel/polyfill';
import * as React from 'react';
export declare type IState = {
    count?: number;
};
export declare class Test extends React.PureComponent<{}, IState> {
    state: IState;
    render(): JSX.Element;
}
