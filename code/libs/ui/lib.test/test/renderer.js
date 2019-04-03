"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var renderer_1 = require("@platform/electron/lib/renderer");
var Test_1 = require("./components/Test");
var App = (function (_super) {
    tslib_1.__extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        return React.createElement(Test_1.Test, null);
    };
    App.contextType = renderer_1.default.Context;
    return App;
}(React.PureComponent));
exports.App = App;
renderer_1.default.render(React.createElement(App, null), 'root').then(function (context) { return context.log.info('renderer loaded!'); });
