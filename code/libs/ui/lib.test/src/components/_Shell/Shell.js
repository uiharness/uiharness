"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var common_1 = require("../../common");
var Shell = (function (_super) {
    tslib_1.__extends(Shell, _super);
    function Shell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {};
        _this.unmounted$ = new rxjs_1.Subject();
        _this.state$ = new rxjs_1.Subject();
        return _this;
    }
    Shell.prototype.componentWillMount = function () {
        var _this = this;
        this.state$.pipe(operators_1.takeUntil(this.unmounted$)).subscribe(function (e) { return _this.setState(e); });
    };
    Shell.prototype.componentWillUnmount = function () {
        this.unmounted$.next();
        this.unmounted$.complete();
    };
    Shell.prototype.render = function () {
        var styles = {
            base: common_1.css({
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                Absolute: 0,
                padding: 30,
            }),
        };
        return (React.createElement("div", tslib_1.__assign({}, common_1.css(styles.base, this.props.style)),
            React.createElement("h1", null, "Shell")));
    };
    return Shell;
}(React.PureComponent));
exports.Shell = Shell;
