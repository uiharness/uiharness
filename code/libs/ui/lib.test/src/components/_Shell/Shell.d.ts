import * as React from 'react';
import { GlamorValue } from '../../common';
export declare type IShellProps = {
    style?: GlamorValue;
};
export declare type IShellState = {};
export declare class Shell extends React.PureComponent<IShellProps, IShellState> {
    state: IShellState;
    private unmounted$;
    private state$;
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
