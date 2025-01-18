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
// https://github.com/Qytera-Gmbh/cypress-xray-plugin/issues/328
// ============================================================================================== //
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), { timeout: 180000 }, async () => {
    for (const test of [
        {
            cucumberTests: ["CYP-969", "CYP-970"],
            manualTests: ["CYP-967", "CYP-968"],
            projectDirectory: (0, node_path_1.join)(__dirname, "cloud"),
            projectKey: "CYP",
            service: "cloud",
            title: "results upload works for tests with multiple issue keys (cloud)",
        },
        {
            cucumberTests: ["CYPLUG-342", "CYPLUG-343"],
            manualTests: ["CYPLUG-340", "CYPLUG-341"],
            projectDirectory: (0, node_path_1.join)(__dirname, "server"),
            projectKey: "CYPLUG",
            service: "server",
            title: "results upload works for tests with multiple issue keys (server)",
        },
    ]) {
        await (0, node_test_1.it)(test.title, async () => {
            const output = (0, sh_1.runCypress)(test.projectDirectory, {
                includeDefaultEnv: test.service,
            });
            const testExecutionIssueKey = (0, util_1.getCreatedTestExecutionIssueKey)(test.projectKey, output, "both");
            if (test.service === "cloud") {
                const searchResult = await (0, clients_1.getIntegrationClient)("jira", test.service).search({
                    fields: ["id"],
                    jql: `issue in (${testExecutionIssueKey})`,
                });
                node_assert_1.default.ok(searchResult[0].id);
                const testResults = await (0, clients_1.getIntegrationClient)("xray", test.service).getTestResults(searchResult[0].id);
                node_assert_1.default.deepStrictEqual(testResults.map((result) => result.jira.key), [
                    test.manualTests[0],
                    test.manualTests[1],
                    test.cucumberTests[0],
                    test.cucumberTests[1],
                ]);
            }
            if (test.service === "server") {
                const testResults = await (0, clients_1.getIntegrationClient)("xray", test.service).getTestExecution(testExecutionIssueKey);
                node_assert_1.default.deepStrictEqual(testResults.map((result) => result.key), [
                    test.manualTests[0],
                    test.manualTests[1],
                    test.cucumberTests[0],
                    test.cucumberTests[1],
                ]);
            }
        });
    }
});
