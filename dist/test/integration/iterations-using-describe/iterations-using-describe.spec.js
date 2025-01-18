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
// https://github.com/Qytera-Gmbh/cypress-xray-plugin/issues/421
// ============================================================================================== //
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), { timeout: 180000 }, async () => {
    for (const test of [
        {
            linkedTest: "CYP-1815",
            projectDirectory: (0, node_path_1.join)(__dirname, "cloud"),
            projectKey: "CYP",
            service: "cloud",
            title: "issue keys defined in describe titles (cloud)",
        },
        {
            linkedTest: "CYPLUG-1082",
            projectDirectory: (0, node_path_1.join)(__dirname, "server"),
            projectKey: "CYPLUG",
            service: "server",
            title: "issue keys defined in describe titles (server)",
        },
    ]) {
        await (0, node_test_1.it)(test.title, async () => {
            var _a;
            const output = (0, sh_1.runCypress)(test.projectDirectory, {
                expectedStatusCode: 1,
                includeDefaultEnv: test.service,
            });
            const testExecutionIssueKey = (0, util_1.getCreatedTestExecutionIssueKey)(test.projectKey, output, "cypress");
            if (test.service === "cloud") {
                const searchResult = await (0, clients_1.getIntegrationClient)("jira", test.service).search({
                    fields: ["id"],
                    jql: `issue in (${testExecutionIssueKey}, ${test.linkedTest})`,
                });
                node_assert_1.default.ok(searchResult[0].id);
                node_assert_1.default.ok(searchResult[1].id);
                const testResults = await (0, clients_1.getIntegrationClient)("xray", test.service).getTestRunResults({
                    testExecIssueIds: [searchResult[0].id],
                    testIssueIds: [searchResult[1].id],
                });
                node_assert_1.default.strictEqual(testResults.length, 1);
                node_assert_1.default.deepStrictEqual(testResults[0].status, { name: "FAILED" });
                node_assert_1.default.deepStrictEqual(testResults[0].test, {
                    jira: {
                        key: test.linkedTest,
                    },
                });
                node_assert_1.default.strictEqual((_a = testResults[0].evidence) === null || _a === void 0 ? void 0 : _a.length, 2);
                node_assert_1.default.strictEqual(testResults[0].evidence[0].filename, `${test.linkedTest} Test Suite Name -- Test Method Name 1 (failed).png`);
                node_assert_1.default.strictEqual(testResults[0].evidence[1].filename, `${test.linkedTest}-test-evidence-2.png`);
                node_assert_1.default.deepStrictEqual(testResults[0].iterations, {
                    results: [
                        {
                            parameters: [
                                {
                                    name: "iteration",
                                    value: "1",
                                },
                            ],
                            status: {
                                name: "FAILED",
                            },
                        },
                        {
                            parameters: [
                                {
                                    name: "iteration",
                                    value: "2",
                                },
                            ],
                            status: {
                                name: "PASSED",
                            },
                        },
                    ],
                });
            }
            if (test.service === "server") {
                // Jira server does not like searches immediately after issue creation (socket hang up).
                await (0, promises_1.setTimeout)(10000);
                const testExecution = await (0, clients_1.getIntegrationClient)("xray", test.service).getTestExecution(testExecutionIssueKey);
                const testRun = await (0, clients_1.getIntegrationClient)("xray", test.service).getTestRun(testExecution[0].id);
                node_assert_1.default.deepStrictEqual(testRun.status, "FAIL");
                node_assert_1.default.deepStrictEqual(testRun.testKey, test.linkedTest);
                node_assert_1.default.strictEqual(testRun.evidences.length, 2);
                node_assert_1.default.strictEqual(testRun.evidences[0].fileName, `${test.linkedTest} Test Suite Name -- Test Method Name 1 (failed).png`);
                node_assert_1.default.strictEqual(testRun.evidences[1].fileName, `${test.linkedTest}-test-evidence-2.png`);
                node_assert_1.default.strictEqual(testRun.iterations.length, 2);
                // Workaround because of configured status automations for which I don't have permission.
                // Would be "FAIL" normally.
                node_assert_1.default.strictEqual(testRun.iterations[0].status, "TODO");
                node_assert_1.default.deepStrictEqual(testRun.iterations[0].parameters, [
                    {
                        name: "iteration",
                        value: "1",
                    },
                ]);
                // Workaround because of configured status automations for which I don't have permission.
                // Would be "PASS" normally.
                node_assert_1.default.deepStrictEqual(testRun.iterations[1].status, "TODO");
                node_assert_1.default.deepStrictEqual(testRun.iterations[1].parameters, [
                    {
                        name: "iteration",
                        value: "2",
                    },
                ]);
            }
        });
    }
});
