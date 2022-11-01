"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tab_1 = require("./core/tab");
const js_base64_1 = require("js-base64");
const fingerprintjs_1 = require("@fingerprintjs/fingerprintjs");
class Gatekeeper {
    constructor() {
        this.LOCALSTORAGE_IDENTIFIER = "gatekeeper_token";
        this.URL = "https://api-passport.advanceagro.net";
        this.tab = new tab_1.Tab();
    }
    isLoggedIn() {
        return !!localStorage.getItem(this.LOCALSTORAGE_IDENTIFIER);
    }
    getToken() {
        return localStorage.getItem(this.LOCALSTORAGE_IDENTIFIER);
    }
    getAccountID() {
        return this.payload.accountID;
    }
    getDeviceID() {
        return this.payload.deviceID;
    }
    getBase64Payload(additional) {
        const data = Object.assign(Object.assign({}, this.payload), additional);
        console.log("payload", data);
        return (0, js_base64_1.encode)(JSON.stringify(data));
    }
    static getInstance() {
        if (!Gatekeeper.instance) {
            Gatekeeper.instance = new Gatekeeper();
        }
        return Gatekeeper.instance;
    }
    initialize(accountID) {
        this.payload = {
            isBrowser: true,
            accountID,
            clientURL: `${location.protocol}//${location.host}/login`,
            deviceID: null,
        };
        fingerprintjs_1.default
            .load()
            .then((fp) => fp.get())
            .then(({ visitorId }) => (this.payload.deviceID = visitorId));
    }

    //https://api-passport.advanceagro.net/oauth/aad/signin?serviceid=0000
    loginBy365(serviceid) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                // const { token } = yield this.tab.open(`${this.URL}/oauth/aad/signin?serviceid=${serviceid}`);
                //const { token } = yield this.tab.open(
                const params = yield this.tab.open(
                    `${this.URL}/oauth/aad/signin?serviceid=${serviceid}&payload=${this.getBase64Payload(
                        {
                            type: "LOGIN",
                        }
                    )}`
                );
                localStorage.setItem(this.LOCALSTORAGE_IDENTIFIER, params.token);
                return params;
            } catch (error) {
                console.log(error);
                throw error;
            }
        });
    }

    unlink365() {
        this.tab.open2(
            `${this.URL}/oauth/aad/signin2`
        );
        // return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        //     try {
        //         yield this.tab.open2(
        //             `${this.URL}/oauth/aad/signin2`
        //         );
        //     } catch (error) {
        //         console.log(error);
        //         throw error;
        //     }
        // });
    }

    manage365() {
        this.tab.open2(
            `${this.URL}/oauth/aad/signin3`
        );
        // return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        //     try {
        //         yield this.tab.open2(
        //             `${this.URL}/oauth/aad/signin3`
        //         );
        //     } catch (error) {
        //         console.log(error);
        //         throw error;
        //     }
        // });
    }

    //https://api-passport.advanceagro.net/oauth/idms/signin
    loginByIdms(email, password, serviceid) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.URL}/oauth/idms/signin`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password, serviceid }),
                });
                console.log(response);
                const data = yield response.json();
                console.log(data);
                if (data && data.status && data.message) {
                    console.log(data.message);
                    throw new Error(data.message);
                }
                localStorage.setItem(this.LOCALSTORAGE_IDENTIFIER, data.token);
                return data.token;
            } catch (error) {
                console.log(error);
                throw error;
            }
        });
    }

    loginByAuth(email, password) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.URL}/v1/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        AccountID: this.payload.accountID,
                        DeviceID: this.payload.deviceID,
                    },
                    body: JSON.stringify({ email, password }),
                });
                const data = yield response.json();
                if (data && data.status && data.message) {
                    throw new Error(data.message);
                }
                localStorage.setItem(this.LOCALSTORAGE_IDENTIFIER, data.token);
                return data.token;
            } catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    registerByAuth(email, password) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.URL}/v1/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        AccountID: this.payload.accountID,
                        DeviceID: this.payload.deviceID,
                    },
                    body: JSON.stringify({ email, password }),
                });
                const data = yield response.json();
                if (data && data.status && data.message) {
                    throw new Error(data.message);
                }
                localStorage.setItem(this.LOCALSTORAGE_IDENTIFIER, data.token);
                return data.token;
            } catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    loginByGoogle() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const { token } = yield this.tab.open(
                    `${this.URL}/v1/auth/google?payload=${this.getBase64Payload(
                        {
                            type: "LOGIN",
                        }
                    )}`
                );
                localStorage.setItem(this.LOCALSTORAGE_IDENTIFIER, token);
                return token;
            } catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    registerByGoogle() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const { token } = yield this.tab.open(
                    `${this.URL}/v1/auth/google?payload=${this.getBase64Payload(
                        {
                            type: "REGISTER",
                        }
                    )}`
                );
                localStorage.setItem(this.LOCALSTORAGE_IDENTIFIER, token);
                return token;
            } catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    loginByFacebook() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const { token } = yield this.tab.open(
                    `${
                        this.URL
                    }/v1/auth/facebook?payload=${this.getBase64Payload({
                        type: "LOGIN",
                    })}`
                );
                localStorage.setItem(this.LOCALSTORAGE_IDENTIFIER, token);
                return token;
            } catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    registerByFacebook() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            try {
                const { token } = yield this.tab.open(
                    `${
                        this.URL
                    }/v1/auth/facebook?payload=${this.getBase64Payload({
                        type: "REGISTER",
                    })}`
                );
                localStorage.setItem(this.LOCALSTORAGE_IDENTIFIER, token);
                return token;
            } catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    logout() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (!this.isLoggedIn) {
                throw new Error("Uer not logged in");
            }
            const token = localStorage.getItem(this.LOCALSTORAGE_IDENTIFIER);
            const response = yield fetch(`${this.URL}/v1/profile/logout`, {
                headers: {
                    "Content-Type": "application/json",
                    AccountID: this.payload.accountID,
                    DeviceID: this.payload.deviceID,
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = yield response.json();
            if (data && data.status && data.message) {
                throw new Error(data.message);
            }
            localStorage.removeItem(this.LOCALSTORAGE_IDENTIFIER);
            return data;
        });
    }
    getProfile() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (!this.isLoggedIn) {
                throw new Error("Uer not logged in");
            }
            const token = localStorage.getItem(this.LOCALSTORAGE_IDENTIFIER);
            const response = yield fetch(`${this.URL}/v1/profile`, {
                headers: {
                    "Content-Type": "application/json",
                    AccountID: this.payload.accountID,
                    DeviceID: this.payload.deviceID,
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = yield response.json();
            if (data && data.status && data.message) {
                throw new Error(data.message);
            }
            return data;
        });
    }
    getProfileDevices() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (!this.isLoggedIn) {
                throw new Error("Uer not logged in");
            }
            const token = localStorage.getItem(this.LOCALSTORAGE_IDENTIFIER);
            const response = yield fetch(`${this.URL}/v1/profile/devices`, {
                headers: {
                    "Content-Type": "application/json",
                    AccountID: this.payload.accountID,
                    DeviceID: this.payload.deviceID,
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = yield response.json();
            if (data && data.status && data.message) {
                throw new Error(data.message);
            }
            return data;
        });
    }
    getProfileSessions() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            if (!this.isLoggedIn) {
                throw new Error("Uer not logged in");
            }
            const token = localStorage.getItem(this.LOCALSTORAGE_IDENTIFIER);
            const response = yield fetch(`${this.URL}/v1/profile/sessions`, {
                headers: {
                    "Content-Type": "application/json",
                    AccountID: this.payload.accountID,
                    DeviceID: this.payload.deviceID,
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = yield response.json();
            if (data && data.status && data.message) {
                throw new Error(data.message);
            }
            return data;
        });
    }
}
exports.default = Gatekeeper.getInstance();
