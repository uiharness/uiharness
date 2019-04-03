"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var common_1 = require("../../common");
exports.Hr = function (props) {
    if (props === void 0) { props = {}; }
    var _a = props.margin, margin = _a === void 0 ? 20 : _a;
    var styles = {
        base: common_1.css({
            border: 'none',
            borderBottom: "solid 1px " + common_1.color.format(props.color || -0.1),
            MarginY: margin,
        }),
    };
    return React.createElement("hr", tslib_1.__assign({}, styles.base));
};
