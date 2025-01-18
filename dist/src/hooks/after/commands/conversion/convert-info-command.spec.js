"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const logging_1 = require("../../../../util/logging");
const constant_command_1 = require("../../../util/commands/constant-command");
const convert_info_command_1 = require("./convert-info-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(convert_info_command_1.ConvertInfoServerCommand.name, async () => {
        await (0, node_test_1.it)("converts cucumber results into server cucumber info data", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new convert_info_command_1.ConvertInfoServerCommand({
                jira: {
                    projectKey: "CYP",
                },
                xray: { uploadScreenshots: false },
            }, logging_1.LOG, {
                issuetype: new constant_command_1.ConstantCommand(logging_1.LOG, { id: "issue_1578" }),
                results: new constant_command_1.ConstantCommand(logging_1.LOG, {
                    browserName: "Firefox",
                    browserVersion: "123.11.6",
                    cypressVersion: "42.4.9",
                    endedTestsAt: "2023-09-09T10:59:36.177Z",
                    startedTestsAt: "2023-09-09T10:59:28.829Z",
                }),
                summary: new constant_command_1.ConstantCommand(logging_1.LOG, "Execution Results [1694257168829]"),
            });
            const info = await command.compute();
            node_assert_1.default.deepStrictEqual(info, {
                fields: {
                    description: "Cypress version: 42.4.9\nBrowser: Firefox (123.11.6)",
                    issuetype: { id: "issue_1578" },
                    project: {
                        key: "CYP",
                    },
                    summary: "Execution Results [1694257168829]",
                },
                historyMetadata: undefined,
                properties: undefined,
                transition: undefined,
                update: undefined,
            });
        });
        await (0, node_test_1.it)("includes configured test plan issue keys", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new convert_info_command_1.ConvertInfoServerCommand({
                jira: {
                    projectKey: "CYP",
                    testPlanIssueKey: "CYP-123",
                },
                xray: { uploadScreenshots: false },
            }, logging_1.LOG, {
                fieldIds: {
                    testPlanId: new constant_command_1.ConstantCommand(logging_1.LOG, "customfield_12345"),
                },
                issuetype: new constant_command_1.ConstantCommand(logging_1.LOG, {}),
                results: new constant_command_1.ConstantCommand(logging_1.LOG, {
                    browserName: "Firefox",
                    browserVersion: "123.11.6",
                    cypressVersion: "42.4.9",
                    endedTestsAt: "2023-09-09T10:59:31.416Z",
                    startedTestsAt: "2023-09-09T10:59:28.829Z",
                }),
                summary: new constant_command_1.ConstantCommand(logging_1.LOG, "my summary"),
            });
            const info = await command.compute();
            node_assert_1.default.deepStrictEqual(info.fields.customfield_12345, ["CYP-123"]);
        });
        await (0, node_test_1.it)("includes configured test environments", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new convert_info_command_1.ConvertInfoServerCommand({
                jira: {
                    projectKey: "CYP",
                },
                xray: { testEnvironments: ["DEV", "PROD"], uploadScreenshots: false },
            }, logging_1.LOG, {
                fieldIds: {
                    testEnvironmentsId: new constant_command_1.ConstantCommand(logging_1.LOG, "customfield_45678"),
                },
                issuetype: new constant_command_1.ConstantCommand(logging_1.LOG, {}),
                results: new constant_command_1.ConstantCommand(logging_1.LOG, {
                    browserName: "Firefox",
                    browserVersion: "123.11.6",
                    cypressVersion: "42.4.9",
                    endedTestsAt: "2023-09-09T10:59:31.416Z",
                    startedTestsAt: "2023-09-09T10:59:28.829Z",
                }),
                summary: new constant_command_1.ConstantCommand(logging_1.LOG, "my summary"),
            });
            const info = await command.compute();
            node_assert_1.default.deepStrictEqual(info.fields.customfield_45678, ["DEV", "PROD"]);
        });
        await (0, node_test_1.it)("throws if no test plan id is supplied", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            node_assert_1.default.throws(() => new convert_info_command_1.ConvertInfoServerCommand({
                jira: {
                    projectKey: "CYP",
                    testPlanIssueKey: "CYP-123",
                },
                xray: { uploadScreenshots: false },
            }, logging_1.LOG, {
                issuetype: new constant_command_1.ConstantCommand(logging_1.LOG, {}),
                results: new constant_command_1.ConstantCommand(logging_1.LOG, {
                    browserName: "Firefox",
                    browserVersion: "123.11.6",
                    cypressVersion: "42.4.9",
                    endedTestsAt: "2023-09-09T10:59:31.416Z",
                    startedTestsAt: "2023-09-09T10:59:28.829Z",
                }),
                summary: new constant_command_1.ConstantCommand(logging_1.LOG, "my summary"),
            }), {
                message: "A test plan issue key was supplied without the test plan Jira field ID",
            });
        });
        await (0, node_test_1.it)("throws if no test environments id is supplied", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            node_assert_1.default.throws(() => new convert_info_command_1.ConvertInfoServerCommand({
                jira: {
                    projectKey: "CYP",
                },
                xray: { testEnvironments: ["DEV", "PROD"], uploadScreenshots: false },
            }, logging_1.LOG, {
                issuetype: new constant_command_1.ConstantCommand(logging_1.LOG, {}),
                results: new constant_command_1.ConstantCommand(logging_1.LOG, {
                    browserName: "Firefox",
                    browserVersion: "123.11.6",
                    cypressVersion: "42.4.9",
                    endedTestsAt: "2023-09-09T10:59:31.416Z",
                    startedTestsAt: "2023-09-09T10:59:28.829Z",
                }),
                summary: new constant_command_1.ConstantCommand(logging_1.LOG, "my summary"),
            }), {
                message: "Test environments were supplied without the test environments Jira field ID",
            });
        });
        await (0, node_test_1.it)("returns parameters", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new convert_info_command_1.ConvertInfoServerCommand({
                jira: {
                    projectKey: "CYP",
                },
                xray: { uploadScreenshots: false },
            }, logging_1.LOG, {
                issuetype: new constant_command_1.ConstantCommand(logging_1.LOG, {}),
                results: new constant_command_1.ConstantCommand(logging_1.LOG, {
                    browserName: "Firefox",
                    browserVersion: "123.11.6",
                    cypressVersion: "42.4.9",
                    endedTestsAt: "2023-09-09T10:59:31.416Z",
                    startedTestsAt: "2023-09-09T10:59:28.829Z",
                }),
                summary: new constant_command_1.ConstantCommand(logging_1.LOG, "my summary"),
            });
            node_assert_1.default.deepStrictEqual(command.getParameters(), {
                jira: {
                    projectKey: "CYP",
                },
                xray: { uploadScreenshots: false },
            });
        });
    });
    await (0, node_test_1.describe)(convert_info_command_1.ConvertInfoCloudCommand.name, async () => {
        await (0, node_test_1.it)("converts cucumber results into cucumber info data", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new convert_info_command_1.ConvertInfoCloudCommand({
                jira: {
                    projectKey: "CYP",
                },
                xray: { uploadScreenshots: false },
            }, logging_1.LOG, {
                issuetype: new constant_command_1.ConstantCommand(logging_1.LOG, { id: "issue_1578" }),
                results: new constant_command_1.ConstantCommand(logging_1.LOG, {
                    browserName: "Firefox",
                    browserVersion: "123.11.6",
                    cypressVersion: "42.4.9",
                    endedTestsAt: "2023-09-09T10:59:31.416Z",
                    startedTestsAt: "2023-09-09T10:59:28.829Z",
                }),
                summary: new constant_command_1.ConstantCommand(logging_1.LOG, "Execution Results [1694257168829]"),
            });
            const info = await command.compute();
            node_assert_1.default.deepStrictEqual(info, {
                fields: {
                    description: "Cypress version: 42.4.9\nBrowser: Firefox (123.11.6)",
                    issuetype: { id: "issue_1578" },
                    project: {
                        key: "CYP",
                    },
                    summary: "Execution Results [1694257168829]",
                },
                historyMetadata: undefined,
                properties: undefined,
                transition: undefined,
                update: undefined,
                xrayFields: {
                    environments: undefined,
                    testPlanKey: undefined,
                },
            });
        });
        await (0, node_test_1.it)("includes configured test plan issue keys", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new convert_info_command_1.ConvertInfoCloudCommand({
                jira: {
                    projectKey: "CYP",
                    testPlanIssueKey: "CYP-123",
                },
                xray: { uploadScreenshots: false },
            }, logging_1.LOG, {
                issuetype: new constant_command_1.ConstantCommand(logging_1.LOG, {}),
                results: new constant_command_1.ConstantCommand(logging_1.LOG, {
                    browserName: "Firefox",
                    browserVersion: "123.11.6",
                    cypressVersion: "42.4.9",
                    endedTestsAt: "2023-09-09T10:59:31.416Z",
                    startedTestsAt: "2023-09-09T10:59:28.829Z",
                }),
                summary: new constant_command_1.ConstantCommand(logging_1.LOG, "my summary"),
            });
            const info = await command.compute();
            node_assert_1.default.deepStrictEqual(info.xrayFields, {
                environments: undefined,
                testPlanKey: "CYP-123",
            });
        });
        await (0, node_test_1.it)("includes configured test environments", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new convert_info_command_1.ConvertInfoCloudCommand({
                jira: {
                    projectKey: "CYP",
                },
                xray: { testEnvironments: ["DEV", "PROD"], uploadScreenshots: false },
            }, logging_1.LOG, {
                issuetype: new constant_command_1.ConstantCommand(logging_1.LOG, {}),
                results: new constant_command_1.ConstantCommand(logging_1.LOG, {
                    browserName: "Firefox",
                    browserVersion: "123.11.6",
                    cypressVersion: "42.4.9",
                    endedTestsAt: "2023-09-09T10:59:31.416Z",
                    startedTestsAt: "2023-09-09T10:59:28.829Z",
                }),
                summary: new constant_command_1.ConstantCommand(logging_1.LOG, "my summary"),
            });
            const info = await command.compute();
            node_assert_1.default.deepStrictEqual(info.xrayFields, {
                environments: ["DEV", "PROD"],
                testPlanKey: undefined,
            });
        });
    });
});
