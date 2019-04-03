"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var main = require("@uiharness/electron/lib/main");
var config = require('../.uiharness/config.json');
(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var log;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, main.init({ config: config })];
            case 1:
                log = (_a.sent()).log;
                log.info('main started');
                return [2];
        }
    });
}); })();
