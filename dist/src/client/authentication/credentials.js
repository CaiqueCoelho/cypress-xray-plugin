"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtCredentials = exports.PatCredentials = exports.BasicAuthCredentials = void 0;
const base64_1 = require("../../util/base64");
const logging_1 = require("../../util/logging");
const util_1 = require("../util");
/**
 * A basic authorization credentials class, storing base64 encoded credentials of usernames and
 * passwords.
 */
class BasicAuthCredentials {
    /**
     * Constructs new basic authorization credentials.
     *
     * @param username - the username
     * @param password - the password
     */
    constructor(username, password) {
        // See: https://developer.atlassian.com/server/jira/platform/basic-authentication/#construct-the-authorization-header
        this.encodedCredentials = (0, base64_1.encode)(`${username}:${password}`);
    }
    getAuthorizationHeader() {
        return {
            ["Authorization"]: `Basic ${this.encodedCredentials}`,
        };
    }
}
exports.BasicAuthCredentials = BasicAuthCredentials;
/**
 * A personal access token (_PAT_) credentials class, storing a secret token to use during HTTP
 * authorization.
 */
class PatCredentials {
    /**
     * Constructs new PAT credentials from the provided token.
     *
     * @param token - the token
     */
    constructor(token) {
        this.token = token;
    }
    getAuthorizationHeader() {
        return {
            ["Authorization"]: `Bearer ${this.token}`,
        };
    }
}
exports.PatCredentials = PatCredentials;
/**
 * A JWT credentials class, storing a JWT token to use during HTTP authorization. The class is
 * designed to retrieve fresh JWT tokens from an authentication URL/endpoint. Once retrieved, the
 * token will be stored and reused whenever necessary.
 */
let JwtCredentials = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _fetchToken_decorators;
    return _a = class JwtCredentials {
            /**
             * Constructs new JWT credentials. The client ID and client secret will be used to retrieve a
             * JWT token from the authentication URL on demand.
             *
             * @param clientId - the client ID
             * @param clientSecret - the client secret
             * @param authenticationUrl - the authentication URL/token endpoint
             * @param httpClient - the HTTP client to use for fetching the token
             */
            constructor(clientId, clientSecret, authenticationUrl, httpClient) {
                this.token = __runInitializers(this, _instanceExtraInitializers);
                this.token = undefined;
                this.clientId = clientId;
                this.clientSecret = clientSecret;
                this.authenticationUrl = authenticationUrl;
                this.httpClient = httpClient;
            }
            async fetchToken() {
                logging_1.LOG.message(logging_1.Level.INFO, `Authenticating to: ${this.authenticationUrl}...`);
                const response = await this.httpClient.post(this.authenticationUrl, {
                    ["client_id"]: this.clientId,
                    ["client_secret"]: this.clientSecret,
                });
                // A JWT token is expected: https://stackoverflow.com/a/74325712
                const jwtRegex = /^[A-Za-z0-9_-]{2,}(?:\.[A-Za-z0-9_-]{2,}){2}$/;
                if (jwtRegex.test(response.data)) {
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Authentication successful");
                    return response.data;
                }
                else {
                    throw new Error("Expected to receive a JWT token, but did not");
                }
            }
            async getAuthorizationHeader() {
                if (!this.token) {
                    this.token = this.fetchToken();
                }
                return {
                    ["Authorization"]: `Bearer ${await this.token}`,
                };
            }
            /**
             * Return the URL to authenticate to.
             *
             * @returns the URL
             */
            getAuthenticationUrl() {
                return this.authenticationUrl;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fetchToken_decorators = [(0, util_1.loggedRequest)({ purpose: "authenticate" })];
            __esDecorate(_a, null, _fetchToken_decorators, { kind: "method", name: "fetchToken", static: false, private: false, access: { has: obj => "fetchToken" in obj, get: obj => obj.fetchToken }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.JwtCredentials = JwtCredentials;
