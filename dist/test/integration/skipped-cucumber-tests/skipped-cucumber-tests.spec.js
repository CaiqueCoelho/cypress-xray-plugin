"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const sh_1 = require("../../sh");
const clients_1 = require("../clients");
const util_1 = require("../util");
// ============================================================================================== //
// https://github.com/Qytera-Gmbh/cypress-xray-plugin/issues/341
// ============================================================================================== //
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), { timeout: 180000 }, async () => {
    for (const test of [
        {
            projectDirectory: (0, node_path_1.join)(__dirname, "cloud"),
            projectKey: "CYP",
            service: "cloud",
            testKeys: {
                included: "CYP-798",
                skipped: "CYP-797",
            },
            title: "results upload works for skipped cucumber tests (cloud)",
            xrayPassedStatus: "PASSED",
            xraySkippedStatus: "SKIPPED",
        },
        {
            projectDirectory: (0, node_path_1.join)(__dirname, "server"),
            projectKey: "CYPLUG",
            service: "server",
            testKeys: {
                included: "CYPLUG-208",
                skipped: "CYPLUG-209",
            },
            title: "results upload works for skipped cucumber tests (server)",
            xrayPassedStatus: "PASS",
            xraySkippedStatus: "ABORTED",
        },
    ]) {
        await (0, node_test_1.it)(test.title, async () => {
            var _a, _b;
            const output = (0, sh_1.runCypress)(test.projectDirectory, {
                includeDefaultEnv: test.service,
            });
            const testExecutionIssueKey = (0, util_1.getCreatedTestExecutionIssueKey)(test.projectKey, output, "cucumber");
            if (test.service === "cloud") {
                const searchResult = await (0, clients_1.getIntegrationClient)("jira", test.service).search({
                    fields: ["id"],
                    jql: `issue in (${testExecutionIssueKey})`,
                });
                node_assert_1.default.ok(searchResult[0].id);
                const testResults = await (0, clients_1.getIntegrationClient)("xray", test.service).getTestResults(searchResult[0].id);
                const includedTest = testResults.find((r) => r.jira.summary === "included cucumber test");
                node_assert_1.default.ok(includedTest);
                node_assert_1.default.strictEqual((_a = includedTest.status) === null || _a === void 0 ? void 0 : _a.name, test.xrayPassedStatus);
                const skippedTest = testResults.find((r) => r.jira.summary === "skipped cucumber test");
                node_assert_1.default.ok(skippedTest);
                node_assert_1.default.strictEqual((_b = skippedTest.status) === null || _b === void 0 ? void 0 : _b.name, test.xraySkippedStatus);
            }
            if (test.service === "server") {
                const testResults = await (0, clients_1.getIntegrationClient)("xray", test.service).getTestExecution(testExecutionIssueKey);
                const includedTest = testResults.find((r) => r.key === test.testKeys.included);
                node_assert_1.default.ok(includedTest);
                node_assert_1.default.strictEqual(includedTest.status, test.xrayPassedStatus);
                const skippedTest = testResults.find((r) => r.key === test.testKeys.skipped);
                node_assert_1.default.ok(skippedTest);
                node_assert_1.default.strictEqual(skippedTest.status, test.xraySkippedStatus);
            }
        });
    }
});
