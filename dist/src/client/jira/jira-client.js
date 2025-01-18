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
exports.BaseJiraClient = void 0;
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const dedent_1 = require("../../util/dedent");
const logging_1 = require("../../util/logging");
const client_1 = require("../client");
const util_1 = require("../util");
/**
 * A Jira client class for communicating with Jira instances.
 */
let BaseJiraClient = (() => {
    var _a;
    let _classSuper = client_1.Client;
    let _instanceExtraInitializers = [];
    let _addAttachment_decorators;
    let _getIssueTypes_decorators;
    let _getFields_decorators;
    let _getMyself_decorators;
    let _search_decorators;
    let _editIssue_decorators;
    let _transitionIssue_decorators;
    return _a = class BaseJiraClient extends _classSuper {
            async addAttachment(issueIdOrKey, ...files) {
                if (files.length === 0) {
                    logging_1.LOG.message(logging_1.Level.WARNING, `No files provided to attach to issue ${issueIdOrKey}. Skipping attaching.`);
                    return [];
                }
                const form = new form_data_1.default();
                let filesIncluded = 0;
                files.forEach((file) => {
                    if (!fs_1.default.existsSync(file)) {
                        logging_1.LOG.message(logging_1.Level.WARNING, "File does not exist:", file);
                        return;
                    }
                    filesIncluded++;
                    const fileContent = fs_1.default.createReadStream(file);
                    form.append("file", fileContent);
                });
                if (filesIncluded === 0) {
                    logging_1.LOG.message(logging_1.Level.WARNING, "All files do not exist. Skipping attaching.");
                    return [];
                }
                const header = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Attaching files:", ...files);
                const response = await this.httpClient.post(`${this.apiBaseUrl}/rest/api/latest/issue/${issueIdOrKey}/attachments`, form, {
                    headers: {
                        ...header,
                        ...form.getHeaders(),
                        ["X-Atlassian-Token"]: "no-check",
                    },
                });
                logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                Successfully attached the following files to issue ${issueIdOrKey}:

                  ${response.data.map((attachment) => attachment.filename).join("\n")}
            `));
                return response.data;
            }
            async getIssueTypes() {
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Getting issue types...");
                const response = await this.httpClient.get(`${this.apiBaseUrl}/rest/api/latest/issuetype`, {
                    headers: {
                        ...authorizationHeader,
                    },
                });
                logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully retrieved data for ${response.data.length.toString()} issue types.`);
                logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                Received data for issue types:

                  ${response.data
                    .map((issueType) => {
                    if (issueType.name) {
                        if (issueType.id) {
                            return `${issueType.name} (id: ${issueType.id})`;
                        }
                        return `${issueType.name} (id: undefined)`;
                    }
                    else if (issueType.id) {
                        return `undefined (id: ${issueType.id})`;
                    }
                    return "undefined (id: undefined)";
                })
                    .join("\n")}
            `));
                return response.data;
            }
            async getFields() {
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Getting fields...");
                const response = await this.httpClient.get(`${this.apiBaseUrl}/rest/api/latest/field`, {
                    headers: {
                        ...authorizationHeader,
                    },
                });
                logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully retrieved data for ${response.data.length.toString()} fields.`);
                logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                Received data for fields:

                  ${response.data.map((field) => `${field.name} (id: ${field.id})`).join("\n")}
            `));
                return response.data;
            }
            async getMyself() {
                const authorizationHeader = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Getting user details...");
                const response = await this.httpClient.get(`${this.apiBaseUrl}/rest/api/latest/myself`, {
                    headers: {
                        ...authorizationHeader,
                    },
                });
                logging_1.LOG.message(logging_1.Level.DEBUG, "Successfully retrieved user details.");
                return response.data;
            }
            async search(request) {
                var _b, _c;
                const header = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Searching issues...");
                let total = 0;
                let startAt = (_b = request.startAt) !== null && _b !== void 0 ? _b : 0;
                const results = {};
                do {
                    const paginatedRequest = {
                        ...request,
                        startAt: startAt,
                    };
                    const response = await this.httpClient.post(`${this.apiBaseUrl}/rest/api/latest/search`, paginatedRequest, {
                        headers: {
                            ...header,
                        },
                    });
                    total = (_c = response.data.total) !== null && _c !== void 0 ? _c : total;
                    if (response.data.issues) {
                        for (const issue of response.data.issues) {
                            if (issue.key) {
                                results[issue.key] = issue;
                            }
                        }
                        // Explicit check because it could also be 0.
                        if (typeof response.data.startAt === "number") {
                            startAt = response.data.startAt + response.data.issues.length;
                        }
                    }
                } while (startAt && startAt < total);
                logging_1.LOG.message(logging_1.Level.DEBUG, `Found ${total.toString()} issues`);
                return Object.values(results);
            }
            async editIssue(issueIdOrKey, issueUpdateData) {
                const header = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Editing issue...");
                await this.httpClient.put(`${this.apiBaseUrl}/rest/api/latest/issue/${issueIdOrKey}`, issueUpdateData, {
                    headers: {
                        ...header,
                    },
                });
                logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully edited issue: ${issueIdOrKey}`);
                return issueIdOrKey;
            }
            async transitionIssue(issueIdOrKey, issueUpdateData) {
                const header = await this.credentials.getAuthorizationHeader();
                logging_1.LOG.message(logging_1.Level.DEBUG, "Transitioning issue...");
                await this.httpClient.post(`${this.apiBaseUrl}/rest/api/latest/issue/${issueIdOrKey}/transitions`, issueUpdateData, {
                    headers: {
                        ...header,
                    },
                });
                logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully transitioned issue: ${issueIdOrKey}`);
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _addAttachment_decorators = [(0, util_1.loggedRequest)({ purpose: "attach files" })];
            _getIssueTypes_decorators = [(0, util_1.loggedRequest)({ purpose: "get issue types" })];
            _getFields_decorators = [(0, util_1.loggedRequest)({ purpose: "get fields" })];
            _getMyself_decorators = [(0, util_1.loggedRequest)({ purpose: "get user details" })];
            _search_decorators = [(0, util_1.loggedRequest)({ purpose: "search issues" })];
            _editIssue_decorators = [(0, util_1.loggedRequest)({ purpose: "edit issue" })];
            _transitionIssue_decorators = [(0, util_1.loggedRequest)({ purpose: "transition issue" })];
            __esDecorate(_a, null, _addAttachment_decorators, { kind: "method", name: "addAttachment", static: false, private: false, access: { has: obj => "addAttachment" in obj, get: obj => obj.addAttachment }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getIssueTypes_decorators, { kind: "method", name: "getIssueTypes", static: false, private: false, access: { has: obj => "getIssueTypes" in obj, get: obj => obj.getIssueTypes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getFields_decorators, { kind: "method", name: "getFields", static: false, private: false, access: { has: obj => "getFields" in obj, get: obj => obj.getFields }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getMyself_decorators, { kind: "method", name: "getMyself", static: false, private: false, access: { has: obj => "getMyself" in obj, get: obj => obj.getMyself }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _search_decorators, { kind: "method", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _editIssue_decorators, { kind: "method", name: "editIssue", static: false, private: false, access: { has: obj => "editIssue" in obj, get: obj => obj.editIssue }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _transitionIssue_decorators, { kind: "method", name: "transitionIssue", static: false, private: false, access: { has: obj => "transitionIssue" in obj, get: obj => obj.transitionIssue }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BaseJiraClient = BaseJiraClient;
