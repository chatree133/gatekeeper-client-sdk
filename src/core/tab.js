"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tab = void 0;
const tslib_1 = require("tslib");
const error_1 = require("../utils/error");
class Tab {
    constructor() {
        this.features = [
            'toolbar=yes',
            'scrollbars=yes',
            'location=yes',
            'resizable=yes',
            'top=200',
            'width=600',
            'height=600',
        ];
        this.target = '_blank';
    }
    open(src) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                this.features.push(`left=${(window.innerWidth - 600) / 2}`);
                this.window = window.open(src, this.target, this.features.toString());
                this.initializeInterval(res, rej);
            });
        });
    }
    close() {
        if (this.responseInterval) {
            clearInterval(this.responseInterval);
        }
        if (this.window) {
            this.window.close();
        }
    }
    initializeInterval(res, rej) {
        this.responseInterval = setInterval(this.getChildWindowStringQueries.bind(this, res, rej), 100);
    }
    checkIsWindowAccessable(rej) {
        try {
            if (this.window.location.href === 'about:blank') {
                return false;
            }
            if (!this.window.location.href) {
                return rej(new Error('Window closed'));
            }
            return !!this.window.location.host;
        }
        catch (error) {
            return false;
        }
    }
    getChildWindowStringQueries(res, rej) {
        if (!this.checkIsWindowAccessable(rej)) {
            return;
        }
        let params;
        try {
            params = JSON.parse('{"' +
                decodeURI(this.window.location.search.substring(1))
                    .replace(/"/g, '\\"')
                    .replace(/&/g, '","')
                    .replace(/=/g, '":"') +
                '"}');
        }
        catch (error) {
            if (error instanceof DOMException) {
                return;
            }
            this.close();
            return rej(error);
        }
        console.log('params', params);
        this.close();
        if (!params || !params.status) {
            return rej(new Error('Window closed'));
        }
        if (params && params.status === 'true') {
            return res(params);
        }
        return rej(new error_1.BaseError(params.message, params.code));
    }
}
exports.Tab = Tab;
