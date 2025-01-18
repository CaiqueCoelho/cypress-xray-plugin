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
exports.AbstractXrayClient = void 0;
const axios_1 = require("axios");
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const dedent_1 = require("../../util/dedent");
const errors_1 = require("../../util/errors");
const help_1 = require("../../util/help");
const logging_1 = require("../../util/logging");
const client_1 = require("../client");
const util_1 = require("../util");
/**
 * An abstract Xray client class for communicating with Xray instances.
 */
let AbstractXrayClient = (() => {
    var _a;
    let _classSuper = client_1.Client;
    let _instanceExtraInitializers = [];
    let _importExecution_decorators;
    let _importExecutionMultipart_decorators;
    let _importExecutionCucumberMultipart_decorators;
    return _a = class AbstractXrayClient extends _classSuper {
            async importExecution(execution) {
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.INFO, "Importing Cypress execution...");
                const response = await this.httpClient.post(this.getUrlImportExecution(), execution, {
                    headers: {
                        ...authorizationHeader,
                    },
                });
                const key = this.onResponse("import-execution", response.data);
                logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully uploaded test execution results to ${key}.`);
                return key;
            }
            async importExecutionMultipart(executionResults, info) {
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.INFO, "Importing Cypress execution...");
                const formData = this.onRequest("import-execution-multipart", executionResults, info);
                const response = await this.httpClient.post(this.getUrlImportExecutionMultipart(), formData, {
                    headers: {
                        ...authorizationHeader,
                        ...formData.getHeaders(),
                    },
                });
                const key = this.onResponse("import-execution-multipart", response.data);
                logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully uploaded test execution results to ${key}.`);
                return key;
            }
            async importExecutionCucumberMultipart(cucumberJson, cucumberInfo) {
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.INFO, "Importing Cucumber execution...");
                const formData = this.onRequest("import-execution-cucumber-multipart", cucumberJson, cucumberInfo);
                const response = await this.httpClient.post(this.getUrlImportExecutionCucumberMultipart(), formData, {
                    headers: {
                        ...authorizationHeader,
                        ...formData.getHeaders(),
                    },
                });
                const key = this.onResponse("import-execution-cucumber-multipart", response.data);
                logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully uploaded Cucumber test execution results to ${key}.`);
                return key;
            }
            async importFeature(file, query) {
                var _b;
                try {
                    const authorizationHeader = await this.credentials.getAuthorizationHeader();
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Importing Cucumber features...");
                    const formData = new form_data_1.default();
                    formData.append("file", fs_1.default.createReadStream(file));
                    const response = await this.httpClient.post(this.getUrlImportFeature(query.projectKey, query.projectId, query.source), formData, {
                        headers: {
                            ...authorizationHeader,
                            ...formData.getHeaders(),
                        },
                    });
                    return this.onResponse("import-feature", response.data);
                }
                catch (error) {
                    logging_1.LOG.logErrorToFile(error, "importFeatureError");
                    if ((0, axios_1.isAxiosError)(error) && ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === axios_1.HttpStatusCode.BadRequest) {
                        logging_1.LOG.message(logging_1.Level.ERROR, (0, dedent_1.dedent)(`
                        Failed to import Cucumber features: ${(0, errors_1.errorMessage)(error)}

                          The prefixes in Cucumber background or scenario tags might not be consistent with the scheme defined in Xray.

                          For more information, visit:
                          - ${help_1.HELP.plugin.configuration.cucumber.prefixes}
                    `));
                    }
                    else {
                        logging_1.LOG.message(logging_1.Level.ERROR, `Failed to import Cucumber features: ${(0, errors_1.errorMessage)(error)}`);
                    }
                    throw new errors_1.LoggedError("Feature file import failed");
                }
            }
            getUrlImportFeature(projectKey, projectId, source) {
                const query = [];
                if (projectKey) {
                    query.push(`projectKey=${projectKey}`);
                }
                if (projectId) {
                    query.push(`projectId=${projectId}`);
                }
                if (source) {
                    query.push(`source=${source}`);
                }
                return `${this.apiBaseUrl}/import/feature?${query.join("&")}`;
            }
            getUrlImportExecution() {
                return `${this.apiBaseUrl}/import/execution`;
            }
            getUrlImportExecutionCucumberMultipart() {
                return `${this.apiBaseUrl}/import/execution/cucumber/multipart`;
            }
            getUrlImportExecutionMultipart() {
                return `${this.apiBaseUrl}/import/execution/multipart`;
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _importExecution_decorators = [(0, util_1.loggedRequest)({ purpose: "import Cypress results" })];
            _importExecutionMultipart_decorators = [(0, util_1.loggedRequest)({ purpose: "import Cypress results" })];
            _importExecutionCucumberMultipart_decorators = [(0, util_1.loggedRequest)({ purpose: "import Cucumber results" })];
            __esDecorate(_a, null, _importExecution_decorators, { kind: "method", name: "importExecution", static: false, private: false, access: { has: obj => "importExecution" in obj, get: obj => obj.importExecution }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _importExecutionMultipart_decorators, { kind: "method", name: "importExecutionMultipart", static: false, private: false, access: { has: obj => "importExecutionMultipart" in obj, get: obj => obj.importExecutionMultipart }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _importExecutionCucumberMultipart_decorators, { kind: "method", name: "importExecutionCucumberMultipart", static: false, private: false, access: { has: obj => "importExecutionCucumberMultipart" in obj, get: obj => obj.importExecutionCucumberMultipart }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AbstractXrayClient = AbstractXrayClient;
