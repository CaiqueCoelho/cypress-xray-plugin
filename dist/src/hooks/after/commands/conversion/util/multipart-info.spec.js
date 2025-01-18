"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const dedent_1 = require("../../../../../util/dedent");
const multipart_info_1 = require("./multipart-info");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(multipart_info_1.buildMultipartInfoCloud.name, async () => {
        await (0, node_test_1.it)("adds default information", () => {
            const info = (0, multipart_info_1.buildMultipartInfoCloud)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28T15:51:36.000Z",
            }, {
                projectKey: "CYP",
                testExecutionIssue: {},
            });
            node_assert_1.default.deepStrictEqual(info.fields.project, { key: "CYP" });
            node_assert_1.default.deepStrictEqual(info.fields.description, (0, dedent_1.dedent)(`
                    Cypress version: 13.2.0
                    Browser: Chromium (1.2.3)
                `));
            node_assert_1.default.deepStrictEqual(info.fields.issuetype, undefined);
        });
        await (0, node_test_1.it)("uses provided summaries", () => {
            const info = (0, multipart_info_1.buildMultipartInfoCloud)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testExecutionIssue: { fields: { summary: "Hello" } },
            });
            node_assert_1.default.deepStrictEqual(info.fields.summary, "Hello");
        });
        await (0, node_test_1.it)("uses provided descriptions", () => {
            const info = (0, multipart_info_1.buildMultipartInfoCloud)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testExecutionIssue: { fields: { description: "Hello There" } },
            });
            node_assert_1.default.deepStrictEqual(info.fields.description, "Hello There");
        });
        await (0, node_test_1.it)("uses provided test execution issue types", () => {
            const info = (0, multipart_info_1.buildMultipartInfoCloud)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testExecutionIssue: {
                    fields: {
                        issuetype: {
                            name: "Test Execution (QA)",
                        },
                        projectKey: "CYP",
                    },
                },
            });
            node_assert_1.default.deepStrictEqual(info.fields.issuetype, {
                name: "Test Execution (QA)",
            });
        });
        await (0, node_test_1.it)("uses provided test plans", () => {
            const info = (0, multipart_info_1.buildMultipartInfoCloud)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testExecutionIssue: {},
                testPlan: {
                    value: "CYP-123",
                },
            });
            node_assert_1.default.deepStrictEqual(info.xrayFields, {
                environments: undefined,
                testPlanKey: "CYP-123",
            });
        });
        await (0, node_test_1.it)("uses provided test environments", () => {
            const info = (0, multipart_info_1.buildMultipartInfoCloud)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testEnvironments: {
                    value: ["DEV", "TEST"],
                },
                testExecutionIssue: {},
            });
            node_assert_1.default.deepStrictEqual(info.xrayFields, {
                environments: ["DEV", "TEST"],
                testPlanKey: undefined,
            });
        });
        await (0, node_test_1.it)("uses provided custom data", () => {
            const info = (0, multipart_info_1.buildMultipartInfoCloud)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28T15:51:36.000Z",
            }, {
                projectKey: "CYP",
                testExecutionIssue: {
                    fields: { ["customfield_12345"]: [1, 2, 3, 4, 5] },
                    historyMetadata: { actor: { displayName: "Jeff" } },
                    properties: [{ key: "???", value: "???" }],
                    transition: { id: "15" },
                    update: { assignee: [{ edit: "Jeff" }] },
                },
            });
            node_assert_1.default.deepStrictEqual(info, {
                fields: {
                    ["customfield_12345"]: [1, 2, 3, 4, 5],
                    description: (0, dedent_1.dedent)(`
                        Cypress version: 13.2.0
                        Browser: Chromium (1.2.3)
                    `),
                    issuetype: undefined,
                    project: {
                        key: "CYP",
                    },
                    summary: undefined,
                },
                historyMetadata: { actor: { displayName: "Jeff" } },
                properties: [{ key: "???", value: "???" }],
                transition: { id: "15" },
                update: { assignee: [{ edit: "Jeff" }] },
                xrayFields: {
                    environments: undefined,
                    testPlanKey: undefined,
                },
            });
        });
        await (0, node_test_1.it)("prefers custom data to plugin data", () => {
            const info = (0, multipart_info_1.buildMultipartInfoCloud)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testExecutionIssue: {
                    fields: {
                        description: "My description",
                        issuetype: { name: "Different Issue Type" },
                        project: { key: "ABC" },
                        summary: "My summary",
                    },
                },
            });
            node_assert_1.default.deepStrictEqual(info.fields, {
                description: "My description",
                issuetype: { name: "Different Issue Type" },
                project: { key: "ABC" },
                summary: "My summary",
            });
        });
    });
    await (0, node_test_1.describe)(multipart_info_1.buildMultipartInfoServer.name, async () => {
        await (0, node_test_1.it)("adds default information", () => {
            const info = (0, multipart_info_1.buildMultipartInfoServer)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28T15:51:36.000Z",
            }, {
                projectKey: "CYPLUG",
                testExecutionIssue: {},
            });
            node_assert_1.default.deepStrictEqual(info.fields.project, {
                key: "CYPLUG",
            });
            node_assert_1.default.deepStrictEqual(info.fields.description, (0, dedent_1.dedent)(`
                    Cypress version: 13.2.0
                    Browser: Chromium (1.2.3)
                `));
            node_assert_1.default.deepStrictEqual(info.fields.summary, undefined);
            node_assert_1.default.deepStrictEqual(info.fields.issuetype, undefined);
        });
        await (0, node_test_1.it)("uses provided summaries", () => {
            const info = (0, multipart_info_1.buildMultipartInfoServer)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testExecutionIssue: { fields: { summary: "Hello" } },
            });
            node_assert_1.default.deepStrictEqual(info.fields.summary, "Hello");
        });
        await (0, node_test_1.it)("uses provided descriptions", () => {
            const info = (0, multipart_info_1.buildMultipartInfoServer)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testExecutionIssue: { fields: { description: "Hello There" } },
            });
            node_assert_1.default.deepStrictEqual(info.fields.description, "Hello There");
        });
        await (0, node_test_1.it)("uses provided test execution issue types", () => {
            const info = (0, multipart_info_1.buildMultipartInfoServer)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testExecutionIssue: {
                    fields: {
                        issuetype: {
                            name: "Test Execution (QA)",
                        },
                    },
                },
            });
            node_assert_1.default.deepStrictEqual(info.fields.issuetype, {
                name: "Test Execution (QA)",
            });
        });
        await (0, node_test_1.it)("uses provided test plans", () => {
            const info = (0, multipart_info_1.buildMultipartInfoServer)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testExecutionIssue: {},
                testPlan: {
                    fieldId: "customField_12345",
                    value: "CYP-123",
                },
            });
            node_assert_1.default.deepStrictEqual(info.fields.customField_12345, ["CYP-123"]);
        });
        await (0, node_test_1.it)("uses provided test environments", () => {
            const info = (0, multipart_info_1.buildMultipartInfoServer)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testEnvironments: {
                    fieldId: "customField_12345",
                    value: ["DEV"],
                },
                testExecutionIssue: {},
            });
            node_assert_1.default.deepStrictEqual(info.fields.customField_12345, ["DEV"]);
        });
        await (0, node_test_1.it)("uses provided custom data", () => {
            const info = (0, multipart_info_1.buildMultipartInfoServer)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28T15:51:36.000Z",
            }, {
                projectKey: "CYP",
                testExecutionIssue: {
                    fields: { ["customfield_12345"]: [1, 2, 3, 4, 5] },
                    historyMetadata: { actor: { displayName: "Jeff" } },
                    properties: [{ key: "???", value: "???" }],
                    transition: { id: "15" },
                    update: { assignee: [{ edit: "Jeff" }] },
                },
            });
            node_assert_1.default.deepStrictEqual(info, {
                fields: {
                    ["customfield_12345"]: [1, 2, 3, 4, 5],
                    description: (0, dedent_1.dedent)(`
                        Cypress version: 13.2.0
                        Browser: Chromium (1.2.3)
                    `),
                    issuetype: undefined,
                    project: {
                        key: "CYP",
                    },
                    summary: undefined,
                },
                historyMetadata: { actor: { displayName: "Jeff" } },
                properties: [{ key: "???", value: "???" }],
                transition: { id: "15" },
                update: { assignee: [{ edit: "Jeff" }] },
            });
        });
        await (0, node_test_1.it)("prefers custom data to plugin data", () => {
            const info = (0, multipart_info_1.buildMultipartInfoServer)({
                browserName: "Chromium",
                browserVersion: "1.2.3",
                cypressVersion: "13.2.0",
                endedTestsAt: "2023-09-28 17:53:36",
                startedTestsAt: "2023-09-28 17:51:36",
            }, {
                projectKey: "CYP",
                testEnvironments: { fieldId: "customfield_678", value: ["DEV", "TEST"] },
                testExecutionIssue: {
                    fields: {
                        ["customfield_678"]: ["PROD"],
                        ["customfield_999"]: "CYP-111",
                        description: "My description",
                        issuetype: { name: "Different Issue Type" },
                        project: { key: "ABC" },
                        summary: "My summary",
                    },
                },
                testPlan: { fieldId: "customfield_999", value: "CYP-456" },
            });
            node_assert_1.default.deepStrictEqual(info.fields, {
                ["customfield_678"]: ["PROD"],
                ["customfield_999"]: "CYP-111",
                description: "My description",
                issuetype: { name: "Different Issue Type" },
                project: { key: "ABC" },
                summary: "My summary",
            });
        });
    });
});
