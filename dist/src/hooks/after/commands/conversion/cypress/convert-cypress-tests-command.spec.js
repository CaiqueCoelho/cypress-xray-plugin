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
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const context_1 = __importStar(require("../../../../../context"));
const dedent_1 = require("../../../../../util/dedent");
const logging_1 = require("../../../../../util/logging");
const constant_command_1 = require("../../../../util/commands/constant-command");
const convert_cypress_tests_command_1 = require("./convert-cypress-tests-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(convert_cypress_tests_command_1.ConvertCypressTestsCommand.name, async () => {
        let options;
        (0, node_test_1.beforeEach)(() => {
            options = {
                http: {},
                jira: context_1.default.initJiraOptions({}, {
                    projectKey: "CYP",
                    url: "http://localhost:1234",
                }),
                plugin: context_1.default.initPluginOptions({}, {}),
                xray: context_1.default.initXrayOptions({}, {
                    uploadResults: true,
                }),
            };
        });
        await (0, node_test_1.describe)("<13", async () => {
            await (0, node_test_1.it)("converts test results into xray results json", async (context) => {
                var _a;
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
                const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                    normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                    projectKey: options.jira.projectKey,
                    uploadScreenshots: options.xray.uploadScreenshots,
                    xrayStatus: options.xray.status,
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
                const json = await command.compute();
                node_assert_1.default.deepStrictEqual(json, [
                    {
                        finish: "2022-11-28T17:41:15Z",
                        start: "2022-11-28T17:41:15Z",
                        status: "PASS",
                        testKey: "CYP-40",
                    },
                    {
                        finish: "2022-11-28T17:41:15Z",
                        start: "2022-11-28T17:41:15Z",
                        status: "PASS",
                        testKey: "CYP-41",
                    },
                    {
                        evidence: [
                            {
                                data: "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAoSURBVBhXY/iPA4AkGBig0hAGlISz4AwUCTggWgJIwhlESGAB//8DAAF4fYMJdJTzAAAAAElFTkSuQmCC",
                                filename: "small.png",
                            },
                        ],
                        finish: "2022-11-28T17:41:19Z",
                        start: "2022-11-28T17:41:15Z",
                        status: "FAIL",
                        testKey: "CYP-49",
                    },
                ]);
            });
            await (0, node_test_1.it)("converts test results with multiple issue keys into xray results json", async (context) => {
                var _a;
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssuesMultiple.json", "utf-8"));
                const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                    normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                    projectKey: options.jira.projectKey,
                    uploadScreenshots: options.xray.uploadScreenshots,
                    xrayStatus: options.xray.status,
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
                const json = await command.compute();
                node_assert_1.default.deepStrictEqual(json, [
                    {
                        evidence: [
                            {
                                data: "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAoSURBVBhXY/iPA4AkGBig0hAGlISz4AwUCTggWgJIwhlESGAB//8DAAF4fYMJdJTzAAAAAElFTkSuQmCC",
                                filename: "small.png",
                            },
                        ],
                        finish: "2022-11-28T17:41:15Z",
                        start: "2022-11-28T17:41:15Z",
                        status: "PASS",
                        testKey: "CYP-123",
                    },
                    {
                        evidence: [
                            {
                                data: "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAoSURBVBhXY/iPA4AkGBig0hAGlISz4AwUCTggWgJIwhlESGAB//8DAAF4fYMJdJTzAAAAAElFTkSuQmCC",
                                filename: "small.png",
                            },
                        ],
                        finish: "2022-11-28T17:41:15Z",
                        start: "2022-11-28T17:41:15Z",
                        status: "PASS",
                        testKey: "CYP-124",
                    },
                    {
                        evidence: [
                            {
                                data: "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAoSURBVBhXY/iPA4AkGBig0hAGlISz4AwUCTggWgJIwhlESGAB//8DAAF4fYMJdJTzAAAAAElFTkSuQmCC",
                                filename: "small.png",
                            },
                        ],
                        finish: "2022-11-28T17:41:15Z",
                        start: "2022-11-28T17:41:15Z",
                        status: "PASS",
                        testKey: "CYP-125",
                    },
                ]);
            });
        });
        await (0, node_test_1.describe)(">=13", async () => {
            await (0, node_test_1.it)("converts test results into xray results json", async (context) => {
                var _a;
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResult_13_0_0.json", "utf-8"));
                const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                    normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                    projectKey: options.jira.projectKey,
                    uploadScreenshots: options.xray.uploadScreenshots,
                    xrayStatus: options.xray.status,
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
                const json = await command.compute();
                node_assert_1.default.deepStrictEqual(json, [
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:28Z",
                        status: "PASS",
                        testKey: "CYP-452",
                    },
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "PASS",
                        testKey: "CYP-268",
                    },
                    {
                        evidence: [
                            {
                                data: "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAoSURBVBhXY/iPA4AkGBig0hAGlISz4AwUCTggWgJIwhlESGAB//8DAAF4fYMJdJTzAAAAAElFTkSuQmCC",
                                filename: "small CYP-237.png",
                            },
                        ],
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "FAIL",
                        testKey: "CYP-237",
                    },
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "FAIL",
                        testKey: "CYP-332",
                    },
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "TODO",
                        testKey: "CYP-333",
                    },
                ]);
            });
            await (0, node_test_1.it)("converts test results with multiple issue keys into xray results json", async (context) => {
                var _a;
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResult_13_0_0_multipleTestIssueKeys.json", "utf-8"));
                const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                    normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                    projectKey: options.jira.projectKey,
                    uploadScreenshots: options.xray.uploadScreenshots,
                    xrayStatus: options.xray.status,
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
                const json = await command.compute();
                node_assert_1.default.deepStrictEqual(json, [
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:28Z",
                        status: "PASS",
                        testKey: "CYP-452",
                    },
                    {
                        evidence: [
                            {
                                data: "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAoSURBVBhXY/iPA4AkGBig0hAGlISz4AwUCTggWgJIwhlESGAB//8DAAF4fYMJdJTzAAAAAElFTkSuQmCC",
                                filename: "small CYP-123 CYP-125.png",
                            },
                        ],
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "FAIL",
                        testKey: "CYP-123",
                    },
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "FAIL",
                        testKey: "CYP-124",
                    },
                    {
                        evidence: [
                            {
                                data: "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAoSURBVBhXY/iPA4AkGBig0hAGlISz4AwUCTggWgJIwhlESGAB//8DAAF4fYMJdJTzAAAAAElFTkSuQmCC",
                                filename: "small CYP-123 CYP-125.png",
                            },
                        ],
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "FAIL",
                        testKey: "CYP-125",
                    },
                ]);
            });
            await (0, node_test_1.it)("warns about non-attributable screenshots", async (context) => {
                var _a;
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResult_13_0_0.json", "utf-8"));
                result.runs[0].screenshots[0].path = (0, node_path_1.join)(".", "test", "resources", "small.png");
                const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                    normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                    projectKey: options.jira.projectKey,
                    uploadScreenshots: options.xray.uploadScreenshots,
                    xrayStatus: options.xray.status,
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
                const json = await command.compute();
                node_assert_1.default.deepStrictEqual(json, [
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:28Z",
                        status: "PASS",
                        testKey: "CYP-452",
                    },
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "PASS",
                        testKey: "CYP-268",
                    },
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "FAIL",
                        testKey: "CYP-237",
                    },
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "FAIL",
                        testKey: "CYP-332",
                    },
                    {
                        finish: "2023-09-09T10:59:29Z",
                        start: "2023-09-09T10:59:29Z",
                        status: "TODO",
                        testKey: "CYP-333",
                    },
                ]);
                node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                    logging_1.Level.WARNING,
                    (0, dedent_1.dedent)(`
                        ${(0, node_path_1.join)(".", "test", "resources", "small.png")}

                          Screenshot cannot be attributed to a test and will not be uploaded.

                          To upload screenshots, include test issue keys anywhere in their name:

                            cy.screenshot("CYP-123 small")
                    `),
                ]);
            });
            await (0, node_test_1.it)("uses default iterated passing statuses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/iteratedResult_13_16_0.json", "utf-8"));
                result.runs[0].tests[0].attempts[0].state = "passed";
                result.runs[0].tests[0].attempts[1].state = "passed";
                result.runs[0].tests[0].attempts[2].state = "passed";
                result.runs[0].tests[1].attempts[0].state = "passed";
                const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    normalizeScreenshotNames: false,
                    projectKey: "CYP",
                    uploadScreenshots: true,
                    useCloudStatusFallback: true,
                    xrayStatus: options.xray.status,
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
                const tests = await command.compute();
                node_assert_1.default.strictEqual(tests[0].status, "PASSED");
                node_assert_1.default.ok(tests[0].iterations);
                node_assert_1.default.strictEqual(tests[0].iterations[0].status, "PASSED");
                node_assert_1.default.strictEqual(tests[0].iterations[1].status, "PASSED");
                node_assert_1.default.strictEqual(tests[0].iterations[2].status, "PASSED");
                node_assert_1.default.strictEqual(tests[0].iterations[3].status, "PASSED");
            });
            await (0, node_test_1.it)("uses default iterated pending statuses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/iteratedResult_13_16_0.json", "utf-8"));
                result.runs[0].tests[0].attempts[0].state = "pending";
                result.runs[0].tests[0].attempts[1].state = "pending";
                result.runs[0].tests[0].attempts[2].state = "pending";
                result.runs[0].tests[1].attempts[0].state = "pending";
                const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    normalizeScreenshotNames: false,
                    projectKey: "CYP",
                    uploadScreenshots: true,
                    useCloudStatusFallback: true,
                    xrayStatus: options.xray.status,
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
                const tests = await command.compute();
                node_assert_1.default.strictEqual(tests[0].status, "TO DO");
                node_assert_1.default.ok(tests[0].iterations);
                node_assert_1.default.strictEqual(tests[0].iterations[0].status, "TO DO");
                node_assert_1.default.strictEqual(tests[0].iterations[1].status, "TO DO");
                node_assert_1.default.strictEqual(tests[0].iterations[2].status, "TO DO");
                node_assert_1.default.strictEqual(tests[0].iterations[3].status, "TO DO");
            });
            await (0, node_test_1.it)("uses default iterated skipped statuses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/iteratedResult_13_16_0.json", "utf-8"));
                result.runs[0].tests[0].attempts[0].state = "pending";
                result.runs[0].tests[0].attempts[1].state = "pending";
                result.runs[0].tests[0].attempts[2].state = "pending";
                result.runs[0].tests[1].attempts[0].state = "skipped";
                const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    normalizeScreenshotNames: false,
                    projectKey: "CYP",
                    uploadScreenshots: true,
                    useCloudStatusFallback: true,
                    xrayStatus: options.xray.status,
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
                const tests = await command.compute();
                node_assert_1.default.strictEqual(tests[0].status, "FAILED");
                node_assert_1.default.ok(tests[0].iterations);
                node_assert_1.default.strictEqual(tests[0].iterations[0].status, "TO DO");
                node_assert_1.default.strictEqual(tests[0].iterations[1].status, "TO DO");
                node_assert_1.default.strictEqual(tests[0].iterations[2].status, "TO DO");
                node_assert_1.default.strictEqual(tests[0].iterations[3].status, "FAILED");
            });
            await (0, node_test_1.it)("uses default iterated failed statuses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/iteratedResult_13_16_0.json", "utf-8"));
                const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    normalizeScreenshotNames: false,
                    projectKey: "CYP",
                    uploadScreenshots: true,
                    useCloudStatusFallback: true,
                    xrayStatus: options.xray.status,
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
                const tests = await command.compute();
                node_assert_1.default.strictEqual(tests[0].status, "FAILED");
                node_assert_1.default.ok(tests[0].iterations);
                node_assert_1.default.strictEqual(tests[0].iterations[0].status, "FAILED");
                node_assert_1.default.strictEqual(tests[0].iterations[1].status, "FAILED");
                node_assert_1.default.strictEqual(tests[0].iterations[2].status, "PASSED");
                node_assert_1.default.strictEqual(tests[0].iterations[3].status, "PASSED");
            });
            await (0, node_test_1.it)("uses custom aggregated statuses", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/iteratedResult_13_16_0.json", "utf-8"));
                const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    normalizeScreenshotNames: false,
                    projectKey: "CYP",
                    uploadScreenshots: true,
                    useCloudStatusFallback: true,
                    xrayStatus: {
                        aggregate: ({ failed, passed, pending, skipped }) => {
                            if (passed > 0 && failed === 0 && skipped === 0) {
                                return "PASSED";
                            }
                            if (passed > 0 && (failed > 0 || skipped > 0)) {
                                return "FLAKY";
                            }
                            if (pending > 0) {
                                return "TODO";
                            }
                            return "FAILED";
                        },
                    },
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
                const tests = await command.compute();
                node_assert_1.default.strictEqual(tests[0].status, "FLAKY");
                node_assert_1.default.ok(tests[0].iterations);
                node_assert_1.default.strictEqual(tests[0].iterations[0].status, "FAILED");
                node_assert_1.default.strictEqual(tests[0].iterations[1].status, "FAILED");
                node_assert_1.default.strictEqual(tests[0].iterations[2].status, "PASSED");
                node_assert_1.default.strictEqual(tests[0].iterations[3].status, "PASSED");
            });
        });
        await (0, node_test_1.it)("skips tests when encountering unknown statuses", async (context) => {
            var _a;
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultUnknownStatus.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            await node_assert_1.default.rejects(command.compute(), {
                message: "Failed to convert Cypress tests into Xray tests: No Cypress tests to upload",
            });
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Test: TodoMVC hides footer initially

                      Skipping result upload.

                        Caused by: Unknown Cypress test status: broken
                `),
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Test: TodoMVC adds 2 todos

                      Skipping result upload.

                        Caused by: Unknown Cypress test status: california
                `),
            ]);
        });
        await (0, node_test_1.it)("uploads screenshots by default", async (context) => {
            var _a, _b;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].evidence, undefined);
            node_assert_1.default.strictEqual(tests[1].evidence, undefined);
            node_assert_1.default.strictEqual((_b = tests[2].evidence) === null || _b === void 0 ? void 0 : _b.length, 1);
            node_assert_1.default.strictEqual(tests[2].evidence[0].filename, "small.png");
        });
        await (0, node_test_1.it)("skips cucumber screenshots", async (context) => {
            var _a;
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResult_13_0_0_mixed.json", "utf-8"));
            result.runs[0].screenshots[0].path = (0, node_path_1.join)(".", "test", "resources", "small CYP-237.png");
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: ".feature",
                normalizeScreenshotNames: false,
                projectKey: "CYP",
                uploadScreenshots: true,
                xrayStatus: {},
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(message.mock.callCount(), 0);
            node_assert_1.default.strictEqual(tests.length, 1);
            node_assert_1.default.strictEqual((_a = tests[0].evidence) === null || _a === void 0 ? void 0 : _a.length, 1);
            node_assert_1.default.strictEqual(tests[0].evidence[0].filename, "small CYP-237.png");
        });
        await (0, node_test_1.it)("skips screenshot upload if disabled", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            options.xray.uploadScreenshots = false;
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].evidence, undefined);
            node_assert_1.default.strictEqual(tests[1].evidence, undefined);
            node_assert_1.default.strictEqual(tests[2].evidence, undefined);
        });
        await (0, node_test_1.it)("normalizes screenshot filenames if enabled", async (context) => {
            var _a, _b;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultProblematicScreenshot.json", "utf-8"));
            options.plugin.normalizeScreenshotNames = true;
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual((_b = tests[0].evidence) === null || _b === void 0 ? void 0 : _b.length, 1);
            node_assert_1.default.strictEqual(tests[0].evidence[0].filename, "t_rtle_with_problem_tic_name.png");
        });
        await (0, node_test_1.it)("does not normalize screenshot filenames by default", async (context) => {
            var _a, _b;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultProblematicScreenshot.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual((_b = tests[0].evidence) === null || _b === void 0 ? void 0 : _b.length, 1);
            node_assert_1.default.strictEqual(tests[0].evidence[0].filename, "tûrtle with problemätic name.png");
        });
        await (0, node_test_1.it)("includes all evidence", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResult_13_0_0.json", "utf-8"));
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            evidenceCollection.addEvidence("CYP-452", {
                contentType: "text/plain",
                data: "aGkgdGhlcmU=",
                filename: "hi.txt",
            });
            evidenceCollection.addEvidence("CYP-237", {
                contentType: "text/plain",
                data: "Z29vZGJ5ZQ==",
                filename: "goodbye.txt",
            });
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: evidenceCollection,
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.deepStrictEqual(tests, [
                {
                    evidence: [
                        {
                            contentType: "text/plain",
                            data: "aGkgdGhlcmU=",
                            filename: "hi.txt",
                        },
                    ],
                    finish: "2023-09-09T10:59:29Z",
                    start: "2023-09-09T10:59:28Z",
                    status: "PASS",
                    testKey: "CYP-452",
                },
                {
                    finish: "2023-09-09T10:59:29Z",
                    start: "2023-09-09T10:59:29Z",
                    status: "PASS",
                    testKey: "CYP-268",
                },
                {
                    evidence: [
                        {
                            contentType: "text/plain",
                            data: "Z29vZGJ5ZQ==",
                            filename: "goodbye.txt",
                        },
                        {
                            data: "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAoSURBVBhXY/iPA4AkGBig0hAGlISz4AwUCTggWgJIwhlESGAB//8DAAF4fYMJdJTzAAAAAElFTkSuQmCC",
                            filename: "small CYP-237.png",
                        },
                    ],
                    finish: "2023-09-09T10:59:29Z",
                    start: "2023-09-09T10:59:29Z",
                    status: "FAIL",
                    testKey: "CYP-237",
                },
                {
                    finish: "2023-09-09T10:59:29Z",
                    start: "2023-09-09T10:59:29Z",
                    status: "FAIL",
                    testKey: "CYP-332",
                },
                {
                    finish: "2023-09-09T10:59:29Z",
                    start: "2023-09-09T10:59:29Z",
                    status: "TODO",
                    testKey: "CYP-333",
                },
            ]);
        });
        await (0, node_test_1.it)("uses custom passed statuses", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            options.xray.status = { passed: "it worked" };
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].status, "it worked");
            node_assert_1.default.strictEqual(tests[1].status, "it worked");
        });
        await (0, node_test_1.it)("uses custom failed statuses", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            options.xray.status = { failed: "it did not work" };
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[2].status, "it did not work");
        });
        await (0, node_test_1.it)("uses custom pending statuses", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultPending.json", "utf-8"));
            options.xray.status = { pending: "still pending" };
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].status, "still pending");
            node_assert_1.default.strictEqual(tests[1].status, "still pending");
            node_assert_1.default.strictEqual(tests[2].status, "still pending");
            node_assert_1.default.strictEqual(tests[3].status, "still pending");
        });
        await (0, node_test_1.it)("uses custom skipped statuses", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultSkipped.json", "utf-8"));
            options.xray.status = { skipped: "omit" };
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[1].status, "omit");
        });
        await (0, node_test_1.it)("uses default iterated passing statuses", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/iteratedResult.json", "utf-8"));
            result.runs[0].tests[0].attempts[0].state = "passed";
            result.runs[0].tests[0].attempts[1].state = "passed";
            result.runs[0].tests[0].attempts[2].state = "passed";
            result.runs[0].tests[1].attempts[0].state = "passed";
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                normalizeScreenshotNames: false,
                projectKey: "CYP",
                uploadScreenshots: true,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].status, "PASS");
            node_assert_1.default.ok(tests[0].iterations);
            node_assert_1.default.strictEqual(tests[0].iterations[0].status, "PASS");
            node_assert_1.default.strictEqual(tests[0].iterations[1].status, "PASS");
            node_assert_1.default.strictEqual(tests[0].iterations[2].status, "PASS");
            node_assert_1.default.strictEqual(tests[0].iterations[3].status, "PASS");
        });
        await (0, node_test_1.it)("uses default iterated pending statuses", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/iteratedResult.json", "utf-8"));
            result.runs[0].tests[0].attempts[0].state = "pending";
            result.runs[0].tests[0].attempts[1].state = "pending";
            result.runs[0].tests[0].attempts[2].state = "pending";
            result.runs[0].tests[1].attempts[0].state = "pending";
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                normalizeScreenshotNames: false,
                projectKey: "CYP",
                uploadScreenshots: true,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].status, "TODO");
            node_assert_1.default.ok(tests[0].iterations);
            node_assert_1.default.strictEqual(tests[0].iterations[0].status, "TODO");
            node_assert_1.default.strictEqual(tests[0].iterations[1].status, "TODO");
            node_assert_1.default.strictEqual(tests[0].iterations[2].status, "TODO");
            node_assert_1.default.strictEqual(tests[0].iterations[3].status, "TODO");
        });
        await (0, node_test_1.it)("uses default iterated skipped statuses", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/iteratedResult.json", "utf-8"));
            result.runs[0].tests[0].attempts[0].state = "pending";
            result.runs[0].tests[0].attempts[1].state = "pending";
            result.runs[0].tests[0].attempts[2].state = "pending";
            result.runs[0].tests[1].attempts[0].state = "skipped";
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                normalizeScreenshotNames: false,
                projectKey: "CYP",
                uploadScreenshots: true,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].status, "FAIL");
            node_assert_1.default.ok(tests[0].iterations);
            node_assert_1.default.strictEqual(tests[0].iterations[0].status, "TODO");
            node_assert_1.default.strictEqual(tests[0].iterations[1].status, "TODO");
            node_assert_1.default.strictEqual(tests[0].iterations[2].status, "TODO");
            node_assert_1.default.strictEqual(tests[0].iterations[3].status, "FAIL");
        });
        await (0, node_test_1.it)("uses default iterated failed statuses", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/iteratedResult.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                normalizeScreenshotNames: false,
                projectKey: "CYP",
                uploadScreenshots: true,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].status, "FAIL");
            node_assert_1.default.ok(tests[0].iterations);
            node_assert_1.default.strictEqual(tests[0].iterations[0].status, "FAIL");
            node_assert_1.default.strictEqual(tests[0].iterations[1].status, "FAIL");
            node_assert_1.default.strictEqual(tests[0].iterations[2].status, "PASS");
            node_assert_1.default.strictEqual(tests[0].iterations[3].status, "PASS");
        });
        await (0, node_test_1.it)("uses custom aggregated statuses", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/iteratedResult.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                normalizeScreenshotNames: false,
                projectKey: "CYP",
                uploadScreenshots: true,
                xrayStatus: {
                    aggregate: ({ failed, passed, pending, skipped }) => {
                        if (passed > 0 && failed === 0 && skipped === 0) {
                            return "PASSED";
                        }
                        if (passed > 0 && (failed > 0 || skipped > 0)) {
                            return "FLAKY";
                        }
                        if (pending > 0) {
                            return "TODO";
                        }
                        return "FAILED";
                    },
                },
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].status, "FLAKY");
            node_assert_1.default.ok(tests[0].iterations);
            node_assert_1.default.strictEqual(tests[0].iterations[0].status, "FAIL");
            node_assert_1.default.strictEqual(tests[0].iterations[1].status, "FAIL");
            node_assert_1.default.strictEqual(tests[0].iterations[2].status, "PASS");
            node_assert_1.default.strictEqual(tests[0].iterations[3].status, "PASS");
        });
        await (0, node_test_1.it)("does not modify test information", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].testInfo, undefined);
            node_assert_1.default.strictEqual(tests[1].testInfo, undefined);
            node_assert_1.default.strictEqual(tests[2].testInfo, undefined);
        });
        await (0, node_test_1.it)("includes test issue keys", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].testKey, "CYP-40");
            node_assert_1.default.strictEqual(tests[1].testKey, "CYP-41");
            node_assert_1.default.strictEqual(tests[2].testKey, "CYP-49");
        });
        await (0, node_test_1.it)("defaults to server status values", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].status, "PASS");
            node_assert_1.default.strictEqual(tests[1].status, "PASS");
            node_assert_1.default.strictEqual(tests[2].status, "FAIL");
        });
        await (0, node_test_1.it)("uses cloud status values", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                useCloudStatusFallback: true,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            const tests = await command.compute();
            node_assert_1.default.strictEqual(tests[0].status, "PASSED");
            node_assert_1.default.strictEqual(tests[1].status, "PASSED");
            node_assert_1.default.strictEqual(tests[2].status, "FAILED");
        });
        await (0, node_test_1.it)("throws if no native cypress tests were executed", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                featureFileExtension: ".ts",
                normalizeScreenshotNames: options.plugin.normalizeScreenshotNames,
                projectKey: options.jira.projectKey,
                uploadScreenshots: options.xray.uploadScreenshots,
                xrayStatus: options.xray.status,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            await node_assert_1.default.rejects(command.compute(), {
                message: "Failed to extract test run data: Only Cucumber tests were executed",
            });
        });
        await (0, node_test_1.it)("returns its parameters", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            const command = new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                normalizeScreenshotNames: true,
                projectKey: "CYP",
                uploadScreenshots: false,
                xrayStatus: {
                    failed: "FAILED",
                    passed: "PASSED",
                    pending: "TODO",
                    skipped: "TODO",
                },
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, result));
            node_assert_1.default.deepStrictEqual(command.getParameters(), {
                evidenceCollection: new context_1.SimpleEvidenceCollection(),
                normalizeScreenshotNames: true,
                projectKey: "CYP",
                uploadScreenshots: false,
                xrayStatus: {
                    failed: "FAILED",
                    passed: "PASSED",
                    pending: "TODO",
                    skipped: "TODO",
                },
            });
        });
    });
});
