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
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const credentials_1 = require("./client/authentication/credentials");
const requests_1 = require("./client/https/requests");
const jira_client_1 = require("./client/jira/jira-client");
const xray_client_cloud_1 = require("./client/xray/xray-client-cloud");
const xray_client_server_1 = require("./client/xray/xray-client-server");
const context_1 = __importStar(require("./context"));
const dedent_1 = require("./util/dedent");
const dependencies_1 = __importDefault(require("./util/dependencies"));
const executable_graph_1 = require("./util/graph/executable-graph");
const logging_1 = require("./util/logging");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)("the plugin context configuration", async () => {
        await (0, node_test_1.describe)("the option initialization", async () => {
            await (0, node_test_1.describe)("should have certain default values", async () => {
                await (0, node_test_1.describe)("jira", async () => {
                    const jiraOptions = context_1.default.initJiraOptions({}, {
                        projectKey: "PRJ",
                        url: "http://localhost:1234",
                    });
                    await (0, node_test_1.it)("attachVideos", () => {
                        node_assert_1.default.strictEqual(jiraOptions.attachVideos, false);
                    });
                    await (0, node_test_1.describe)("fields", async () => {
                        await (0, node_test_1.it)("description", () => {
                            node_assert_1.default.strictEqual(jiraOptions.fields.description, undefined);
                        });
                        await (0, node_test_1.it)("labels", () => {
                            node_assert_1.default.strictEqual(jiraOptions.fields.labels, undefined);
                        });
                        await (0, node_test_1.it)("summary", () => {
                            node_assert_1.default.strictEqual(jiraOptions.fields.summary, undefined);
                        });
                        await (0, node_test_1.it)("testEnvironments", () => {
                            node_assert_1.default.strictEqual(jiraOptions.fields.testEnvironments, undefined);
                        });
                        await (0, node_test_1.it)("testPlan", () => {
                            node_assert_1.default.strictEqual(jiraOptions.fields.testPlan, undefined);
                        });
                    });
                    await (0, node_test_1.it)("testExecutionIssue", () => {
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssue, undefined);
                    });
                    await (0, node_test_1.it)("testExecutionIssueDescription", () => {
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueDescription, undefined);
                    });
                    await (0, node_test_1.it)("testExecutionIssueKey", () => {
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueKey, undefined);
                    });
                    await (0, node_test_1.it)("testExecutionIssueSummary", () => {
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueSummary, undefined);
                    });
                    await (0, node_test_1.it)("testExecutionIssueType", () => {
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueType, "Test Execution");
                    });
                    await (0, node_test_1.it)("testPlanIssueKey", () => {
                        node_assert_1.default.strictEqual(jiraOptions.testPlanIssueKey, undefined);
                    });
                    await (0, node_test_1.it)("testPlanIssueType", () => {
                        node_assert_1.default.strictEqual(jiraOptions.testPlanIssueType, "Test Plan");
                    });
                });
                await (0, node_test_1.describe)("plugin", async () => {
                    const pluginOptions = context_1.default.initPluginOptions({}, {});
                    await (0, node_test_1.it)("debug", () => {
                        node_assert_1.default.strictEqual(pluginOptions.debug, false);
                    });
                    await (0, node_test_1.it)("enabled", () => {
                        node_assert_1.default.strictEqual(pluginOptions.enabled, true);
                    });
                    await (0, node_test_1.it)("logDirectory", () => {
                        node_assert_1.default.strictEqual(pluginOptions.logDirectory, "logs");
                    });
                    await (0, node_test_1.it)("normalizeScreenshotNames", () => {
                        node_assert_1.default.strictEqual(pluginOptions.normalizeScreenshotNames, false);
                    });
                });
                await (0, node_test_1.describe)("xray", async () => {
                    const xrayOptions = context_1.default.initXrayOptions({}, {});
                    await (0, node_test_1.describe)("status", async () => {
                        await (0, node_test_1.it)("failed", () => {
                            node_assert_1.default.strictEqual(xrayOptions.status.failed, undefined);
                        });
                        await (0, node_test_1.it)("passed", () => {
                            node_assert_1.default.strictEqual(xrayOptions.status.passed, undefined);
                        });
                        await (0, node_test_1.it)("pending", () => {
                            node_assert_1.default.strictEqual(xrayOptions.status.pending, undefined);
                        });
                        await (0, node_test_1.it)("skipped", () => {
                            node_assert_1.default.strictEqual(xrayOptions.status.skipped, undefined);
                        });
                        await (0, node_test_1.describe)("step", async () => {
                            await (0, node_test_1.it)("failed", () => {
                                var _a;
                                node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.failed, undefined);
                            });
                            await (0, node_test_1.it)("passed", () => {
                                var _a;
                                node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.passed, undefined);
                            });
                            await (0, node_test_1.it)("pending", () => {
                                var _a;
                                node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.pending, undefined);
                            });
                            await (0, node_test_1.it)("skipped", () => {
                                var _a;
                                node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.skipped, undefined);
                            });
                        });
                    });
                    await (0, node_test_1.it)("testEnvironments", () => {
                        node_assert_1.default.strictEqual(xrayOptions.testEnvironments, undefined);
                    });
                    await (0, node_test_1.it)("uploadResults", () => {
                        node_assert_1.default.strictEqual(xrayOptions.uploadResults, true);
                    });
                    await (0, node_test_1.it)("uploadScreenshots", () => {
                        node_assert_1.default.strictEqual(xrayOptions.uploadScreenshots, true);
                    });
                });
                await (0, node_test_1.describe)("cucumber", async () => {
                    let cucumberOptions = undefined;
                    (0, node_test_1.beforeEach)(async () => {
                        cucumberOptions = await context_1.default.initCucumberOptions({
                            env: {
                                jsonEnabled: true,
                            },
                            excludeSpecPattern: "",
                            projectRoot: "",
                            reporter: "",
                            specPattern: "",
                            testingType: "e2e",
                        }, { featureFileExtension: ".feature" });
                    });
                    await (0, node_test_1.it)("downloadFeatures", () => {
                        node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.downloadFeatures, false);
                    });
                    await (0, node_test_1.describe)("prefixes", async () => {
                        await (0, node_test_1.it)("precondition", () => {
                            node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.prefixes.precondition, undefined);
                        });
                        await (0, node_test_1.it)("test", () => {
                            node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.prefixes.test, undefined);
                        });
                    });
                    await (0, node_test_1.it)("uploadFeatures", () => {
                        node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.uploadFeatures, false);
                    });
                });
            });
            await (0, node_test_1.describe)("should prefer provided values over default ones", async () => {
                await (0, node_test_1.describe)("jira", async () => {
                    await (0, node_test_1.it)("attachVideos", () => {
                        const jiraOptions = context_1.default.initJiraOptions({}, {
                            attachVideos: true,
                            projectKey: "PRJ",
                            url: "http://localhost:1234",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.attachVideos, true);
                    });
                    await (0, node_test_1.describe)("fields", async () => {
                        await (0, node_test_1.it)("description", () => {
                            const jiraOptions = context_1.default.initJiraOptions({}, {
                                fields: {
                                    description: "Beschreibung",
                                },
                                projectKey: "PRJ",
                                url: "https://example.org",
                            });
                            node_assert_1.default.strictEqual(jiraOptions.fields.description, "Beschreibung");
                        });
                        await (0, node_test_1.it)("labels", () => {
                            const jiraOptions = context_1.default.initJiraOptions({}, {
                                fields: {
                                    labels: "Stichworte",
                                },
                                projectKey: "PRJ",
                                url: "https://example.org",
                            });
                            node_assert_1.default.strictEqual(jiraOptions.fields.labels, "Stichworte");
                        });
                        await (0, node_test_1.it)("summary", () => {
                            const jiraOptions = context_1.default.initJiraOptions({}, {
                                fields: {
                                    summary: "Résumé",
                                },
                                projectKey: "PRJ",
                                url: "https://example.org",
                            });
                            node_assert_1.default.strictEqual(jiraOptions.fields.summary, "Résumé");
                        });
                        await (0, node_test_1.it)("testEnvironments", () => {
                            const jiraOptions = context_1.default.initJiraOptions({}, {
                                fields: {
                                    testEnvironments: "Testumgebungen",
                                },
                                projectKey: "PRJ",
                                url: "http://localhost:1234",
                            });
                            node_assert_1.default.strictEqual(jiraOptions.fields.testEnvironments, "Testumgebungen");
                        });
                        await (0, node_test_1.it)("testPlan", () => {
                            const jiraOptions = context_1.default.initJiraOptions({}, {
                                fields: {
                                    testPlan: "Plan de Test",
                                },
                                projectKey: "PRJ",
                                url: "http://localhost:1234",
                            });
                            node_assert_1.default.strictEqual(jiraOptions.fields.testPlan, "Plan de Test");
                        });
                    });
                    await (0, node_test_1.it)("testExecutionIssue", () => {
                        const jiraOptions = context_1.default.initJiraOptions({}, {
                            projectKey: "PRJ",
                            testExecutionIssue: { fields: { summary: "hello" } },
                            url: "http://localhost:1234",
                        });
                        node_assert_1.default.deepStrictEqual(jiraOptions.testExecutionIssue, {
                            fields: { summary: "hello" },
                        });
                    });
                    await (0, node_test_1.it)("testExecutionIssueDescription", () => {
                        const jiraOptions = context_1.default.initJiraOptions({}, {
                            projectKey: "PRJ",
                            testExecutionIssueDescription: "hello",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueDescription, "hello");
                    });
                    await (0, node_test_1.it)("testExecutionIssueKey", () => {
                        const jiraOptions = context_1.default.initJiraOptions({}, {
                            projectKey: "PRJ",
                            testExecutionIssueKey: "PRJ-123",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueKey, "PRJ-123");
                    });
                    await (0, node_test_1.it)("testExecutionIssueSummary", () => {
                        const jiraOptions = context_1.default.initJiraOptions({}, {
                            projectKey: "PRJ",
                            testExecutionIssueSummary: "Test - Login",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueSummary, "Test - Login");
                    });
                    await (0, node_test_1.it)("testExecutionIssueType", () => {
                        const jiraOptions = context_1.default.initJiraOptions({}, {
                            projectKey: "PRJ",
                            testExecutionIssueType: "Execution Ticket",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueType, "Execution Ticket");
                    });
                    await (0, node_test_1.it)("testPlanIssueKey", () => {
                        const jiraOptions = context_1.default.initJiraOptions({}, {
                            projectKey: "PRJ",
                            testPlanIssueKey: "PRJ-456",
                            url: "http://localhost:1234",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testPlanIssueKey, "PRJ-456");
                    });
                    await (0, node_test_1.it)("testPlanIssueType", () => {
                        const jiraOptions = context_1.default.initJiraOptions({}, {
                            projectKey: "PRJ",
                            testPlanIssueType: "Plan Ticket",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testPlanIssueType, "Plan Ticket");
                    });
                    await (0, node_test_1.it)("url", () => {
                        const jiraOptions = context_1.default.initJiraOptions({}, {
                            projectKey: "PRJ",
                            url: "http://localhost:1234",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.url, "http://localhost:1234");
                    });
                });
                await (0, node_test_1.describe)("plugin", async () => {
                    await (0, node_test_1.it)("debug", () => {
                        const pluginOptions = context_1.default.initPluginOptions({}, {
                            debug: true,
                        });
                        node_assert_1.default.strictEqual(pluginOptions.debug, true);
                    });
                    await (0, node_test_1.it)("enabled", () => {
                        const pluginOptions = context_1.default.initPluginOptions({}, {
                            enabled: false,
                        });
                        node_assert_1.default.strictEqual(pluginOptions.enabled, false);
                    });
                    await (0, node_test_1.it)("logDirectory", () => {
                        const pluginOptions = context_1.default.initPluginOptions({}, {
                            logDirectory: "./logs/",
                        });
                        node_assert_1.default.strictEqual(pluginOptions.logDirectory, "./logs/");
                    });
                    await (0, node_test_1.it)("normalizeScreenshotNames", () => {
                        const pluginOptions = context_1.default.initPluginOptions({}, {
                            normalizeScreenshotNames: true,
                        });
                        node_assert_1.default.strictEqual(pluginOptions.normalizeScreenshotNames, true);
                    });
                });
                await (0, node_test_1.describe)("xray", async () => {
                    await (0, node_test_1.describe)("status", async () => {
                        await (0, node_test_1.it)("failed", () => {
                            const xrayOptions = context_1.default.initXrayOptions({}, {
                                status: {
                                    failed: "BAD",
                                },
                            });
                            node_assert_1.default.strictEqual(xrayOptions.status.failed, "BAD");
                        });
                        await (0, node_test_1.it)("passed", () => {
                            const xrayOptions = context_1.default.initXrayOptions({}, {
                                status: {
                                    passed: "GOOD",
                                },
                            });
                            node_assert_1.default.strictEqual(xrayOptions.status.passed, "GOOD");
                        });
                        await (0, node_test_1.it)("pending", () => {
                            const xrayOptions = context_1.default.initXrayOptions({}, {
                                status: {
                                    pending: "PENDULUM",
                                },
                            });
                            node_assert_1.default.strictEqual(xrayOptions.status.pending, "PENDULUM");
                        });
                        await (0, node_test_1.it)("skipped", () => {
                            const xrayOptions = context_1.default.initXrayOptions({}, {
                                status: {
                                    skipped: "SKIPPING STONE",
                                },
                            });
                            node_assert_1.default.strictEqual(xrayOptions.status.skipped, "SKIPPING STONE");
                        });
                        await (0, node_test_1.describe)("step", async () => {
                            await (0, node_test_1.it)("failed", () => {
                                var _a;
                                const xrayOptions = context_1.default.initXrayOptions({}, {
                                    status: {
                                        step: {
                                            failed: "BAD",
                                        },
                                    },
                                });
                                node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.failed, "BAD");
                            });
                            await (0, node_test_1.it)("passed", () => {
                                var _a;
                                const xrayOptions = context_1.default.initXrayOptions({}, {
                                    status: {
                                        step: {
                                            passed: "GOOD",
                                        },
                                    },
                                });
                                node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.passed, "GOOD");
                            });
                            await (0, node_test_1.it)("pending", () => {
                                var _a;
                                const xrayOptions = context_1.default.initXrayOptions({}, {
                                    status: {
                                        step: {
                                            pending: "PENDULUM",
                                        },
                                    },
                                });
                                node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.pending, "PENDULUM");
                            });
                            await (0, node_test_1.it)("skipped", () => {
                                var _a;
                                const xrayOptions = context_1.default.initXrayOptions({}, {
                                    status: {
                                        step: {
                                            skipped: "SKIPPING STONE",
                                        },
                                    },
                                });
                                node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.skipped, "SKIPPING STONE");
                            });
                        });
                    });
                    await (0, node_test_1.it)("testEnvironments", () => {
                        const xrayOptions = context_1.default.initXrayOptions({}, {
                            testEnvironments: ["Test", "Prod"],
                        });
                        node_assert_1.default.deepStrictEqual(xrayOptions.testEnvironments, ["Test", "Prod"]);
                    });
                    await (0, node_test_1.it)("uploadResults", () => {
                        const xrayOptions = context_1.default.initXrayOptions({}, {
                            uploadResults: false,
                        });
                        node_assert_1.default.strictEqual(xrayOptions.uploadResults, false);
                    });
                    await (0, node_test_1.it)("uploadScreenshots", () => {
                        const xrayOptions = context_1.default.initXrayOptions({}, {
                            uploadScreenshots: false,
                        });
                        node_assert_1.default.strictEqual(xrayOptions.uploadScreenshots, false);
                    });
                });
                await (0, node_test_1.describe)("cucumber", async () => {
                    await (0, node_test_1.it)("downloadFeatures", async () => {
                        const cucumberOptions = await context_1.default.initCucumberOptions({
                            env: { jsonEnabled: true },
                            excludeSpecPattern: "",
                            projectRoot: "",
                            reporter: "",
                            specPattern: "",
                            testingType: "component",
                        }, {
                            downloadFeatures: true,
                            featureFileExtension: ".feature",
                        });
                        node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.downloadFeatures, true);
                    });
                    await (0, node_test_1.describe)("prefixes", async () => {
                        await (0, node_test_1.it)("precondition", async () => {
                            const cucumberOptions = await context_1.default.initCucumberOptions({
                                env: { jsonEnabled: true },
                                excludeSpecPattern: "",
                                projectRoot: "",
                                reporter: "",
                                specPattern: "",
                                testingType: "component",
                            }, {
                                featureFileExtension: ".feature",
                                prefixes: { precondition: "PreconditionYeah_" },
                            });
                            node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.prefixes.precondition, "PreconditionYeah_");
                        });
                        await (0, node_test_1.it)("test", async () => {
                            const cucumberOptions = await context_1.default.initCucumberOptions({
                                env: { jsonEnabled: true },
                                excludeSpecPattern: "",
                                projectRoot: "",
                                reporter: "",
                                specPattern: "",
                                testingType: "component",
                            }, {
                                featureFileExtension: ".feature",
                                prefixes: { test: "TestSomething_" },
                            });
                            node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.prefixes.test, "TestSomething_");
                        });
                    });
                    await (0, node_test_1.it)("uploadFeatures", async () => {
                        const cucumberOptions = await context_1.default.initCucumberOptions({
                            env: { jsonEnabled: true },
                            excludeSpecPattern: "",
                            projectRoot: "",
                            reporter: "",
                            specPattern: "",
                            testingType: "component",
                        }, {
                            featureFileExtension: ".feature",
                            uploadFeatures: true,
                        });
                        node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.uploadFeatures, true);
                    });
                });
            });
            await (0, node_test_1.describe)("should prefer environment variables over provided values", async () => {
                await (0, node_test_1.describe)("jira", async () => {
                    await (0, node_test_1.it)("JIRA_PROJECT_KEY", () => {
                        const env = {
                            ["JIRA_PROJECT_KEY"]: "ABC",
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            projectKey: "CYP",
                            url: "http://localhost:1234",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.projectKey, "ABC");
                    });
                    await (0, node_test_1.it)("JIRA_ATTACH_VIDEOS", () => {
                        const env = {
                            ["JIRA_ATTACH_VIDEOS"]: "true",
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            attachVideos: false,
                            projectKey: "CYP",
                            url: "http://localhost:1234",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.attachVideos, true);
                    });
                    await (0, node_test_1.describe)("fields", async () => {
                        await (0, node_test_1.it)("JIRA_FIELDS_DESCRIPTION", () => {
                            const env = {
                                ["JIRA_FIELDS_DESCRIPTION"]: "customfield_98765",
                            };
                            const jiraOptions = context_1.default.initJiraOptions(env, {
                                fields: {
                                    description: "customfield_12345",
                                },
                                projectKey: "PRJ",
                                url: "https://example.org",
                            });
                            node_assert_1.default.strictEqual(jiraOptions.fields.description, "customfield_98765");
                        });
                        await (0, node_test_1.it)("JIRA_FIELDS_LABELS", () => {
                            const env = {
                                ["JIRA_FIELDS_LABELS"]: "customfield_98765",
                            };
                            const jiraOptions = context_1.default.initJiraOptions(env, {
                                fields: {
                                    labels: "customfield_12345",
                                },
                                projectKey: "PRJ",
                                url: "https://example.org",
                            });
                            node_assert_1.default.strictEqual(jiraOptions.fields.labels, "customfield_98765");
                        });
                        await (0, node_test_1.it)("JIRA_FIELDS_SUMMARY", () => {
                            const env = {
                                ["JIRA_FIELDS_SUMMARY"]: "customfield_98765",
                            };
                            const jiraOptions = context_1.default.initJiraOptions(env, {
                                fields: {
                                    summary: "customfield_12345",
                                },
                                projectKey: "PRJ",
                                url: "https://example.org",
                            });
                            node_assert_1.default.strictEqual(jiraOptions.fields.summary, "customfield_98765");
                        });
                        await (0, node_test_1.it)("JIRA_FIELDS_TEST_ENVIRONMENTS", () => {
                            const env = {
                                ["JIRA_FIELDS_TEST_ENVIRONMENTS"]: "customfield_98765",
                            };
                            const jiraOptions = context_1.default.initJiraOptions(env, {
                                fields: {
                                    testEnvironments: "customfield_12345",
                                },
                                projectKey: "PRJ",
                                url: "http://localhost:1234",
                            });
                            node_assert_1.default.strictEqual(jiraOptions.fields.testEnvironments, "customfield_98765");
                        });
                        await (0, node_test_1.it)("JIRA_FIELDS_TEST_PLAN", () => {
                            const env = {
                                ["JIRA_FIELDS_TEST_PLAN"]: "customfield_98765",
                            };
                            const jiraOptions = context_1.default.initJiraOptions(env, {
                                fields: {
                                    testPlan: "customfield_12345",
                                },
                                projectKey: "PRJ",
                                url: "http://localhost:1234",
                            });
                            node_assert_1.default.strictEqual(jiraOptions.fields.testPlan, "customfield_98765");
                        });
                    });
                    await (0, node_test_1.it)("JIRA_TEST_EXECUTION_ISSUE", () => {
                        const env = {
                            ["JIRA_TEST_EXECUTION_ISSUE"]: {
                                fields: {
                                    ["customfield_12345"]: "Jeff",
                                    summary: "Hello bonjour",
                                },
                            },
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            projectKey: "CYP",
                            testExecutionIssue: {
                                fields: {
                                    description: "hey",
                                },
                            },
                            url: "http://localhost:1234",
                        });
                        node_assert_1.default.deepStrictEqual(jiraOptions.testExecutionIssue, {
                            fields: {
                                ["customfield_12345"]: "Jeff",
                                summary: "Hello bonjour",
                            },
                        });
                    });
                    await (0, node_test_1.it)("JIRA_TEST_EXECUTION_ISSUE_DESCRIPTION", () => {
                        const env = {
                            ["JIRA_TEST_EXECUTION_ISSUE_DESCRIPTION"]: "Good morning",
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            projectKey: "CYP",
                            testExecutionIssueDescription: "Goodbye",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueDescription, "Good morning");
                    });
                    await (0, node_test_1.it)("JIRA_TEST_EXECUTION_ISSUE_KEY", () => {
                        const env = {
                            ["JIRA_TEST_EXECUTION_ISSUE_KEY"]: "CYP-123",
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            projectKey: "CYP",
                            testExecutionIssueKey: "CYP-789",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueKey, "CYP-123");
                    });
                    await (0, node_test_1.it)("JIRA_TEST_EXECUTION_ISSUE_SUMMARY", () => {
                        const env = {
                            ["JIRA_TEST_EXECUTION_ISSUE_SUMMARY"]: "Some test case",
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            projectKey: "CYP",
                            testExecutionIssueSummary: "Summarini",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueSummary, "Some test case");
                    });
                    await (0, node_test_1.it)("JIRA_TEST_EXECUTION_ISSUE_TYPE", () => {
                        const env = {
                            ["JIRA_TEST_EXECUTION_ISSUE_TYPE"]: "Execution Issue",
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            projectKey: "CYP",
                            testExecutionIssueType: "Execution",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testExecutionIssueType, "Execution Issue");
                    });
                    await (0, node_test_1.it)("JIRA_TEST_PLAN_ISSUE_KEY", () => {
                        const env = {
                            ["JIRA_TEST_PLAN_ISSUE_KEY"]: "CYP-456",
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            projectKey: "CYP",
                            testPlanIssueKey: "CYP-123",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testPlanIssueKey, "CYP-456");
                    });
                    await (0, node_test_1.it)("JIRA_TEST_PLAN_ISSUE_TYPE", () => {
                        const env = {
                            ["JIRA_TEST_PLAN_ISSUE_TYPE"]: "Plan Issue",
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            projectKey: "CYP",
                            testExecutionIssueType: "Plan",
                            url: "https://example.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testPlanIssueType, "Plan Issue");
                    });
                    await (0, node_test_1.it)("JIRA_TEST_PLAN_ISSUE_KEY", () => {
                        const env = {
                            ["JIRA_TEST_PLAN_ISSUE_KEY"]: "CYP-456",
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            projectKey: "CYP",
                            testPlanIssueKey: "CYP-123",
                            url: "http://localhost:1234",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.testPlanIssueKey, "CYP-456");
                    });
                    await (0, node_test_1.it)("JIRA_URL", () => {
                        const env = {
                            ["JIRA_URL"]: "http://localhost:1234",
                        };
                        const jiraOptions = context_1.default.initJiraOptions(env, {
                            projectKey: "CYP",
                            url: "https://some.domain.org",
                        });
                        node_assert_1.default.strictEqual(jiraOptions.url, "http://localhost:1234");
                    });
                });
                await (0, node_test_1.describe)("xray", async () => {
                    await (0, node_test_1.it)("XRAY_STATUS_FAILED", () => {
                        const env = {
                            ["XRAY_STATUS_FAILED"]: "no",
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            status: {
                                failed: "ERROR",
                            },
                        });
                        node_assert_1.default.strictEqual(xrayOptions.status.failed, "no");
                    });
                    await (0, node_test_1.it)("XRAY_STATUS_PASSED", () => {
                        const env = {
                            ["XRAY_STATUS_PASSED"]: "ok",
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            status: {
                                passed: "FLYBY",
                            },
                        });
                        node_assert_1.default.strictEqual(xrayOptions.status.passed, "ok");
                    });
                    await (0, node_test_1.it)("XRAY_STATUS_PENDING", () => {
                        const env = {
                            ["XRAY_STATUS_PENDING"]: "pendulum",
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            status: {
                                pending: "PENCIL",
                            },
                        });
                        node_assert_1.default.strictEqual(xrayOptions.status.pending, "pendulum");
                    });
                    await (0, node_test_1.it)("XRAY_STATUS_SKIPPED", () => {
                        const env = {
                            ["XRAY_STATUS_SKIPPED"]: "ski-ba-bop-ba-dop-bop",
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            status: {
                                skipped: "HOP",
                            },
                        });
                        node_assert_1.default.strictEqual(xrayOptions.status.skipped, "ski-ba-bop-ba-dop-bop");
                    });
                    await (0, node_test_1.it)("XRAY_STATUS_STEP_FAILED", () => {
                        var _a;
                        const env = {
                            ["XRAY_STATUS_STEP_FAILED"]: "no",
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            status: {
                                step: {
                                    failed: "ERROR",
                                },
                            },
                        });
                        node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.failed, "no");
                    });
                    await (0, node_test_1.it)("XRAY_STATUS_STEP_PASSED", () => {
                        var _a;
                        const env = {
                            ["XRAY_STATUS_STEP_PASSED"]: "ok",
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            status: {
                                step: { passed: "FLYBY" },
                            },
                        });
                        node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.passed, "ok");
                    });
                    await (0, node_test_1.it)("XRAY_STATUS_STEP_PENDING", () => {
                        var _a;
                        const env = {
                            ["XRAY_STATUS_STEP_PENDING"]: "pendulum",
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            status: {
                                step: { pending: "PENCIL" },
                            },
                        });
                        node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.pending, "pendulum");
                    });
                    await (0, node_test_1.it)("XRAY_STATUS_STEP_SKIPPED", () => {
                        var _a;
                        const env = {
                            ["XRAY_STATUS_STEP_SKIPPED"]: "ski-ba-bop-ba-dop-bop",
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            status: {
                                step: { skipped: "HOP" },
                            },
                        });
                        node_assert_1.default.strictEqual((_a = xrayOptions.status.step) === null || _a === void 0 ? void 0 : _a.skipped, "ski-ba-bop-ba-dop-bop");
                    });
                    await (0, node_test_1.it)("XRAY_TEST_ENVIRONMENTS", () => {
                        const env = {
                            ["XRAY_TEST_ENVIRONMENTS"]: [false, "bonjour", 5],
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            testEnvironments: ["A", "B", "C"],
                        });
                        node_assert_1.default.deepStrictEqual(xrayOptions.testEnvironments, [
                            "false",
                            "bonjour",
                            "5",
                        ]);
                    });
                    await (0, node_test_1.it)("XRAY_UPLOAD_RESULTS", () => {
                        const env = {
                            ["XRAY_UPLOAD_RESULTS"]: "false",
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            uploadResults: true,
                        });
                        node_assert_1.default.strictEqual(xrayOptions.uploadResults, false);
                    });
                    await (0, node_test_1.it)("XRAY_UPLOAD_SCREENSHOTS", () => {
                        const env = {
                            ["XRAY_UPLOAD_SCREENSHOTS"]: "false",
                        };
                        const xrayOptions = context_1.default.initXrayOptions(env, {
                            uploadScreenshots: true,
                        });
                        node_assert_1.default.strictEqual(xrayOptions.uploadScreenshots, false);
                    });
                });
                await (0, node_test_1.describe)("cucumber", async () => {
                    await (0, node_test_1.it)("CUCUMBER_FEATURE_FILE_EXTENSION", async () => {
                        const cucumberOptions = await context_1.default.initCucumberOptions({
                            env: {
                                ["CUCUMBER_FEATURE_FILE_EXTENSION"]: ".feature.file",
                                jsonEnabled: true,
                            },
                            excludeSpecPattern: "",
                            projectRoot: "",
                            reporter: "",
                            specPattern: "",
                            testingType: "e2e",
                        }, {
                            featureFileExtension: ".feature",
                        });
                        node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.featureFileExtension, ".feature.file");
                    });
                    await (0, node_test_1.it)("CUCUMBER_DOWNLOAD_FEATURES", async () => {
                        const cucumberOptions = await context_1.default.initCucumberOptions({
                            env: {
                                ["CUCUMBER_DOWNLOAD_FEATURES"]: "true",
                                jsonEnabled: true,
                            },
                            excludeSpecPattern: "",
                            projectRoot: "",
                            reporter: "",
                            specPattern: "",
                            testingType: "e2e",
                        }, {
                            downloadFeatures: false,
                            featureFileExtension: ".feature",
                        });
                        node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.downloadFeatures, true);
                    });
                    await (0, node_test_1.it)("CUCUMBER_PREFIXES_PRECONDITION", async () => {
                        const cucumberOptions = await context_1.default.initCucumberOptions({
                            env: {
                                ["CUCUMBER_PREFIXES_PRECONDITION"]: "BigPrecondition:",
                                jsonEnabled: true,
                            },
                            excludeSpecPattern: "",
                            projectRoot: "",
                            reporter: "",
                            specPattern: "",
                            testingType: "e2e",
                        }, {
                            featureFileExtension: ".feature",
                            prefixes: { precondition: "SmallPrecondition:" },
                        });
                        node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.prefixes.precondition, "BigPrecondition:");
                    });
                    await (0, node_test_1.it)("CUCUMBER_PREFIXES_TEST", async () => {
                        const cucumberOptions = await context_1.default.initCucumberOptions({
                            env: {
                                ["CUCUMBER_PREFIXES_TEST"]: "BigTest:",
                                jsonEnabled: true,
                            },
                            excludeSpecPattern: "",
                            projectRoot: "",
                            reporter: "",
                            specPattern: "",
                            testingType: "e2e",
                        }, {
                            featureFileExtension: ".feature",
                            prefixes: { test: "SmallTest:" },
                        });
                        node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.prefixes.test, "BigTest:");
                    });
                    await (0, node_test_1.it)("CUCUMBER_UPLOAD_FEATURES", async () => {
                        const cucumberOptions = await context_1.default.initCucumberOptions({
                            env: {
                                ["CUCUMBER_UPLOAD_FEATURES"]: "true",
                                jsonEnabled: true,
                            },
                            excludeSpecPattern: "",
                            projectRoot: "",
                            reporter: "",
                            specPattern: "",
                            testingType: "e2e",
                        }, {
                            featureFileExtension: ".feature",
                            uploadFeatures: false,
                        });
                        node_assert_1.default.strictEqual(cucumberOptions === null || cucumberOptions === void 0 ? void 0 : cucumberOptions.uploadFeatures, true);
                    });
                });
                await (0, node_test_1.describe)("plugin", async () => {
                    await (0, node_test_1.it)("PLUGIN_DEBUG", () => {
                        const env = {
                            ["PLUGIN_DEBUG"]: "true",
                        };
                        const pluginOptions = context_1.default.initPluginOptions(env, {
                            debug: false,
                        });
                        node_assert_1.default.strictEqual(pluginOptions.debug, true);
                    });
                    await (0, node_test_1.it)("PLUGIN_ENABLED", () => {
                        const env = {
                            ["PLUGIN_ENABLED"]: "false",
                        };
                        const pluginOptions = context_1.default.initPluginOptions(env, {
                            enabled: true,
                        });
                        node_assert_1.default.strictEqual(pluginOptions.enabled, false);
                    });
                    await (0, node_test_1.it)("PLUGIN_LOG_DIRECTORY", () => {
                        const env = {
                            ["PLUGIN_LOG_DIRECTORY"]: "/home/logs/cypress-xray-plugin",
                        };
                        const pluginOptions = context_1.default.initPluginOptions(env, {
                            logDirectory: "./logging/subdirectory",
                        });
                        node_assert_1.default.strictEqual(pluginOptions.logDirectory, "/home/logs/cypress-xray-plugin");
                    });
                    await (0, node_test_1.it)("PLUGIN_NORMALIZE_SCREENSHOT_NAMES", () => {
                        const env = {
                            ["PLUGIN_NORMALIZE_SCREENSHOT_NAMES"]: "true",
                        };
                        const pluginOptions = context_1.default.initPluginOptions(env, {
                            normalizeScreenshotNames: false,
                        });
                        node_assert_1.default.strictEqual(pluginOptions.normalizeScreenshotNames, true);
                    });
                });
            });
            await (0, node_test_1.describe)("detects invalid configurations", async () => {
                await (0, node_test_1.it)("detects unset project keys", () => {
                    node_assert_1.default.throws(() => context_1.default.initJiraOptions({}, {
                        projectKey: undefined,
                        url: "http://localhost:1234",
                    }), { message: "Plugin misconfiguration: Jira project key was not set" });
                });
                await (0, node_test_1.it)("throws if the cucumber preprocessor is not installed", async (context) => {
                    context.mock.method(dependencies_1.default, "_import", () => {
                        throw new Error("Failed to import package");
                    });
                    await node_assert_1.default.rejects(context_1.default.initCucumberOptions({
                        env: {},
                        excludeSpecPattern: "",
                        projectRoot: "",
                        reporter: "",
                        specPattern: "",
                        testingType: "e2e",
                    }, {
                        featureFileExtension: ".feature",
                    }), {
                        message: (0, dedent_1.dedent)(`
                                Plugin dependency misconfigured: @badeball/cypress-cucumber-preprocessor

                                Failed to import package

                                The plugin depends on the package and should automatically download it during installation, but might have failed to do so because of conflicting Node versions

                                Make sure to install the package manually using: npm install @badeball/cypress-cucumber-preprocessor --save-dev
                            `),
                    });
                });
                await (0, node_test_1.it)("detects if the cucumber preprocessor json report is not enabled", async () => {
                    await node_assert_1.default.rejects(context_1.default.initCucumberOptions({
                        env: { jsonEnabled: false },
                        excludeSpecPattern: "",
                        projectRoot: "",
                        reporter: "",
                        specPattern: "",
                        testingType: "e2e",
                    }, {
                        featureFileExtension: ".feature",
                    }), {
                        message: (0, dedent_1.dedent)(`
                                Plugin misconfiguration: Cucumber preprocessor JSON report disabled

                                Make sure to enable the JSON report as described in https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/json-report.md
                            `),
                    });
                });
                await (0, node_test_1.it)("detects if the cucumber preprocessor json report path was not set", async () => {
                    await node_assert_1.default.rejects(context_1.default.initCucumberOptions({
                        env: { jsonEnabled: true, jsonOutput: "" },
                        excludeSpecPattern: "",
                        projectRoot: "",
                        reporter: "",
                        specPattern: "",
                        testingType: "e2e",
                    }, {
                        featureFileExtension: ".feature",
                    }), {
                        message: (0, dedent_1.dedent)(`
                                Plugin misconfiguration: Cucumber preprocessor JSON report path was not set

                                Make sure to configure the JSON report path as described in https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/json-report.md
                            `),
                    });
                });
            });
        });
        await (0, node_test_1.describe)("the http clients instantiation", async () => {
            await (0, node_test_1.it)("creates a single client by default", (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = context_1.default.initHttpClients(undefined, undefined);
                node_assert_1.default.strictEqual(httpClients.jira, httpClients.xray);
                node_assert_1.default.deepStrictEqual(httpClients.jira, new requests_1.AxiosRestClient(axios_1.default, { debug: undefined }));
            });
            await (0, node_test_1.it)("sets debugging to true if enabled", (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = context_1.default.initHttpClients({ debug: true }, undefined);
                node_assert_1.default.strictEqual(httpClients.jira, httpClients.xray);
                node_assert_1.default.deepStrictEqual(httpClients.jira, new requests_1.AxiosRestClient(axios_1.default, { debug: true }));
            });
            await (0, node_test_1.it)("sets debugging to false if disabled", (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = context_1.default.initHttpClients({ debug: false }, undefined);
                node_assert_1.default.strictEqual(httpClients.jira, httpClients.xray);
                node_assert_1.default.deepStrictEqual(httpClients.jira, new requests_1.AxiosRestClient(axios_1.default, { debug: false }));
            });
            await (0, node_test_1.it)("creates a single client if empty options are passed", (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = context_1.default.initHttpClients(undefined, {});
                node_assert_1.default.strictEqual(httpClients.jira, httpClients.xray);
                node_assert_1.default.deepStrictEqual(httpClients.jira, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {},
                    rateLimiting: undefined,
                }));
            });
            await (0, node_test_1.it)("creates a single client using a single config", (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpOptions = {
                    proxy: {
                        host: "http://localhost:1234",
                        port: 12345,
                    },
                };
                const httpClients = context_1.default.initHttpClients(undefined, httpOptions);
                node_assert_1.default.strictEqual(httpClients.jira, httpClients.xray);
                node_assert_1.default.deepStrictEqual(httpClients.jira, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 12345,
                        },
                    },
                    rateLimiting: undefined,
                }));
            });
            await (0, node_test_1.it)("creates a different jira client if a jira config is passed", (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpOptions = {
                    jira: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 12345,
                        },
                    },
                };
                const httpClients = context_1.default.initHttpClients(undefined, httpOptions);
                node_assert_1.default.notStrictEqual(httpClients.jira, httpClients.xray);
                node_assert_1.default.deepStrictEqual(httpClients.jira, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 12345,
                        },
                    },
                    rateLimiting: undefined,
                }));
                node_assert_1.default.deepStrictEqual(httpClients.xray, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {},
                    rateLimiting: undefined,
                }));
            });
            await (0, node_test_1.it)("creates a different xray client if an xray config is passed", (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpOptions = {
                    xray: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 12345,
                        },
                    },
                };
                const httpClients = context_1.default.initHttpClients(undefined, httpOptions);
                node_assert_1.default.notStrictEqual(httpClients.jira, httpClients.xray);
                node_assert_1.default.deepStrictEqual(httpClients.jira, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {},
                    rateLimiting: undefined,
                }));
                node_assert_1.default.deepStrictEqual(httpClients.xray, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 12345,
                        },
                    },
                    rateLimiting: undefined,
                }));
            });
            await (0, node_test_1.it)("creates different clients if individual configs are passed", (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpOptions = {
                    jira: {
                        proxy: {
                            host: "http://localhost",
                            port: 98765,
                        },
                    },
                    xray: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 12345,
                        },
                    },
                };
                const httpClients = context_1.default.initHttpClients(undefined, httpOptions);
                node_assert_1.default.notStrictEqual(httpClients.jira, httpClients.xray);
                node_assert_1.default.deepStrictEqual(httpClients.jira, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {
                        proxy: {
                            host: "http://localhost",
                            port: 98765,
                        },
                    },
                    rateLimiting: undefined,
                }));
                node_assert_1.default.deepStrictEqual(httpClients.xray, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 12345,
                        },
                    },
                    rateLimiting: undefined,
                }));
            });
            await (0, node_test_1.it)("passes common http options to both clients", (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpOptions = {
                    jira: {
                        proxy: {
                            host: "http://localhost",
                            port: 98765,
                        },
                    },
                    rateLimiting: { requestsPerSecond: 5 },
                    timeout: 42,
                    xray: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 12345,
                        },
                    },
                };
                const httpClients = context_1.default.initHttpClients(undefined, httpOptions);
                node_assert_1.default.notStrictEqual(httpClients.jira, httpClients.xray);
                node_assert_1.default.deepStrictEqual(httpClients.jira, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {
                        proxy: {
                            host: "http://localhost",
                            port: 98765,
                        },
                        timeout: 42,
                    },
                    rateLimiting: { requestsPerSecond: 5 },
                }));
                node_assert_1.default.deepStrictEqual(httpClients.xray, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 12345,
                        },
                        timeout: 42,
                    },
                    rateLimiting: { requestsPerSecond: 5 },
                }));
            });
            await (0, node_test_1.it)("prefers individual http options to common ones", (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpOptions = {
                    jira: {
                        proxy: {
                            host: "http://localhost1",
                            port: 9999,
                        },
                        rateLimiting: { requestsPerSecond: 20 },
                        timeout: 500,
                    },
                    proxy: {
                        host: "http://localhost2",
                        port: 5555,
                    },
                    rateLimiting: { requestsPerSecond: 10 },
                    timeout: 42,
                    xray: {
                        proxy: {
                            host: "http://localhost3",
                            port: 1111,
                        },
                        rateLimiting: { requestsPerSecond: 1 },
                        timeout: 10000,
                    },
                };
                const httpClients = context_1.default.initHttpClients(undefined, httpOptions);
                node_assert_1.default.deepStrictEqual(httpClients.jira, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {
                        proxy: {
                            host: "http://localhost1",
                            port: 9999,
                        },
                        timeout: 500,
                    },
                    rateLimiting: { requestsPerSecond: 20 },
                }));
                node_assert_1.default.deepStrictEqual(httpClients.xray, new requests_1.AxiosRestClient(axios_1.default, {
                    debug: undefined,
                    http: {
                        proxy: {
                            host: "http://localhost3",
                            port: 1111,
                        },
                        timeout: 10000,
                    },
                    rateLimiting: { requestsPerSecond: 1 },
                }));
            });
        });
        await (0, node_test_1.describe)("the clients instantiation", async () => {
            let jiraOptions;
            (0, node_test_1.beforeEach)(() => {
                jiraOptions = context_1.default.initJiraOptions({}, {
                    projectKey: "CYP",
                    url: "http://localhost:1234",
                });
            });
            await (0, node_test_1.it)("detects cloud credentials", async (context) => {
                const env = {
                    ["JIRA_API_TOKEN"]: "1337",
                    ["JIRA_USERNAME"]: "user@somewhere.xyz",
                    ["XRAY_CLIENT_ID"]: "abc",
                    ["XRAY_CLIENT_SECRET"]: "xyz",
                };
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                const get = context.mock.method(httpClients.jira, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: { active: true, displayName: "Jeff" },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const post = context.mock.method(httpClients.xray, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const { jiraClient, xrayClient } = await context_1.default.initClients(jiraOptions, env, httpClients);
                node_assert_1.default.strictEqual(jiraClient instanceof jira_client_1.BaseJiraClient, true);
                node_assert_1.default.strictEqual(xrayClient instanceof xray_client_cloud_1.XrayClientCloud, true);
                node_assert_1.default.strictEqual(jiraClient.getCredentials() instanceof credentials_1.BasicAuthCredentials, true);
                node_assert_1.default.strictEqual(xrayClient.getCredentials() instanceof credentials_1.JwtCredentials, true);
                node_assert_1.default.strictEqual(get.mock.callCount(), 1);
                node_assert_1.default.strictEqual(post.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                    logging_1.Level.INFO,
                    "Jira username and API token found. Setting up Jira cloud basic auth credentials.",
                ]);
                node_assert_1.default.deepStrictEqual(message.mock.calls[4].arguments, [
                    logging_1.Level.INFO,
                    "Xray client ID and client secret found. Setting up Xray cloud JWT credentials.",
                ]);
            });
            await (0, node_test_1.it)("should throw for missing xray cloud credentials", async (context) => {
                const env = {
                    ["JIRA_API_TOKEN"]: "1337",
                    ["JIRA_USERNAME"]: "user@somewhere.xyz",
                };
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                context.mock.method(httpClients.jira, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: { active: true, displayName: "Jeff" },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await node_assert_1.default.rejects(context_1.default.initClients(jiraOptions, env, httpClients), {
                    message: (0, dedent_1.dedent)(`
                        Failed to configure Xray client: Jira cloud credentials detected, but the provided Xray credentials are not Xray cloud credentials.

                          You can find all configurations currently supported at: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/authentication/
                    `),
                });
                node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                    logging_1.Level.INFO,
                    "Jira username and API token found. Setting up Jira cloud basic auth credentials.",
                ]);
            });
            await (0, node_test_1.it)("detects PAT credentials", async (context) => {
                const env = {
                    ["JIRA_API_TOKEN"]: "1337",
                };
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                const getJira = context.mock.method(httpClients.jira, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: { active: true, displayName: "Jeff" },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const getXray = context.mock.method(httpClients.xray, "get", () => {
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
                const { jiraClient, xrayClient } = await context_1.default.initClients(jiraOptions, env, httpClients);
                node_assert_1.default.strictEqual(jiraClient instanceof jira_client_1.BaseJiraClient, true);
                node_assert_1.default.strictEqual(xrayClient instanceof xray_client_server_1.ServerClient, true);
                node_assert_1.default.strictEqual(jiraClient.getCredentials() instanceof credentials_1.PatCredentials, true);
                node_assert_1.default.strictEqual(xrayClient.getCredentials() instanceof credentials_1.PatCredentials, true);
                node_assert_1.default.strictEqual(getJira.mock.callCount(), 1);
                node_assert_1.default.strictEqual(getXray.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                    logging_1.Level.INFO,
                    "Jira PAT found. Setting up Jira server PAT credentials.",
                ]);
                node_assert_1.default.deepStrictEqual(message.mock.calls[4].arguments, [
                    logging_1.Level.INFO,
                    "Jira PAT found. Setting up Xray server PAT credentials.",
                ]);
            });
            await (0, node_test_1.it)("detects basic auth credentials", async (context) => {
                const env = {
                    ["JIRA_PASSWORD"]: "1337",
                    ["JIRA_USERNAME"]: "user",
                };
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                const getJira = context.mock.method(httpClients.jira, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: { active: true, displayName: "Jeff" },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const getXray = context.mock.method(httpClients.xray, "get", () => {
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
                const { jiraClient, xrayClient } = await context_1.default.initClients(jiraOptions, env, httpClients);
                node_assert_1.default.strictEqual(jiraClient instanceof jira_client_1.BaseJiraClient, true);
                node_assert_1.default.strictEqual(xrayClient instanceof xray_client_server_1.ServerClient, true);
                node_assert_1.default.strictEqual(jiraClient.getCredentials() instanceof credentials_1.BasicAuthCredentials, true);
                node_assert_1.default.strictEqual(xrayClient.getCredentials() instanceof credentials_1.BasicAuthCredentials, true);
                node_assert_1.default.strictEqual(getJira.mock.callCount(), 1);
                node_assert_1.default.strictEqual(getXray.mock.callCount(), 1);
                node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                    logging_1.Level.INFO,
                    "Jira username and password found. Setting up Jira server basic auth credentials.",
                ]);
                node_assert_1.default.deepStrictEqual(message.mock.calls[4].arguments, [
                    logging_1.Level.INFO,
                    "Jira username and password found. Setting up Xray server basic auth credentials.",
                ]);
            });
            await (0, node_test_1.it)("should choose cloud credentials over server credentials", async (context) => {
                const env = {
                    ["JIRA_API_TOKEN"]: "1337",
                    ["JIRA_PASSWORD"]: "xyz",
                    ["JIRA_USERNAME"]: "user",
                    ["XRAY_CLIENT_ID"]: "abc",
                    ["XRAY_CLIENT_SECRET"]: "xyz",
                };
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                context.mock.method(httpClients.jira, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: { active: true, displayName: "Jeff" },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                context.mock.method(httpClients.xray, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                const { jiraClient, xrayClient } = await context_1.default.initClients(jiraOptions, env, httpClients);
                node_assert_1.default.strictEqual(jiraClient instanceof jira_client_1.BaseJiraClient, true);
                node_assert_1.default.strictEqual(xrayClient instanceof xray_client_cloud_1.XrayClientCloud, true);
                node_assert_1.default.strictEqual(jiraClient.getCredentials() instanceof credentials_1.BasicAuthCredentials, true);
                node_assert_1.default.strictEqual(xrayClient.getCredentials() instanceof credentials_1.JwtCredentials, true);
            });
            await (0, node_test_1.it)("should throw an error for missing credentials", async () => {
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                await node_assert_1.default.rejects(context_1.default.initClients(jiraOptions, {}, httpClients), {
                    message: (0, dedent_1.dedent)(`
                        Failed to configure Jira client: No viable authentication method was configured.

                          You can find all configurations currently supported at: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/authentication/
                    `),
                });
            });
            await (0, node_test_1.it)("throws if no user details are returned from jira", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                context.mock.method(httpClients.jira, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: "<div>Welcome</div>",
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await node_assert_1.default.rejects(context_1.default.initClients(jiraOptions, {
                    ["JIRA_API_TOKEN"]: "1337",
                }, httpClients), {
                    message: (0, dedent_1.dedent)(`
                        Failed to establish communication with Jira: http://localhost:1234

                          Jira did not return a valid response: JSON containing a username was expected, but not received.

                        Make sure you have correctly set up:
                        - Jira base URL: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/jira/#url
                        - Jira authentication: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/authentication/#jira

                        For more information, set the plugin to debug mode: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/plugin/#debug
                    `),
                });
            });
            await (0, node_test_1.it)("throws if no usernames are returned from jira", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                context.mock.method(httpClients.jira, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            active: true,
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await node_assert_1.default.rejects(context_1.default.initClients(jiraOptions, {
                    ["JIRA_API_TOKEN"]: "1337",
                }, httpClients), {
                    message: (0, dedent_1.dedent)(`
                        Failed to establish communication with Jira: http://localhost:1234

                          Jira did not return a valid response: JSON containing a username was expected, but not received.

                        Make sure you have correctly set up:
                        - Jira base URL: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/jira/#url
                        - Jira authentication: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/authentication/#jira

                        For more information, set the plugin to debug mode: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/plugin/#debug
                    `),
                });
            });
            await (0, node_test_1.it)("throws if no license data is returned from xray server", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                context.mock.method(httpClients.jira, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            active: true,
                            displayName: "Demo User",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                context.mock.method(httpClients.xray, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: "<div>Welcome</div>",
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await node_assert_1.default.rejects(context_1.default.initClients(jiraOptions, {
                    ["JIRA_API_TOKEN"]: "1337",
                }, httpClients), {
                    message: (0, dedent_1.dedent)(`
                        Failed to establish communication with Xray: http://localhost:1234

                          Xray did not return a valid response: JSON containing basic Xray license information was expected, but not received.

                        Make sure you have correctly set up:
                        - Jira base URL: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/jira/#url
                        - Xray server authentication: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/authentication/#xray-server
                        - Xray itself: https://docs.getxray.app/display/XRAY/Installation

                        For more information, set the plugin to debug mode: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/plugin/#debug
                    `),
                });
            });
            await (0, node_test_1.it)("throws if an inactive license is returned from xray server", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                context.mock.method(httpClients.jira, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            active: true,
                            displayName: "Demo User",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                context.mock.method(httpClients.xray, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            active: false,
                            licenseType: "Basic",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                await node_assert_1.default.rejects(context_1.default.initClients(jiraOptions, {
                    ["JIRA_API_TOKEN"]: "1337",
                }, httpClients), {
                    message: (0, dedent_1.dedent)(`
                        Failed to establish communication with Xray: http://localhost:1234

                          The Xray license is not active

                        Make sure you have correctly set up:
                        - Jira base URL: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/jira/#url
                        - Xray server authentication: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/authentication/#xray-server
                        - Xray itself: https://docs.getxray.app/display/XRAY/Installation

                        For more information, set the plugin to debug mode: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/plugin/#debug
                    `),
                });
            });
            await (0, node_test_1.it)("throws if the xray credentials are invalid", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                const httpClients = {
                    jira: new requests_1.AxiosRestClient(axios_1.default),
                    xray: new requests_1.AxiosRestClient(axios_1.default),
                };
                context.mock.method(httpClients.jira, "get", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            active: true,
                            displayName: "Demo User",
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
                    };
                });
                context.mock.method(httpClients.xray, "post", () => {
                    throw new axios_1.AxiosError("Request failed with status code 404", axios_1.HttpStatusCode.BadRequest.toString(), undefined, null, {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            errorMessages: ["not found"],
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.NotFound,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.NotFound],
                    });
                });
                await node_assert_1.default.rejects(context_1.default.initClients(jiraOptions, {
                    ["JIRA_API_TOKEN"]: "1337",
                    ["JIRA_USERNAME"]: "user",
                    ["XRAY_CLIENT_ID"]: "abc",
                    ["XRAY_CLIENT_SECRET"]: "xyz",
                }, httpClients), {
                    message: (0, dedent_1.dedent)(`
                        Failed to establish communication with Xray: https://xray.cloud.getxray.app/api/v2/authenticate

                          Failed to authenticate

                        Make sure you have correctly set up:
                        - Xray cloud authentication: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/authentication/#xray-cloud
                        - Xray itself: https://docs.getxray.app/display/XRAYCLOUD/Installation

                        For more information, set the plugin to debug mode: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/plugin/#debug
                    `),
                });
            });
        });
    });
    await (0, node_test_1.describe)(context_1.SimpleEvidenceCollection.name, async () => {
        await (0, node_test_1.it)("collects evidence for single tests", () => {
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            evidenceCollection.addEvidence("CYP-123", {
                contentType: "application/json",
                data: "WyJoZWxsbyJd",
                filename: "hello.json",
            });
            evidenceCollection.addEvidence("CYP-123", {
                contentType: "application/json",
                data: "WyJnb29kYnllIl0=",
                filename: "goodbye.json",
            });
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-123"), [
                {
                    contentType: "application/json",
                    data: "WyJoZWxsbyJd",
                    filename: "hello.json",
                },
                {
                    contentType: "application/json",
                    data: "WyJnb29kYnllIl0=",
                    filename: "goodbye.json",
                },
            ]);
        });
        await (0, node_test_1.it)("collects evidence for multiple tests", () => {
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            evidenceCollection.addEvidence("CYP-123", {
                contentType: "application/json",
                data: "WyJoZWxsbyJd",
                filename: "hello.json",
            });
            evidenceCollection.addEvidence("CYP-456", {
                contentType: "application/json",
                data: "WyJnb29kYnllIl0=",
                filename: "goodbye.json",
            });
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-123"), [
                {
                    contentType: "application/json",
                    data: "WyJoZWxsbyJd",
                    filename: "hello.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-456"), [
                {
                    contentType: "application/json",
                    data: "WyJnb29kYnllIl0=",
                    filename: "goodbye.json",
                },
            ]);
        });
        await (0, node_test_1.it)("returns an empty array for unknown tests", () => {
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            evidenceCollection.addEvidence("CYP-123", {
                contentType: "application/json",
                data: "WyJoZWxsbyJd",
                filename: "hello.json",
            });
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-456"), []);
        });
    });
    await (0, node_test_1.describe)(context_1.PluginContext.name, async () => {
        let context;
        (0, node_test_1.beforeEach)(() => {
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            const xrayClient = new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context = new context_1.PluginContext({
                jiraClient: jiraClient,
                kind: "server",
                xrayClient: xrayClient,
            }, {
                http: {},
                jira: {
                    attachVideos: false,
                    fields: {},
                    projectKey: "CYP",
                    testExecutionIssueType: "Text Execution",
                    testPlanIssueType: "Test Plan",
                    url: "http://localhost:1234",
                },
                plugin: {
                    debug: false,
                    enabled: true,
                    logDirectory: "./logs",
                    normalizeScreenshotNames: false,
                },
                xray: {
                    status: {},
                    uploadRequests: false,
                    uploadResults: false,
                    uploadScreenshots: false,
                },
            }, {}, new context_1.SimpleEvidenceCollection(), new executable_graph_1.ExecutableGraph(), new logging_1.CapturingLogger());
        });
        await (0, node_test_1.it)("collects evidence for single tests", () => {
            context.addEvidence("CYP-123", {
                contentType: "application/json",
                data: "WyJoZWxsbyJd",
                filename: "hello.json",
            });
            context.addEvidence("CYP-123", {
                contentType: "application/json",
                data: "WyJnb29kYnllIl0=",
                filename: "goodbye.json",
            });
            node_assert_1.default.deepStrictEqual(context.getEvidence("CYP-123"), [
                {
                    contentType: "application/json",
                    data: "WyJoZWxsbyJd",
                    filename: "hello.json",
                },
                {
                    contentType: "application/json",
                    data: "WyJnb29kYnllIl0=",
                    filename: "goodbye.json",
                },
            ]);
        });
        await (0, node_test_1.it)("collects evidence for multiple tests", () => {
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            evidenceCollection.addEvidence("CYP-123", {
                contentType: "application/json",
                data: "WyJoZWxsbyJd",
                filename: "hello.json",
            });
            evidenceCollection.addEvidence("CYP-456", {
                contentType: "application/json",
                data: "WyJnb29kYnllIl0=",
                filename: "goodbye.json",
            });
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-123"), [
                {
                    contentType: "application/json",
                    data: "WyJoZWxsbyJd",
                    filename: "hello.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-456"), [
                {
                    contentType: "application/json",
                    data: "WyJnb29kYnllIl0=",
                    filename: "goodbye.json",
                },
            ]);
        });
        await (0, node_test_1.it)("returns an empty array for unknown tests", () => {
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            evidenceCollection.addEvidence("CYP-123", {
                contentType: "application/json",
                data: "WyJoZWxsbyJd",
                filename: "hello.json",
            });
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-456"), []);
        });
    });
});
