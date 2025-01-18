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
const xray_client_server_1 = require("./xray-client-server");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(xray_client_server_1.ServerClient.name, async () => {
        let client;
        let restClient;
        (0, node_test_1.beforeEach)(() => {
            restClient = new requests_1.AxiosRestClient(axios_1.default);
            client = new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), restClient);
        });
        await (0, node_test_1.describe)("import execution", async () => {
            await (0, node_test_1.it)("calls the correct endpoint", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            testExecIssue: {
                                id: "12345",
                                key: "CYP-123",
                                self: "http://www.example.org/jira/rest/api/2/issue/12345",
                            },
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
                node_assert_1.default.strictEqual(post.mock.calls[0].arguments[0], "http://localhost:1234/rest/raven/latest/import/execution");
            });
            await (0, node_test_1.it)("should handle successful responses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            testExecIssue: {
                                id: "12345",
                                key: "CYP-123",
                                self: "http://www.example.org/jira/rest/api/2/issue/12345",
                            },
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
        });
        await (0, node_test_1.describe)("import execution multipart", async () => {
            await (0, node_test_1.it)("calls the correct endpoint", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            testExecIssue: {
                                id: "12345",
                                key: "CYP-123",
                                self: "http://www.example.org/jira/rest/api/2/issue/12345",
                            },
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await client.importExecutionMultipart(JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionMultipartResultsServer.json", "utf-8")), JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionMultipartInfoServer.json", "utf-8")));
                node_assert_1.default.strictEqual(post.mock.calls.length, 1);
                node_assert_1.default.strictEqual(post.mock.calls[0].arguments[0], "http://localhost:1234/rest/raven/latest/import/execution/multipart");
            });
            await (0, node_test_1.it)("handles successful responses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            infoMessages: [],
                            testExecIssue: {
                                id: "24556",
                                key: "CYPLUG-123",
                                self: "http://localhost:1234/rest/api/2/issue/24556",
                            },
                            testIssues: {
                                success: [
                                    {
                                        id: "22979",
                                        key: "CYPLUG-43",
                                        self: "http://localhost:1234/rest/api/2/issue/22979",
                                        testVersionId: 430,
                                    },
                                    {
                                        id: "22946",
                                        key: "CYPLUG-10",
                                        self: "http://localhost:1234/rest/api/2/issue/22946",
                                        testVersionId: 425,
                                    },
                                ],
                            },
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.importExecutionMultipart(JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionMultipartResultsServer.json", "utf-8")), JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionMultipartInfoServer.json", "utf-8")));
                node_assert_1.default.strictEqual(response, "CYPLUG-123");
            });
        });
        await (0, node_test_1.describe)("import execution cucumber multipart", async () => {
            await (0, node_test_1.it)("calls the correct endpoint", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            testExecIssue: {
                                id: "12345",
                                key: "CYP-123",
                                self: "http://www.example.org/jira/rest/api/2/issue/12345",
                            },
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await client.importExecutionCucumberMultipart(JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartServer.json", "utf-8")), JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartInfoServer.json", "utf-8")));
                node_assert_1.default.strictEqual(post.mock.calls.length, 1);
                node_assert_1.default.strictEqual(post.mock.calls[0].arguments[0], "http://localhost:1234/rest/raven/latest/import/execution/cucumber/multipart");
            });
            await (0, node_test_1.it)("should handle successful responses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            testExecIssue: {
                                id: "12345",
                                key: "CYP-123",
                                self: "http://www.example.org/jira/rest/api/2/issue/12345",
                            },
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.importExecutionCucumberMultipart(JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartServer.json", "utf-8")), JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartInfoServer.json", "utf-8")));
                node_assert_1.default.strictEqual(response, "CYP-123");
            });
        });
        await (0, node_test_1.describe)("import feature", async () => {
            await (0, node_test_1.it)("calls the correct endpoint", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: [
                            {
                                id: "14400",
                                issueType: {
                                    id: "10100",
                                    name: "Test",
                                },
                                key: "CYP-333",
                                self: "http://localhost:8727/rest/api/2/issue/14400",
                            },
                            {
                                id: "14401",
                                issueType: {
                                    id: "10103",
                                    name: "Test",
                                },
                                key: "CYP-555",
                                self: "http://localhost:8727/rest/api/2/issue/14401",
                            },
                            {
                                id: "14401",
                                issueType: {
                                    id: "10103",
                                    name: "Pre-Condition",
                                },
                                key: "CYP-222",
                                self: "http://localhost:8727/rest/api/2/issue/14401",
                            },
                        ],
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await client.importFeature("./test/resources/features/taggedPrefixCorrect.feature", { projectKey: "CYP" });
                node_assert_1.default.strictEqual(post.mock.calls.length, 1);
                node_assert_1.default.strictEqual(post.mock.calls[0].arguments[0], "http://localhost:1234/rest/raven/latest/import/feature?projectKey=CYP");
            });
            await (0, node_test_1.it)("handles successful responses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: [
                            {
                                id: "14400",
                                issueType: {
                                    id: "10100",
                                    name: "Test",
                                },
                                key: "CYP-333",
                                self: "http://localhost:8727/rest/api/2/issue/14400",
                            },
                            {
                                id: "14401",
                                issueType: {
                                    id: "10103",
                                    name: "Test",
                                },
                                key: "CYP-555",
                                self: "http://localhost:8727/rest/api/2/issue/14401",
                            },
                            {
                                id: "14401",
                                issueType: {
                                    id: "10103",
                                    name: "Pre-Condition",
                                },
                                key: "CYP-222",
                                self: "http://localhost:8727/rest/api/2/issue/14401",
                            },
                        ],
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
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            message: "Test with key CYP-333 was not found!",
                            preconditionIssues: [
                                {
                                    id: "14401",
                                    issueType: {
                                        id: "10103",
                                        name: "Pre-Condition",
                                    },
                                    key: "CYP-222",
                                    self: "http://localhost:8727/rest/api/2/issue/14401",
                                },
                            ],
                            testIssues: [
                                {
                                    id: "14401",
                                    issueType: {
                                        id: "10103",
                                        name: "Test",
                                    },
                                    key: "CYP-555",
                                    self: "http://localhost:8727/rest/api/2/issue/14401",
                                },
                            ],
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.importFeature("./test/resources/features/taggedPrefixCorrect.feature", { projectKey: "CYP" });
                node_assert_1.default.strictEqual(message.mock.callCount(), 4);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.DEBUG,
                    "Encountered an error during feature file import: Test with key CYP-333 was not found!",
                ]);
                node_assert_1.default.deepStrictEqual(response, {
                    errors: ["Test with key CYP-333 was not found!"],
                    updatedOrCreatedIssues: ["CYP-555", "CYP-222"],
                });
            });
            await (0, node_test_1.it)("handles responses with empty messages", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            preconditionIssues: [
                                {
                                    id: "14401",
                                    issueType: {
                                        id: "10103",
                                        name: "Pre-Condition",
                                    },
                                    key: "CYP-222",
                                    self: "http://localhost:8727/rest/api/2/issue/14401",
                                },
                            ],
                            testIssues: [
                                {
                                    id: "14401",
                                    issueType: {
                                        id: "10103",
                                        name: "Test",
                                    },
                                    key: "CYP-555",
                                    self: "http://localhost:8727/rest/api/2/issue/14401",
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
                    updatedOrCreatedIssues: ["CYP-555", "CYP-222"],
                });
            });
            await (0, node_test_1.it)("handles responses without any updated issues", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            message: "Test with key CYP-333 was not found!\nTest with key CYP-555 was not found!\nPrecondition with key CYP-222 was not found!",
                            preconditionIssues: [],
                            testIssues: [],
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.importFeature("./test/resources/features/taggedPrefixCorrect.feature", { projectKey: "CYP" });
                node_assert_1.default.deepStrictEqual(response, {
                    errors: [
                        "Test with key CYP-333 was not found!\nTest with key CYP-555 was not found!\nPrecondition with key CYP-222 was not found!",
                    ],
                    updatedOrCreatedIssues: [],
                });
                node_assert_1.default.strictEqual(message.mock.callCount(), 2);
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.DEBUG,
                    "Encountered an error during feature file import: Test with key CYP-333 was not found!\nTest with key CYP-555 was not found!\nPrecondition with key CYP-222 was not found!",
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
        await (0, node_test_1.describe)("get test execution", async () => {
            await (0, node_test_1.it)("returns tests", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                let i = 0;
                const get = context.mock.method(restClient, "get", () => {
                    switch (i++) {
                        case 0:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: [
                                    {
                                        archived: false,
                                        id: 9284,
                                        key: "CYP-123",
                                        rank: 1,
                                        status: "PASS",
                                    },
                                    {
                                        archived: false,
                                        id: 9285,
                                        key: "CYP-456",
                                        rank: 2,
                                        status: "TODO",
                                    },
                                ],
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 1:
                            return {
                                config: { headers: new axios_1.AxiosHeaders() },
                                data: [],
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                    }
                });
                const response = await client.getTestExecution("CYP-321");
                node_assert_1.default.deepStrictEqual(response, [
                    {
                        archived: false,
                        id: 9284,
                        key: "CYP-123",
                        rank: 1,
                        status: "PASS",
                    },
                    {
                        archived: false,
                        id: 9285,
                        key: "CYP-456",
                        rank: 2,
                        status: "TODO",
                    },
                ]);
                node_assert_1.default.deepStrictEqual(get.mock.calls[0].arguments, [
                    "http://localhost:1234/rest/raven/latest/api/testexec/CYP-321/test",
                    {
                        headers: { ["Authorization"]: "Bearer token" },
                        params: {
                            detailed: undefined,
                            limit: undefined,
                            page: 1,
                        },
                    },
                ]);
                node_assert_1.default.deepStrictEqual(get.mock.calls[1].arguments, [
                    "http://localhost:1234/rest/raven/latest/api/testexec/CYP-321/test",
                    {
                        headers: { ["Authorization"]: "Bearer token" },
                        params: {
                            detailed: undefined,
                            limit: undefined,
                            page: 2,
                        },
                    },
                ]);
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 400", "400", { headers: new axios_1.AxiosHeaders() }, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: "Xray app not configured",
                    headers: {},
                    status: 400,
                    statusText: "Bad Request",
                });
                context.mock.method(restClient, "get", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.getTestExecution("CYP-321"), {
                    message: "Failed to get test execution",
                });
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        Failed to get test execution: Request failed with status code 400
                    `),
                ]);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "getTestExecutionError",
                ]);
            });
        });
        await (0, node_test_1.describe)("get xray license", async () => {
            await (0, node_test_1.it)("returns the license", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const get = context.mock.method(restClient, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            active: true,
                            licenseType: "Demo License",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.getXrayLicense();
                node_assert_1.default.deepStrictEqual(response, {
                    active: true,
                    licenseType: "Demo License",
                });
                node_assert_1.default.deepStrictEqual(get.mock.calls[0].arguments, [
                    "http://localhost:1234/rest/raven/latest/api/xraylicense",
                    {
                        headers: { ["Authorization"]: "Bearer token" },
                    },
                ]);
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 400", "400", { headers: new axios_1.AxiosHeaders() }, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: "Xray app not configured",
                    headers: {},
                    status: 400,
                    statusText: "Bad Request",
                });
                context.mock.method(restClient, "get", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.getXrayLicense(), {
                    message: "Failed to get Xray license",
                });
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        Failed to get Xray license: Request failed with status code 400
                    `),
                ]);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "getXrayLicenseError",
                ]);
            });
        });
    });
});
