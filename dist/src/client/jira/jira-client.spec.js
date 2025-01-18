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
const logging_1 = require("../../util/logging");
const credentials_1 = require("../authentication/credentials");
const requests_1 = require("../https/requests");
const jira_client_1 = require("./jira-client");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(jira_client_1.BaseJiraClient.name, async () => {
        let client;
        let restClient;
        (0, node_test_1.beforeEach)(() => {
            restClient = new requests_1.AxiosRestClient(axios_1.default);
            client = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.BasicAuthCredentials("user", "token"), restClient);
        });
        await (0, node_test_1.describe)("add attachment", async () => {
            await (0, node_test_1.it)("should use the correct headers", async (context) => {
                var _a;
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: {
                            headers: new axios_1.AxiosHeaders(),
                        },
                        data: JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/jira/responses/singleAttachment.json", "utf-8")),
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await client.addAttachment("CYP-123", "./test/resources/turtle.png");
                const headers = (_a = post.mock.calls[0].arguments[2]) === null || _a === void 0 ? void 0 : _a.headers;
                node_assert_1.default.ok(headers);
                node_assert_1.default.strictEqual(headers.Authorization, "Basic dXNlcjp0b2tlbg==");
                node_assert_1.default.strictEqual(headers["X-Atlassian-Token"], "no-check");
                node_assert_1.default.match(headers["content-type"], /multipart\/form-data; .+/);
            });
            await (0, node_test_1.describe)("single file attachment", async () => {
                await (0, node_test_1.it)("returns the correct values", async (context) => {
                    const mockedData = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/jira/responses/singleAttachment.json", "utf-8"));
                    context.mock.method(restClient, "post", () => {
                        return {
                            config: {
                                headers: new axios_1.AxiosHeaders(),
                            },
                            data: mockedData,
                            headers: {},
                            status: axios_1.HttpStatusCode.Ok,
                            statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                        };
                    });
                    const response = await client.addAttachment("CYP-123", "./test/resources/turtle.png");
                    node_assert_1.default.strictEqual(response, mockedData);
                });
            });
            await (0, node_test_1.describe)("multiple file attachment", async () => {
                await (0, node_test_1.it)("returns the correct values", async (context) => {
                    const mockedData = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/jira/responses/multipleAttachments.json", "utf-8"));
                    context.mock.method(restClient, "post", () => {
                        return {
                            config: {
                                headers: new axios_1.AxiosHeaders(),
                            },
                            data: mockedData,
                            headers: {},
                            status: axios_1.HttpStatusCode.Ok,
                            statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                        };
                    });
                    const response = await client.addAttachment("CYP-123", "./test/resources/turtle.png", "./test/resources/greetings.txt");
                    node_assert_1.default.strictEqual(response, mockedData);
                });
            });
            await (0, node_test_1.it)("logs missing files", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const mockedData = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/jira/responses/singleAttachment.json", "utf-8"));
                context.mock.method(restClient, "post", () => {
                    return {
                        config: {
                            headers: new axios_1.AxiosHeaders(),
                        },
                        data: mockedData,
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.addAttachment("CYP-123", "./test/resources/missingGreetings.txt", "./test/resources/turtle.png");
                node_assert_1.default.strictEqual(response, mockedData);
                node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                    logging_1.Level.WARNING,
                    "File does not exist:",
                    "./test/resources/missingGreetings.txt",
                ]);
            });
            await (0, node_test_1.it)("skips missing files", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const mockedData = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/jira/responses/multipleAttachments.json", "utf-8"));
                context.mock.method(restClient, "post", () => {
                    return {
                        config: {
                            headers: new axios_1.AxiosHeaders(),
                        },
                        data: mockedData,
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.addAttachment("CYP-123", "./test/resources/turtle.png", "./test/resources/missingGreetings.txt", "./test/resources/greetings.txt");
                node_assert_1.default.strictEqual(response, mockedData);
            });
            await (0, node_test_1.it)("immediately returns an empty array when all files are missing", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const response = await client.addAttachment("CYP-123", "./test/resources/missingGreetings.txt", "./test/resources/missingSomething.png");
                node_assert_1.default.deepStrictEqual(response, []);
                node_assert_1.default.deepStrictEqual(message.mock.calls[2].arguments, [
                    logging_1.Level.WARNING,
                    "All files do not exist. Skipping attaching.",
                ]);
            });
            await (0, node_test_1.it)("immediately returns an empty array when no files are provided", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                node_assert_1.default.deepStrictEqual(await client.addAttachment("CYP-123"), []);
                node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                    logging_1.Level.WARNING,
                    "No files provided to attach to issue CYP-123. Skipping attaching.",
                ]);
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 413", axios_1.HttpStatusCode.BadRequest.toString(), undefined, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        errorMessages: ["The file is way too big."],
                    },
                    headers: {},
                    status: axios_1.HttpStatusCode.PayloadTooLarge,
                    statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.PayloadTooLarge],
                });
                context.mock.method(restClient, "post", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.addAttachment("CYP-123", "./test/resources/greetings.txt"), { message: "Failed to attach files" });
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to attach files: Request failed with status code 413",
                ]);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "addAttachmentError",
                ]);
            });
        });
        await (0, node_test_1.describe)("get issue types", async () => {
            await (0, node_test_1.it)("returns issue types", async (context) => {
                const issueTypes = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/jira/responses/getIssueTypes.json", "utf-8"));
                context.mock.method(restClient, "get", () => {
                    return {
                        config: {
                            headers: new axios_1.AxiosHeaders(),
                        },
                        data: issueTypes,
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                node_assert_1.default.strictEqual(await client.getIssueTypes(), issueTypes);
            });
            await (0, node_test_1.it)("handles issues without name or id", async (context) => {
                const issueTypes = [
                    { id: "12345" },
                    { name: "Custom issue" },
                    { description: "A legacy subtask" },
                ];
                context.mock.method(restClient, "get", () => {
                    return {
                        config: {
                            headers: new axios_1.AxiosHeaders(),
                        },
                        data: issueTypes,
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                node_assert_1.default.strictEqual(await client.getIssueTypes(), issueTypes);
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 409", axios_1.HttpStatusCode.BadRequest.toString(), undefined, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        errorMessages: ["There is a conflict or something"],
                    },
                    headers: {},
                    status: axios_1.HttpStatusCode.Conflict,
                    statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Conflict],
                });
                context.mock.method(restClient, "get", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.getIssueTypes(), {
                    message: "Failed to get issue types",
                });
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to get issue types: Request failed with status code 409",
                ]);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "getIssueTypesError",
                ]);
            });
        });
        await (0, node_test_1.describe)("get fields", async () => {
            await (0, node_test_1.it)("returns the correct values", async (context) => {
                const mockedData = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/jira/responses/getFields.json", "utf-8"));
                context.mock.method(restClient, "get", () => {
                    return {
                        config: {
                            headers: new axios_1.AxiosHeaders(),
                        },
                        data: mockedData,
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const fields = await client.getFields();
                node_assert_1.default.strictEqual(fields, mockedData);
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 409", axios_1.HttpStatusCode.BadRequest.toString(), undefined, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        errorMessages: ["There is a conflict or something"],
                    },
                    headers: {},
                    status: axios_1.HttpStatusCode.Conflict,
                    statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Conflict],
                });
                context.mock.method(restClient, "get", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.getFields(), { message: "Failed to get fields" });
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to get fields: Request failed with status code 409",
                ]);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "getFieldsError",
                ]);
            });
        });
        await (0, node_test_1.describe)("get myself", async () => {
            await (0, node_test_1.it)("returns user details", async (context) => {
                const get = context.mock.method(restClient, "get", () => {
                    return {
                        config: {
                            headers: new axios_1.AxiosHeaders(),
                        },
                        data: {
                            active: true,
                            displayName: "Demo User",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                node_assert_1.default.deepStrictEqual(await client.getMyself(), {
                    active: true,
                    displayName: "Demo User",
                });
                node_assert_1.default.strictEqual(get.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(get.mock.calls[0].arguments, [
                    "http://localhost:1234/rest/api/latest/myself",
                    {
                        headers: { ["Authorization"]: "Basic dXNlcjp0b2tlbg==" },
                    },
                ]);
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 409", axios_1.HttpStatusCode.BadRequest.toString(), undefined, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        errorMessages: ["There is a conflict or something"],
                    },
                    headers: {},
                    status: axios_1.HttpStatusCode.Conflict,
                    statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Conflict],
                });
                context.mock.method(restClient, "get", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.getMyself(), { message: "Failed to get user details" });
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to get user details: Request failed with status code 409",
                ]);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "getMyselfError",
                ]);
            });
        });
        await (0, node_test_1.describe)("search", async () => {
            await (0, node_test_1.it)("should return all issues without pagination", async (context) => {
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: {
                            headers: new axios_1.AxiosHeaders(),
                        },
                        data: JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/jira/responses/search.json", "utf-8")),
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const response = await client.search({
                    fields: ["customfield_12100"],
                    jql: "project = CYP AND issue in (CYP-268,CYP-237,CYP-332,CYP-333,CYP-338)",
                });
                node_assert_1.default.strictEqual(post.mock.callCount(), 1);
                node_assert_1.default.strictEqual(response.length, 4);
                node_assert_1.default.strictEqual(response[0].key, "CYP-333");
                node_assert_1.default.strictEqual(response[1].key, "CYP-338");
                node_assert_1.default.strictEqual(response[2].key, "CYP-332");
                node_assert_1.default.strictEqual(response[3].key, "CYP-268");
            });
            await (0, node_test_1.it)("returns all issues with pagination", async (context) => {
                const mockedData = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/jira/responses/search.json", "utf-8"));
                let i = 0;
                const post = context.mock.method(restClient, "post", () => {
                    var _a, _b, _c, _d;
                    switch (i++) {
                        case 0:
                            return {
                                config: {
                                    headers: new axios_1.AxiosHeaders(),
                                },
                                data: {
                                    ...mockedData,
                                    issues: (_a = mockedData.issues) === null || _a === void 0 ? void 0 : _a.slice(0, 1),
                                    maxResults: 1,
                                    startAt: 0,
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 1:
                            return {
                                config: {
                                    headers: new axios_1.AxiosHeaders(),
                                },
                                data: {
                                    ...mockedData,
                                    issues: undefined,
                                    maxResults: 0,
                                    startAt: 1,
                                    total: undefined,
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 2:
                            return {
                                config: {
                                    headers: new axios_1.AxiosHeaders(),
                                },
                                data: {
                                    ...mockedData,
                                    issues: (_b = mockedData.issues) === null || _b === void 0 ? void 0 : _b.slice(1, 2),
                                    maxResults: 1,
                                    startAt: undefined,
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 3:
                            return {
                                config: {
                                    headers: new axios_1.AxiosHeaders(),
                                },
                                data: {
                                    ...mockedData,
                                    issues: (_c = mockedData.issues) === null || _c === void 0 ? void 0 : _c.slice(1, 2),
                                    maxResults: 1,
                                    startAt: 1,
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                        case 4:
                            return {
                                config: {
                                    headers: new axios_1.AxiosHeaders(),
                                },
                                data: {
                                    ...mockedData,
                                    issues: (_d = mockedData.issues) === null || _d === void 0 ? void 0 : _d.slice(2),
                                    maxResults: 3,
                                    startAt: 2,
                                },
                                headers: {},
                                status: axios_1.HttpStatusCode.Ok,
                                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                            };
                    }
                });
                const response = await client.search({
                    fields: ["customfield_12100"],
                    jql: "project = CYP AND issue in (CYP-268,CYP-237,CYP-332,CYP-333,CYP-338)",
                });
                node_assert_1.default.strictEqual(post.mock.callCount(), 5);
                node_assert_1.default.strictEqual(post.mock.calls[0].arguments[1].startAt, 0);
                node_assert_1.default.strictEqual(post.mock.calls[1].arguments[1].startAt, 1);
                node_assert_1.default.strictEqual(post.mock.calls[2].arguments[1].startAt, 1);
                node_assert_1.default.strictEqual(post.mock.calls[3].arguments[1].startAt, 1);
                node_assert_1.default.strictEqual(post.mock.calls[4].arguments[1].startAt, 2);
                node_assert_1.default.strictEqual(response.length, 4);
                node_assert_1.default.strictEqual(response[0].key, "CYP-333");
                node_assert_1.default.strictEqual(response[1].key, "CYP-338");
                node_assert_1.default.strictEqual(response[2].key, "CYP-332");
                node_assert_1.default.strictEqual(response[3].key, "CYP-268");
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 401", axios_1.HttpStatusCode.BadRequest.toString(), undefined, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        errorMessages: ["You're not authenticated"],
                    },
                    headers: {},
                    status: axios_1.HttpStatusCode.Unauthorized,
                    statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Unauthorized],
                });
                context.mock.method(restClient, "post", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.search({}), { message: "Failed to search issues" });
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to search issues: Request failed with status code 401",
                ]);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "searchError",
                ]);
            });
        });
        await (0, node_test_1.describe)("editIssue", async () => {
            await (0, node_test_1.it)("edits issues", async (context) => {
                const put = context.mock.method(restClient, "put", () => {
                    return {
                        config: {
                            headers: new axios_1.AxiosHeaders(),
                        },
                        data: undefined,
                        headers: {},
                        status: axios_1.HttpStatusCode.NoContent,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.NoContent],
                    };
                });
                node_assert_1.default.strictEqual(await client.editIssue("CYP-XYZ", {
                    fields: { summary: "Hi" },
                }), "CYP-XYZ");
                node_assert_1.default.strictEqual(put.mock.callCount(), 1);
                node_assert_1.default.strictEqual(put.mock.calls[0].arguments[0], "http://localhost:1234/rest/api/latest/issue/CYP-XYZ");
                node_assert_1.default.deepStrictEqual(put.mock.calls[0].arguments[1], {
                    fields: { summary: "Hi" },
                });
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 400", axios_1.HttpStatusCode.BadRequest.toString(), undefined, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        errorMessages: ["issue CYP-XYZ does not exist"],
                    },
                    headers: {},
                    status: axios_1.HttpStatusCode.BadRequest,
                    statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.BadRequest],
                });
                context.mock.method(restClient, "put", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.editIssue("CYP-XYZ", {
                    fields: { summary: "Hi" },
                }), { message: "Failed to edit issue" });
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to edit issue: Request failed with status code 400",
                ]);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "editIssueError",
                ]);
            });
        });
        await (0, node_test_1.describe)("transitionIssue", async () => {
            await (0, node_test_1.it)("transitions issues", async (context) => {
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: {
                            headers: new axios_1.AxiosHeaders(),
                        },
                        data: undefined,
                        headers: {},
                        status: axios_1.HttpStatusCode.NoContent,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.NoContent],
                    };
                });
                await client.transitionIssue("CYP-XYZ", {
                    transition: {
                        name: "resolve",
                        to: {
                            name: "done",
                        },
                    },
                });
                node_assert_1.default.strictEqual(post.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(post.mock.calls[0].arguments, [
                    "http://localhost:1234/rest/api/latest/issue/CYP-XYZ/transitions",
                    {
                        transition: {
                            name: "resolve",
                            to: {
                                name: "done",
                            },
                        },
                    },
                    {
                        headers: { ["Authorization"]: "Basic dXNlcjp0b2tlbg==" },
                    },
                ]);
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const logErrorToFile = context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const error = new axios_1.AxiosError("Request failed with status code 404", axios_1.HttpStatusCode.NotFound.toString(), undefined, null, {
                    config: { headers: new axios_1.AxiosHeaders() },
                    data: {
                        errorMessages: ["issue CYP-XYZ does not exist"],
                    },
                    headers: {},
                    status: axios_1.HttpStatusCode.NotFound,
                    statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.NotFound],
                });
                context.mock.method(restClient, "post", () => {
                    throw error;
                });
                await node_assert_1.default.rejects(client.transitionIssue("CYP-XYZ", {
                    transition: {
                        name: "resolve",
                        to: {
                            name: "done",
                        },
                    },
                }), { message: "Failed to transition issue" });
                node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to transition issue: Request failed with status code 404",
                ]);
                node_assert_1.default.deepStrictEqual(logErrorToFile.mock.calls[0].arguments, [
                    error,
                    "transitionIssueError",
                ]);
            });
        });
    });
});
