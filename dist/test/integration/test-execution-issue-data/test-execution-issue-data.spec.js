"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const promises_1 = require("node:timers/promises");
const sh_1 = require("../../sh");
const clients_1 = require("../clients");
const util_1 = require("../util");
// ============================================================================================== //
// https://github.com/Qytera-Gmbh/cypress-xray-plugin/issues/359
// ============================================================================================== //
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), { timeout: 180000 }, async () => {
    for (const test of [
        {
            expectedLabels: [],
            expectedSummary: "Integration test 359 (hardcoded)",
            projectDirectory: (0, node_path_1.join)(__dirname, "static-cloud"),
            projectKey: "CYP",
            service: "cloud",
            title: "test execution issue data is hardcoded (cloud)",
        },
        {
            expectedLabels: ["x", "y"],
            expectedSummary: "Integration test 359 (wrapped)",
            projectDirectory: (0, node_path_1.join)(__dirname, "dynamic-cloud"),
            projectKey: "CYP",
            service: "cloud",
            title: "test execution issue data is wrapped (cloud)",
        },
        {
            expectedLabels: [],
            expectedSummary: "Integration test 359 (hardcoded)",
            projectDirectory: (0, node_path_1.join)(__dirname, "static-server"),
            projectKey: "CYPLUG",
            service: "server",
            title: "test execution issue data is hardcoded (server)",
        },
        {
            expectedLabels: ["x", "y"],
            expectedSummary: "Integration test 359 (wrapped)",
            projectDirectory: (0, node_path_1.join)(__dirname, "dynamic-server"),
            projectKey: "CYPLUG",
            service: "server",
            title: "test execution issue data is wrapped (server)",
        },
    ]) {
        await (0, node_test_1.it)(test.title, async () => {
            var _a;
            const output = (0, sh_1.runCypress)(test.projectDirectory, {
                includeDefaultEnv: test.service,
            });
            const testExecutionIssueKey = (0, util_1.getCreatedTestExecutionIssueKey)(test.projectKey, output, "cypress");
            // Jira server does not like searches immediately after issue creation (socket hang up).
            if (test.service === "server") {
                await (0, promises_1.setTimeout)(10000);
            }
            const searchResult = await (0, clients_1.getIntegrationClient)("jira", test.service).search({
                fields: ["labels", "summary"],
                jql: `issue in (${testExecutionIssueKey})`,
            });
            node_assert_1.default.deepStrictEqual((_a = searchResult[0].fields) === null || _a === void 0 ? void 0 : _a.labels, test.expectedLabels);
            node_assert_1.default.deepStrictEqual(searchResult[0].fields.summary, test.expectedSummary);
        });
    }
});
