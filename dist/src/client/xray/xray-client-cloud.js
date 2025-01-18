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
exports.XrayClientCloud = void 0;
const form_data_1 = __importDefault(require("form-data"));
const dedent_1 = require("../../util/dedent");
const logging_1 = require("../../util/logging");
const util_1 = require("../util");
const xray_client_1 = require("./xray-client");
let XrayClientCloud = (() => {
    var _a;
    let _classSuper = xray_client_1.AbstractXrayClient;
    let _instanceExtraInitializers = [];
    let _getTestResults_decorators;
    let _getTestRunResults_decorators;
    let _getTestTypes_decorators;
    return _a = class XrayClientCloud extends _classSuper {
            /**
             * Construct a new Xray cloud client using the provided credentials.
             *
             * @param credentials - the credentials to use during authentication
             * @param httpClient - the HTTP client to use for dispatching requests
             */
            constructor(credentials, httpClient) {
                super(_a.URL, credentials, httpClient);
                __runInitializers(this, _instanceExtraInitializers);
            }
            async getTestResults(issueId) {
                var _b, _c, _d, _e;
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Retrieving test results...");
                const tests = [];
                let total = 0;
                let start = 0;
                const query = (0, dedent_1.dedent)(`
            query($issueId: String, $start: Int!, $limit: Int!) {
                getTestExecution(issueId: $issueId) {
                    tests(start: $start, limit: $limit) {
                        total
                        start
                        limit
                        results {
                            issueId
                            status {
                                name
                            }
                            jira(fields: ["key", "summary"])
                        }
                    }
                }
            }
        `);
                do {
                    const paginatedRequest = {
                        query: query,
                        variables: {
                            issueId: issueId,
                            limit: _a.GRAPHQL_LIMIT,
                            start: start,
                        },
                    };
                    const response = await this.httpClient.post(_a.URL_GRAPHQL, paginatedRequest, {
                        headers: {
                            ...authorizationHeader,
                        },
                    });
                    const data = response.data.data.getTestExecution;
                    total = (_c = (_b = data.tests) === null || _b === void 0 ? void 0 : _b.total) !== null && _c !== void 0 ? _c : total;
                    if ((_d = data.tests) === null || _d === void 0 ? void 0 : _d.results) {
                        if (typeof data.tests.start === "number") {
                            start = data.tests.start + data.tests.results.length;
                        }
                        for (const test of data.tests.results) {
                            if ((_e = test.status) === null || _e === void 0 ? void 0 : _e.name) {
                                tests.push(test);
                            }
                        }
                    }
                } while (start && start < total);
                logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully retrieved test results for test execution issue: ${issueId}`);
                return tests;
            }
            async getTestRunResults(options) {
                var _b;
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Retrieving test run results...");
                const runResults = [];
                let total = 0;
                let start = 0;
                const query = (0, dedent_1.dedent)(`
            query($testIssueIds: [String], $testExecIssueIds: [String], $start: Int!, $limit: Int!) {
                getTestRuns( testIssueIds: $testIssueIds, testExecIssueIds: $testExecIssueIds, limit: $limit, start: $start) {
                    total
                    limit
                    start
                    results {
                        status {
                            name
                        }
                        test {
                            jira(fields: ["key"])
                        }
                        evidence {
                            filename
                            downloadLink
                        }
                        iterations(limit: $limit) {
                            results {
                                parameters {
                                    name
                                    value
                                }
                                status {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        `);
                do {
                    const paginatedRequest = {
                        query: query,
                        variables: {
                            limit: _a.GRAPHQL_LIMIT,
                            start: start,
                            testExecIssueIds: options.testExecIssueIds,
                            testIssueIds: options.testIssueIds,
                        },
                    };
                    const response = await this.httpClient.post(_a.URL_GRAPHQL, paginatedRequest, {
                        headers: {
                            ...authorizationHeader,
                        },
                    });
                    const data = response.data.data.getTestRuns;
                    total = (_b = data === null || data === void 0 ? void 0 : data.total) !== null && _b !== void 0 ? _b : total;
                    if (data === null || data === void 0 ? void 0 : data.results) {
                        if (typeof data.start === "number") {
                            start = data.start + data.results.length;
                        }
                        for (const test of data.results) {
                            runResults.push(test);
                        }
                    }
                } while (start && start < total);
                logging_1.LOG.message(logging_1.Level.DEBUG, "Successfully retrieved test run results");
                return runResults;
            }
            async getTestTypes(projectKey, ...issueKeys) {
                var _b, _c;
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Retrieving test types...");
                const types = {};
                let total = 0;
                let start = 0;
                const query = (0, dedent_1.dedent)(`
            query($jql: String, $start: Int!, $limit: Int!) {
                getTests(jql: $jql, start: $start, limit: $limit) {
                    total
                    start
                    results {
                        testType {
                            name
                            kind
                        }
                        jira(fields: ["key"])
                    }
                }
            }
        `);
                do {
                    const paginatedRequest = {
                        query: query,
                        variables: {
                            jql: `project = '${projectKey}' AND issue in (${issueKeys.join(",")})`,
                            limit: _a.GRAPHQL_LIMIT,
                            start: start,
                        },
                    };
                    const response = await this.httpClient.post(_a.URL_GRAPHQL, paginatedRequest, {
                        headers: {
                            ...authorizationHeader,
                        },
                    });
                    total = (_b = response.data.data.getTests.total) !== null && _b !== void 0 ? _b : total;
                    if (response.data.data.getTests.results) {
                        if (typeof response.data.data.getTests.start === "number") {
                            start =
                                response.data.data.getTests.start +
                                    response.data.data.getTests.results.length;
                        }
                        for (const test of response.data.data.getTests.results) {
                            if (test.jira.key && ((_c = test.testType) === null || _c === void 0 ? void 0 : _c.name)) {
                                types[test.jira.key] = test.testType.name;
                            }
                        }
                    }
                } while (start && start < total);
                logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully retrieved test types for ${issueKeys.length.toString()} issues.`);
                return types;
            }
            onRequest(event, ...args) {
                switch (event) {
                    case "import-execution-cucumber-multipart": {
                        // Cast valid because of overload.
                        const [cucumberJson, cucumberInfo] = args;
                        const resultString = JSON.stringify(cucumberJson);
                        const infoString = JSON.stringify(cucumberInfo);
                        const formData = new form_data_1.default();
                        formData.append("results", resultString, {
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
                        formData.append("results", resultString, {
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
                        const [cloudResponse] = args;
                        const response = {
                            errors: [],
                            updatedOrCreatedIssues: [],
                        };
                        if (cloudResponse.errors.length > 0) {
                            response.errors.push(...cloudResponse.errors);
                            logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                            Encountered some errors during feature file import:
                            ${cloudResponse.errors.map((error) => `- ${error}`).join("\n")}
                        `));
                        }
                        if (cloudResponse.updatedOrCreatedTests.length > 0) {
                            const testKeys = cloudResponse.updatedOrCreatedTests.map((test) => test.key);
                            response.updatedOrCreatedIssues.push(...testKeys);
                            logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                            Successfully updated or created test issues:

                              ${testKeys.join("\n")}
                        `));
                        }
                        if (cloudResponse.updatedOrCreatedPreconditions.length > 0) {
                            const preconditionKeys = cloudResponse.updatedOrCreatedPreconditions.map((test) => test.key);
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
                        const [cloudResponse] = args;
                        return cloudResponse.key;
                    }
                }
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _getTestResults_decorators = [(0, util_1.loggedRequest)({ purpose: "get test results" })];
            _getTestRunResults_decorators = [(0, util_1.loggedRequest)({ purpose: "get test run results" })];
            _getTestTypes_decorators = [(0, util_1.loggedRequest)({ purpose: "get test types" })];
            __esDecorate(_a, null, _getTestResults_decorators, { kind: "method", name: "getTestResults", static: false, private: false, access: { has: obj => "getTestResults" in obj, get: obj => obj.getTestResults }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getTestRunResults_decorators, { kind: "method", name: "getTestRunResults", static: false, private: false, access: { has: obj => "getTestRunResults" in obj, get: obj => obj.getTestRunResults }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getTestTypes_decorators, { kind: "method", name: "getTestTypes", static: false, private: false, access: { has: obj => "getTestTypes" in obj, get: obj => obj.getTestTypes }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        /**
         * The URLs of Xray's Cloud API.
         * Note: API v1 would also work, but let's stick to the more recent one.
         */
        _a.URL = "https://xray.cloud.getxray.app/api/v2",
        _a.URL_GRAPHQL = `${_a.URL}/graphql`,
        _a.GRAPHQL_LIMIT = 100,
        _a;
})();
exports.XrayClientCloud = XrayClientCloud;
