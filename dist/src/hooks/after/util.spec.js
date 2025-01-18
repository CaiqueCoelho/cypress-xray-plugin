"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const dedent_1 = require("../../util/dedent");
const util_1 = require("./util");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(util_1.containsCypressTest.name, async () => {
        let result;
        (0, node_test_1.beforeEach)(() => {
            result = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResultExistingTestIssues.json", "utf-8"));
        });
        await (0, node_test_1.it)("returns true for native runs", () => {
            node_assert_1.default.strictEqual((0, util_1.containsCypressTest)(result), true);
        });
        await (0, node_test_1.it)("returns true for mixed runs", () => {
            result = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResultCucumberMixed.json", "utf-8"));
            node_assert_1.default.strictEqual((0, util_1.containsCypressTest)(result, ".feature"), true);
        });
        await (0, node_test_1.it)("returns false for cucumber runs", () => {
            result = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResultCucumber.json", "utf-8"));
            node_assert_1.default.strictEqual((0, util_1.containsCypressTest)(result, ".feature"), false);
        });
        await (0, node_test_1.it)("regards cucumber runs as native if cucumber was not configured", () => {
            result = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResultCucumber.json", "utf-8"));
            node_assert_1.default.strictEqual((0, util_1.containsCypressTest)(result), true);
        });
    });
    await (0, node_test_1.describe)(util_1.containsCucumberTest.name, async () => {
        await (0, node_test_1.it)("returns true for Cucumber runs", () => {
            const result = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResultCucumber.json", "utf-8"));
            node_assert_1.default.strictEqual((0, util_1.containsCucumberTest)(result, ".feature"), true);
        });
        await (0, node_test_1.it)("returns true for mixed runs", () => {
            const result = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResultCucumberMixed.json", "utf-8"));
            node_assert_1.default.strictEqual((0, util_1.containsCucumberTest)(result, ".feature"), true);
        });
        await (0, node_test_1.it)("returns false for native runs", () => {
            const result = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResult.json", "utf-8"));
            node_assert_1.default.strictEqual((0, util_1.containsCucumberTest)(result, ".feature"), false);
        });
        await (0, node_test_1.it)("regards cucumber runs as native if cucumber was not configured", () => {
            const result = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResultCucumber.json", "utf-8"));
            node_assert_1.default.strictEqual((0, util_1.containsCucumberTest)(result), false);
        });
    });
    await (0, node_test_1.describe)(util_1.getTestIssueKeys.name, async () => {
        await (0, node_test_1.it)("extracts single test issue keys", () => {
            node_assert_1.default.deepStrictEqual((0, util_1.getTestIssueKeys)("this is CYP-123 a test", "CYP"), ["CYP-123"]);
        });
        await (0, node_test_1.it)("extracts multiple test issue keys", () => {
            node_assert_1.default.deepStrictEqual((0, util_1.getTestIssueKeys)("CYP-123 this is a CYP-456 test CYP-789", "CYP"), ["CYP-123", "CYP-456", "CYP-789"]);
        });
        await (0, node_test_1.it)("logs warnings for missing test issue keys", () => {
            node_assert_1.default.throws(() => (0, util_1.getTestIssueKeys)("this is a test", "CYP"), {
                message: (0, dedent_1.dedent)(`
                    Test: this is a test

                      No test issue keys found in title.

                      You can target existing test issues by adding a corresponding issue key:

                        it("CYP-123 this is a test", () => {
                          // ...
                        });

                      For more information, visit:
                      - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                `),
            });
        });
    });
});
