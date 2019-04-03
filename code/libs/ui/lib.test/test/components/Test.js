"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("../../node_modules/@platform/css/reset.css");
require("@babel/polyfill");
var React = require("react");
var src_1 = require("../../src");
var Test = (function (_super) {
    tslib_1.__extends(Test, _super);
    function Test() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {};
        return _this;
    }
    Test.prototype.render = function () {
        return React.createElement(src_1.Shell, null);
    };
    return Test;
}(React.PureComponent));
exports.Test = Test;
