import * as React from 'react';
import renderer from '@platform/electron/lib/renderer';
export declare class App extends React.PureComponent {
    static contextType: React.Context<renderer.IRendererContext<any, any>>;
    context: renderer.ReactContext;
    render(): JSX.Element;
}
