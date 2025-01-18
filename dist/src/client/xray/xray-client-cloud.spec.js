"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importStar(require("axios"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const dedent_1 = require("../../util/dedent");
const logging_1 = require("../../util/logging");
const credentials_1 = require("../authentication/credentials");
const requests_1 = require("../https/requests");
const xray_client_cloud_1 = require("./xray-client-cloud");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(xray_client_cloud_1.XrayClientCloud.name, async () => {
        let client;
        let restClient;
        (0, node_test_1.beforeEach)(() => {
            restClient = new requests_1.AxiosRestClient(axios_1.default);
            const credentials = new credentials_1.JwtCredentials("abc", "xyz", "http://localhost:1234", restClient);
            node_test_1.mock.method(credentials, "getAuthorizationHeader", () => {
                return { ["Authorization"]: "ey12345" };
            });
            client = new xray_client_cloud_1.XrayClientCloud(credentials, restClient);
        });
        await (0, node_test_1.describe)("import execution", async () => {
            await (0, node_test_1.it)("calls the correct endpoint", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            id: "12345",
                            key: "CYP-123",
                            self: "http://www.example.org/jira/rest/api/2/issue/12345",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await client.importExecution({
                    info: {
                        description: "Cypress version: 11.1.0 Browser: electron (106.0.5249.51)",
                        finishDate: "2022-11-28T17:41:19Z",
                        project: "CYP",
                        startDate: "2022-11-28T17:41:12Z",
                        summary: "Test Execution Here",
                    },
                    testExecutionKey: "CYP-42",
                    tests: [
                        {
                            finish: "2022-11-28T17:41:15Z",
                            start: "2022-11-28T17:41:15Z",
                            status: "PASSED",
                        },
                        {
                            finish: "2022-11-28T17:41:15Z",
                            start: "2022-11-28T17:41:15Z",
                            status: "PASSED",
                        },
                        {
                            finish: "2022-11-28T17:41:19Z",
                            start: "2022-11-28T17:41:15Z",
                            status: "FAILED",
                        },
                    ],
                });
                node_assert_1.default.strictEqual(post.mock.calls.length, 1);
                node_assert_1.default.strictEqual(post.mock.calls[0].arguments[0], "https://xray.cloud.getxray.app/api/v2/import/execution");
            });
            await (0, node_test_1.it)("should handle successful responses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            id: "12345",
                            key: "CYP-123",
                            self: "http://www.example.org/jira/rest/api/2/issue/12345",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.importExecution({
                    info: {
                        description: "Cypress version: 11.1.0 Browser: electron (106.0.5249.51)",
                        finishDate: "2022-11-28T17:41:19Z",
                        project: "CYP",
                        startDate: "2022-11-28T17:41:12Z",
                        summary: "Test Execution Here",
                    },
                    testExecutionKey: "CYP-42",
                    tests: [
                        {
                            finish: "2022-11-28T17:41:15Z",
                            start: "2022-11-28T17:41:15Z",
                            status: "PASSED",
                        },
                        {
                            finish: "2022-11-28T17:41:15Z",
                            start: "2022-11-28T17:41:15Z",
                            status: "PASSED",
                        },
                        {
                            finish: "2022-11-28T17:41:19Z",
                            start: "2022-11-28T17:41:15Z",
                            status: "FAILED",
                        },
                    ],
                });
                node_assert_1.default.strictEqual(response, "CYP-123");
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 400", "400", { headers: new axios_1.AxiosHeaders() }, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        error: "Must provide a project key",
                    },
                    headers: {},
                    status: 400,
                    statusText: "Bad Request",
                });
                context.mock.method(restClient, "post", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.importExecution({
                    info: {
                        description: "Cypress version: 11.1.0 Browser: electron (106.0.5249.51)",
                        finishDate: "2022-11-28T17:41:19Z",
                        startDate: "2022-11-28T17:41:12Z",
                        summary: "Test Execution Here",
                    },
                    testExecutionKey: "CYP-42",
                    tests: [
                        {
                            finish: "2022-11-28T17:41:15Z",
                            start: "2022-11-28T17:41:15Z",
                            status: "PASSED",
                        },
                    ],
                }), { message: "Failed to import Cypress results" });
                node_assert_1.default.strictEqual(message.mock.callCount(), 2);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to import Cypress results: Request failed with status code 400",
                ]);
                node_assert_1.default.strictEqual(logErrorToFile.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "importExecutionError",
                ]);
            });
        });
        await (0, node_test_1.describe)("import execution multipart", async () => {
            await (0, node_test_1.it)("calls the correct endpoint", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            id: "12345",
                            key: "CYP-123",
                            self: "http://www.example.org/jira/rest/api/2/issue/12345",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await client.importExecutionMultipart(JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionMultipartResultsCloud.json", "utf-8")), JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionMultipartInfoCloud.json", "utf-8")));
                node_assert_1.default.strictEqual(post.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(post.mock.calls[0].arguments[0], "https://xray.cloud.getxray.app/api/v2/import/execution/multipart");
            });
            await (0, node_test_1.it)("handles successful responses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            id: "12345",
                            key: "CYP-123",
                            self: "http://www.example.org/jira/rest/api/2/issue/12345",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.importExecutionMultipart(JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionMultipartResultsCloud.json", "utf-8")), JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionMultipartInfoCloud.json", "utf-8")));
                node_assert_1.default.strictEqual(response, "CYP-123");
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 400", "400", { headers: new axios_1.AxiosHeaders() }, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        error: "Error assembling issue data: project is required",
                    },
                    headers: {},
                    status: 400,
                    statusText: "Bad Request",
                });
                context.mock.method(restClient, "post", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.importExecutionMultipart(JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionMultipartResultsCloud.json", "utf-8")), JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionMultipartInfoCloud.json", "utf-8"))), { message: "Failed to import Cypress results" });
                node_assert_1.default.strictEqual(message.mock.callCount(), 2);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to import Cypress results: Request failed with status code 400",
                ]);
                node_assert_1.default.strictEqual(logErrorToFile.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "importExecutionMultipartError",
                ]);
            });
        });
        await (0, node_test_1.describe)("import execution cucumber multipart", async () => {
            await (0, node_test_1.it)("calls the correct endpoint", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            id: "12345",
                            key: "CYP-123",
                            self: "http://www.example.org/jira/rest/api/2/issue/12345",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await client.importExecutionCucumberMultipart(JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8")), JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartInfoCloud.json", "utf-8")));
                node_assert_1.default.strictEqual(post.mock.calls.length, 1);
                node_assert_1.default.strictEqual(post.mock.calls[0].arguments[0], "https://xray.cloud.getxray.app/api/v2/import/execution/cucumber/multipart");
            });
            await (0, node_test_1.it)("should handle successful responses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            id: "12345",
                            key: "CYP-123",
                            self: "http://www.example.org/jira/rest/api/2/issue/12345",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.importExecutionCucumberMultipart(JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8")), JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartInfoCloud.json", "utf-8")));
                node_assert_1.default.strictEqual(response, "CYP-123");
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 400", "400", { headers: new axios_1.AxiosHeaders() }, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        error: "There are no valid tests imported", // sic
                    },
                    headers: {},
                    status: 400,
                    statusText: "Bad Request",
                });
                context.mock.method(restClient, "post", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.importExecutionCucumberMultipart(JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8")), JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartInfoCloud.json", "utf-8"))), { message: "Failed to import Cucumber results" });
                node_assert_1.default.strictEqual(message.mock.callCount(), 2);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to import Cucumber results: Request failed with status code 400",
                ]);
                node_assert_1.default.strictEqual(logErrorToFile.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "importExecutionCucumberMultipartError",
                ]);
            });
        });
        await (0, node_test_1.describe)("import feature", async () => {
            await (0, node_test_1.it)("calls the correct endpoint", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            errors: [],
                            updatedOrCreatedPreconditions: [
                                {
                                    id: "12345",
                                    key: "CYP-222",
                                    self: "https://devxray3.atlassian.net/rest/api/2/issue/12345",
                                },
                            ],
                            updatedOrCreatedTests: [
                                {
                                    id: "32495",
                                    key: "CYP-333",
                                    self: "https://devxray3.atlassian.net/rest/api/2/issue/32495",
                                },
                                {
                                    id: "32493",
                                    key: "CYP-555",
                                    self: "https://devxray3.atlassian.net/rest/api/2/issue/32493",
                                },
                            ],
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await client.importFeature("./test/resources/features/taggedPrefixCorrect.feature", { projectKey: "CYP" });
                node_assert_1.default.strictEqual(post.mock.calls.length, 1);
                node_assert_1.default.strictEqual(post.mock.calls[0].arguments[0], "https://xray.cloud.getxray.app/api/v2/import/feature?projectKey=CYP");
            });
            await (0, node_test_1.it)("handles successful responses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            errors: [],
                            updatedOrCreatedPreconditions: [
                                {
                                    id: "12345",
                                    key: "CYP-222",
                                    self: "https://devxray3.atlassian.net/rest/api/2/issue/12345",
                                },
                            ],
                            updatedOrCreatedTests: [
                                {
                                    id: "32495",
                                    key: "CYP-333",
                                    self: "https://devxray3.atlassian.net/rest/api/2/issue/32495",
                                },
                                {
                                    id: "32493",
                                    key: "CYP-555",
                                    self: "https://devxray3.atlassian.net/rest/api/2/issue/32493",
                                },
                            ],
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.importFeature("./test/resources/features/taggedPrefixCorrect.feature", { projectKey: "CYP" });
                node_assert_1.default.deepStrictEqual(response, {
                    errors: [],
                    updatedOrCreatedIssues: ["CYP-333", "CYP-555", "CYP-222"],
                });
            });
            await (0, node_test_1.it)("handles responses with errors", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            errors: [
                                "Error in file taggedPrefixCorrect.feature: Precondition with key CYP-222 was not found!",
                                "Error in file taggedPrefixCorrect.feature: Test with key CYP-333 was not found!",
                            ],
                            updatedOrCreatedPreconditions: [],
                            updatedOrCreatedTests: [
                                {
                                    id: "32493",
                                    key: "CYP-555",
                                    self: "https://devxray3.atlassian.net/rest/api/2/issue/32493",
                                },
                            ],
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.importFeature("./test/resources/features/taggedPrefixCorrect.feature", { projectId: "abcdef1234" });
                node_assert_1.default.strictEqual(post.mock.calls[0].arguments[0], "https://xray.cloud.getxray.app/api/v2/import/feature?projectId=abcdef1234");
                node_assert_1.default.deepStrictEqual(response, {
                    errors: [
                        "Error in file taggedPrefixCorrect.feature: Precondition with key CYP-222 was not found!",
                        "Error in file taggedPrefixCorrect.feature: Test with key CYP-333 was not found!",
                    ],
                    updatedOrCreatedIssues: ["CYP-555"],
                });
                node_assert_1.default.strictEqual(message.mock.callCount(), 3);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.DEBUG,
                    (0, dedent_1.dedent)(`
                        Encountered some errors during feature file import:
                        - Error in file taggedPrefixCorrect.feature: Precondition with key CYP-222 was not found!
                        - Error in file taggedPrefixCorrect.feature: Test with key CYP-333 was not found!
                    `),
                ]);
            });
            await (0, node_test_1.it)("handles responses without any updated issues", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            errors: [
                                "Error in file taggedPrefixCorrect.feature: Precondition with key CYP-222 was not found!",
                                "Error in file taggedPrefixCorrect.feature: Test with key CYP-333 was not found!",
                                "Error in file taggedPrefixCorrect.feature: Test with key CYP-555 was not found!",
                            ],
                            updatedOrCreatedPreconditions: [],
                            updatedOrCreatedTests: [],
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.importFeature("./test/resources/features/taggedPrefixCorrect.feature", { source: "CYP" });
                node_assert_1.default.strictEqual(post.mock.calls[0].arguments[0], "https://xray.cloud.getxray.app/api/v2/import/feature?source=CYP");
                node_assert_1.default.deepStrictEqual(response, {
                    errors: [
                        "Error in file taggedPrefixCorrect.feature: Precondition with key CYP-222 was not found!",
                        "Error in file taggedPrefixCorrect.feature: Test with key CYP-333 was not found!",
                        "Error in file taggedPrefixCorrect.feature: Test with key CYP-555 was not found!",
                    ],
                    updatedOrCreatedIssues: [],
                });
                node_assert_1.default.strictEqual(message.mock.callCount(), 2);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.DEBUG,
                    (0, dedent_1.dedent)(`
                        Encountered some errors during feature file import:
                        - Error in file taggedPrefixCorrect.feature: Precondition with key CYP-222 was not found!
                        - Error in file taggedPrefixCorrect.feature: Test with key CYP-333 was not found!
                        - Error in file taggedPrefixCorrect.feature: Test with key CYP-555 was not found!
                    `),
                ]);
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 400", "400", { headers: new axios_1.AxiosHeaders() }, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        error: "There are no valid tests imported", // sic
                    },
                    headers: {},
                    status: 400,
                    statusText: "Bad Request",
                });
                context.mock.method(restClient, "post", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.importFeature("./test/resources/features/taggedPrefixCorrect.feature", {
                    projectKey: "CYP",
                }), { message: "Feature file import failed" });
                node_assert_1.default.strictEqual(message.mock.callCount(), 2);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        Failed to import Cucumber features: Request failed with status code 400

                          The prefixes in Cucumber background or scenario tags might not be consistent with the scheme defined in Xray.

                          For more information, visit:
                          - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                    `),
                ]);
                node_assert_1.default.strictEqual(logErrorToFile.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "importFeatureError",
                ]);
            });
            await (0, node_test_1.it)("handles network failures", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new Error("Connection timeout");
                context.mock.method(restClient, "post", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.importFeature("./test/resources/features/taggedPrefixCorrect.feature", {
                    projectKey: "CYP",
                }), { message: "Feature file import failed" });
                node_assert_1.default.strictEqual(message.mock.callCount(), 2);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to import Cucumber features: Connection timeout",
                ]);
                node_assert_1.default.strictEqual(logErrorToFile.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "importFeatureError",
                ]);
            });
        });
        await (0, node_test_1.describe)("get test types", async () => {
            await (0, node_test_1.it)("calls the correct endpoint", async (context) => {
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/responses/getTestsTypes.json", "utf-8")),
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await client.getTestTypes("CYP", "CYP-330", "CYP-331", "CYP-332", "CYP-337");
                node_assert_1.default.strictEqual(post.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(post.mock.calls[0].arguments[0], "https://xray.cloud.getxray.app/api/v2/graphql");
                node_assert_1.default.deepStrictEqual(post.mock.calls[0].arguments[1], {
                    query: (0, dedent_1.dedent)(`
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
                        }`),
                    variables: {
                        jql: "project = 'CYP' AND issue in (CYP-330,CYP-331,CYP-332,CYP-337)",
                        limit: 100,
                        start: 0,
                    },
                });
            });
            await (0, node_test_1.it)("should handle successful responses", async (context) => {
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/responses/getTestsTypes.json", "utf-8")),
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.getTestTypes("CYP", "CYP-330", "CYP-331", "CYP-332", "CYP-337");
                node_assert_1.default.deepStrictEqual(response, {
                    ["CYP-330"]: "Generic",
                    ["CYP-331"]: "Cucumber",
                    ["CYP-332"]: "Manual",
                    ["CYP-337"]: "Manual",
                });
            });
            await (0, node_test_1.it)("should paginate big requests", async (context) => {
                const mockedData = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/responses/getTestsTypes.json", "utf-8"));
                let i = 0;
                context.mock.method(restClient, "post", () => {
                    var _a, _b, _c, _d, _e, _f;
                    switch (i++) {
                        case 0:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTests: {
                                            ...mockedData.data.getTests,
                                            results: (_a = mockedData.data.getTests.results) === null || _a === void 0 ? void 0 : _a.slice(0, 1),
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 1:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTests: {
                                            ...mockedData.data.getTests,
                                            results: (_b = mockedData.data.getTests.results) === null || _b === void 0 ? void 0 : _b.slice(1, 2),
                                            start: 1,
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 2:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTests: {
                                            ...mockedData.data.getTests,
                                            results: (_c = mockedData.data.getTests.results) === null || _c === void 0 ? void 0 : _c.slice(2, 3),
                                            start: 2,
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 3:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTests: {
                                            start: 3,
                                            total: 5,
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 4:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTests: {
                                            ...mockedData.data.getTests,
                                            results: (_d = mockedData.data.getTests.results) === null || _d === void 0 ? void 0 : _d.slice(3, 4),
                                            start: undefined,
                                            total: undefined,
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 5:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTests: {
                                            ...mockedData.data.getTests,
                                            results: (_e = mockedData.data.getTests.results) === null || _e === void 0 ? void 0 : _e.slice(3, 4),
                                            start: 3,
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 6:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTests: {
                                            ...mockedData.data.getTests,
                                            results: (_f = mockedData.data.getTests.results) === null || _f === void 0 ? void 0 : _f.slice(4, 5),
                                            start: 4,
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                    }
                });
                const response = await client.getTestTypes("CYP", "CYP-330", "CYP-331", "CYP-332", "CYP-337", "CYP-339");
                node_assert_1.default.deepStrictEqual(response, {
                    ["CYP-330"]: "Generic",
                    ["CYP-331"]: "Cucumber",
                    ["CYP-332"]: "Manual",
                    ["CYP-337"]: "Manual",
                });
            });
            await (0, node_test_1.it)("should handle bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 400", "400", { headers: new axios_1.AxiosHeaders() }, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        error: "Must provide a project key",
                    },
                    headers: {},
                    status: 400,
                    statusText: "Bad Request",
                });
                context.mock.method(restClient, "post", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.getTestTypes("CYP", "CYP-330", "CYP-331", "CYP-332"), {
                    message: "Failed to get test types",
                });
                node_assert_1.default.strictEqual(message.mock.callCount(), 2);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to get test types: Request failed with status code 400",
                ]);
                node_assert_1.default.strictEqual(logErrorToFile.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "getTestTypesError",
                ]);
            });
        });
        await (0, node_test_1.describe)("get test results", async () => {
            await (0, node_test_1.it)("calls the correct endpoint", async (context) => {
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            data: {
                                getTestExecution: {
                                    tests: {
                                        limit: 10,
                                        results: [
                                            {
                                                issueId: "12345",
                                                jira: {
                                                    key: "CYP-123",
                                                    summary: "included cucumber test",
                                                },
                                                status: {
                                                    color: "#95C160",
                                                    description: "The test run has passed",
                                                    final: true,
                                                    name: "PASSED",
                                                },
                                            },
                                            {
                                                issueId: "98765",
                                                jira: {
                                                    key: "CYP-456",
                                                    summary: "skipped cucumber test",
                                                },
                                                status: {
                                                    color: "#afa30b",
                                                    description: "A custom skipped status for development purposes",
                                                    final: true,
                                                    name: "SKIPPED",
                                                },
                                            },
                                        ],
                                        start: 0,
                                        total: 2,
                                    },
                                },
                            },
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await client.getTestResults("13436");
                node_assert_1.default.strictEqual(post.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(post.mock.calls[0].arguments[0], "https://xray.cloud.getxray.app/api/v2/graphql");
                node_assert_1.default.deepStrictEqual(post.mock.calls[0].arguments[1], {
                    query: (0, dedent_1.dedent)(`
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
                        }`),
                    variables: { issueId: "13436", limit: 100, start: 0 },
                });
            });
            await (0, node_test_1.it)("handles successful responses", async (context) => {
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            data: {
                                getTestExecution: {
                                    tests: {
                                        limit: 10,
                                        results: [
                                            {
                                                issueId: "12345",
                                                jira: {
                                                    key: "CYP-123",
                                                    summary: "included cucumber test",
                                                },
                                                status: {
                                                    color: "#95C160",
                                                    description: "The test run has passed",
                                                    final: true,
                                                    name: "PASSED",
                                                },
                                            },
                                            {
                                                issueId: "98765",
                                                jira: {
                                                    key: "CYP-456",
                                                    summary: "skipped cucumber test",
                                                },
                                                status: {
                                                    color: "#afa30b",
                                                    description: "A custom skipped status for development purposes",
                                                    final: true,
                                                    name: "SKIPPED",
                                                },
                                            },
                                        ],
                                        start: 0,
                                        total: 2,
                                    },
                                },
                            },
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.getTestResults("13436");
                node_assert_1.default.deepStrictEqual(response, [
                    {
                        issueId: "12345",
                        jira: {
                            key: "CYP-123",
                            summary: "included cucumber test",
                        },
                        status: {
                            color: "#95C160",
                            description: "The test run has passed",
                            final: true,
                            name: "PASSED",
                        },
                    },
                    {
                        issueId: "98765",
                        jira: {
                            key: "CYP-456",
                            summary: "skipped cucumber test",
                        },
                        status: {
                            color: "#afa30b",
                            description: "A custom skipped status for development purposes",
                            final: true,
                            name: "SKIPPED",
                        },
                    },
                ]);
            });
            await (0, node_test_1.it)("should paginate big requests", async (context) => {
                let i = 0;
                context.mock.method(restClient, "post", () => {
                    switch (i++) {
                        case 0:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTestExecution: {
                                            tests: {
                                                limit: 1,
                                                results: [
                                                    {
                                                        issueId: "12345",
                                                        jira: {
                                                            key: "CYP-123",
                                                            summary: "included cucumber test",
                                                        },
                                                        status: {
                                                            color: "#95C160",
                                                            description: "The test run has passed",
                                                            final: true,
                                                            name: "PASSED",
                                                        },
                                                    },
                                                ],
                                                start: 0,
                                                total: 3,
                                            },
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 1:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTestExecution: {
                                            tests: {
                                                limit: 1,
                                                results: [
                                                    {
                                                        issueId: "98765",
                                                        jira: {
                                                            key: "CYP-456",
                                                            summary: "skipped cucumber test",
                                                        },
                                                        status: {
                                                            color: "#afa30b",
                                                            description: "A custom skipped status for development purposes",
                                                            final: true,
                                                            name: "SKIPPED",
                                                        },
                                                    },
                                                ],
                                                start: 1,
                                                total: 3,
                                            },
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 2:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTestExecution: {
                                            tests: {
                                                limit: 1,
                                                results: [
                                                    {
                                                        issueId: "54321",
                                                        jira: {
                                                            key: "CYP-111",
                                                            summary: "bonjour what's up",
                                                        },
                                                        status: {
                                                            color: "#95C160",
                                                            description: "The test run has passed",
                                                            final: true,
                                                            name: "PASSED",
                                                        },
                                                    },
                                                ],
                                                start: 2,
                                                total: 4,
                                            },
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 3:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTestExecution: {
                                            tests: {
                                                limit: 1,
                                                start: 2,
                                            },
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 4:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: {
                                    data: {
                                        getTestExecution: {
                                            tests: {
                                                limit: 1,
                                                results: [
                                                    {
                                                        issueId: "00000",
                                                        jira: {
                                                            key: "CYP-000",
                                                            summary: "missing status",
                                                        },
                                                    },
                                                ],
                                                start: "7",
                                                total: 3,
                                            },
                                        },
                                    },
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                    }
                });
                const response = await client.getTestResults("11111");
                node_assert_1.default.deepStrictEqual(response, [
                    {
                        issueId: "12345",
                        jira: {
                            key: "CYP-123",
                            summary: "included cucumber test",
                        },
                        status: {
                            color: "#95C160",
                            description: "The test run has passed",
                            final: true,
                            name: "PASSED",
                        },
                    },
                    {
                        issueId: "98765",
                        jira: {
                            key: "CYP-456",
                            summary: "skipped cucumber test",
                        },
                        status: {
                            color: "#afa30b",
                            description: "A custom skipped status for development purposes",
                            final: true,
                            name: "SKIPPED",
                        },
                    },
                    {
                        issueId: "54321",
                        jira: {
                            key: "CYP-111",
                            summary: "bonjour what's up",
                        },
                        status: {
                            color: "#95C160",
                            description: "The test run has passed",
                            final: true,
                            name: "PASSED",
                        },
                    },
                ]);
            });
            await (0, node_test_1.it)("should handle bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 400", "400", { headers: new axios_1.AxiosHeaders() }, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        error: "Must provide a project key",
                    },
                    headers: {},
                    status: 400,
                    statusText: "Bad Request",
                });
                context.mock.method(restClient, "post", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.getTestResults("13436"), {
                    message: "Failed to get test results",
                });
                node_assert_1.default.strictEqual(message.mock.callCount(), 2);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to get test results: Request failed with status code 400",
                ]);
                node_assert_1.default.strictEqual(logErrorToFile.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "getTestResultsError",
                ]);
            });
        });
    });
});
