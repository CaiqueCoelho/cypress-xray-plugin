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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerClient = void 0;
const form_data_1 = __importDefault(require("form-data"));
const dedent_1 = require("../../util/dedent");
const logging_1 = require("../../util/logging");
const util_1 = require("../util");
const xray_client_1 = require("./xray-client");
let ServerClient = (() => {
    var _a;
    let _classSuper = xray_client_1.AbstractXrayClient;
    let _instanceExtraInitializers = [];
    let _getTestExecution_decorators;
    let _getTestRun_decorators;
    let _getXrayLicense_decorators;
    return _a = class ServerClient extends _classSuper {
            /**
             * Construct a new client using the provided credentials.
             *
             * @param apiBaseUrl - the base URL for all HTTP requests
             * @param credentials - the credentials to use during authentication
             * @param httpClient - the HTTP client to use for dispatching requests
             */
            constructor(apiBaseUrl, credentials, httpClient) {
                super(`${apiBaseUrl}/rest/raven/latest`, credentials, httpClient);
                __runInitializers(this, _instanceExtraInitializers);
            }
            async getTestExecution(testExecutionIssueKey, query) {
                var _b;
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Getting test execution results...");
                let currentPage = (_b = query === null || query === void 0 ? void 0 : query.page) !== null && _b !== void 0 ? _b : 1;
                let pagedTests = [];
                const allTests = [];
                do {
                    const testsResponse = await this.httpClient.get(`${this.apiBaseUrl}/api/testexec/${testExecutionIssueKey}/test`, {
                        headers: {
                            ...authorizationHeader,
                        },
                        params: {
                            detailed: query === null || query === void 0 ? void 0 : query.detailed,
                            limit: query === null || query === void 0 ? void 0 : query.limit,
                            page: currentPage,
                        },
                    });
                    allTests.push(...testsResponse.data);
                    pagedTests = testsResponse.data;
                    currentPage++;
                } while (pagedTests.length > 0);
                return allTests;
            }
            async getTestRun(id) {
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Getting test run results...");
                const response = await this.httpClient.get(`${this.apiBaseUrl}/api/testrun/${id.toString()}`, {
                    headers: {
                        ...authorizationHeader,
                    },
                });
                return response.data;
            }
            async getXrayLicense() {
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Getting Xray license status...");
                const licenseResponse = await this.httpClient.get(`${this.apiBaseUrl}/api/xraylicense`, {
                    headers: {
                        ...authorizationHeader,
                    },
                });
                return licenseResponse.data;
            }
            onRequest(event, ...args) {
                switch (event) {
                    case "import-execution-cucumber-multipart": {
                        // Cast valid because of overload.
                        const [cucumberJson, cucumberInfo] = args;
                        const resultString = JSON.stringify(cucumberJson);
                        const infoString = JSON.stringify(cucumberInfo);
                        const formData = new form_data_1.default();
                        formData.append("result", resultString, {
                            filename: "results.json",
                        });
                        formData.append("info", infoString, {
                            filename: "info.json",
                        });
                        return formData;
                    }
                    case "import-execution-multipart": {
                        // Cast valid because of overload.
                        const [executionResults, info] = args;
                        const resultString = JSON.stringify(executionResults);
                        const infoString = JSON.stringify(info);
                        const formData = new form_data_1.default();
                        formData.append("result", resultString, {
                            filename: "results.json",
                        });
                        formData.append("info", infoString, {
                            filename: "info.json",
                        });
                        return formData;
                    }
                }
            }
            onResponse(event, ...args) {
                switch (event) {
                    case "import-feature": {
                        // Cast valid because of overload.
                        const [serverResponse] = args;
                        const response = {
                            errors: [],
                            updatedOrCreatedIssues: [],
                        };
                        if (Array.isArray(serverResponse)) {
                            const issueKeys = serverResponse.map((test) => test.key);
                            response.updatedOrCreatedIssues.push(...issueKeys);
                            logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                            Successfully updated or created issues:

                              ${issueKeys.join(", ")}
                        `));
                            return response;
                        }
                        // Occurs when scenarios cause errors in Xray, e.g. typos in keywords ('Scenariot').
                        if (serverResponse.message) {
                            response.errors.push(serverResponse.message);
                            logging_1.LOG.message(logging_1.Level.DEBUG, `Encountered an error during feature file import: ${serverResponse.message}`);
                        }
                        if (serverResponse.testIssues && serverResponse.testIssues.length > 0) {
                            const testKeys = serverResponse.testIssues.map((test) => test.key);
                            response.updatedOrCreatedIssues.push(...testKeys);
                            logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                            Successfully updated or created test issues:

                              ${testKeys.join(", ")}
                        `));
                        }
                        if (serverResponse.preconditionIssues &&
                            serverResponse.preconditionIssues.length > 0) {
                            const preconditionKeys = serverResponse.preconditionIssues.map((test) => test.key);
                            response.updatedOrCreatedIssues.push(...preconditionKeys);
                            logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                            Successfully updated or created precondition issues:

                              ${preconditionKeys.join(", ")}
                        `));
                        }
                        return response;
                    }
                    case "import-execution-cucumber-multipart":
                    case "import-execution-multipart":
                    case "import-execution": {
                        // Cast valid because of overload.
                        const [serverResponse] = args;
                        return serverResponse.testExecIssue.key;
                    }
                }
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _getTestExecution_decorators = [(0, util_1.loggedRequest)({ purpose: "get test execution" })];
            _getTestRun_decorators = [(0, util_1.loggedRequest)({ purpose: "get test run" })];
            _getXrayLicense_decorators = [(0, util_1.loggedRequest)({ purpose: "get Xray license" })];
            __esDecorate(_a, null, _getTestExecution_decorators, { kind: "method", name: "getTestExecution", static: false, private: false, access: { has: obj => "getTestExecution" in obj, get: obj => obj.getTestExecution }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getTestRun_decorators, { kind: "method", name: "getTestRun", static: false, private: false, access: { has: obj => "getTestRun" in obj, get: obj => obj.getTestRun }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getXrayLicense_decorators, { kind: "method", name: "getXrayLicense", static: false, private: false, access: { has: obj => "getXrayLicense" in obj, get: obj => obj.getXrayLicense }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ServerClient = ServerClient;
