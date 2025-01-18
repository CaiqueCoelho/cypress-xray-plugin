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
const axios_1 = __importDefault(require("axios"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const util_1 = require("../test/util");
const credentials_1 = require("./client/authentication/credentials");
const requests_1 = require("./client/https/requests");
const jira_client_1 = require("./client/jira/jira-client");
const xray_client_server_1 = require("./client/xray/xray-client-server");
const context_1 = __importStar(require("./context"));
const after_run_1 = __importDefault(require("./hooks/after/after-run"));
const file_preprocessor_1 = __importDefault(require("./hooks/preprocessor/file-preprocessor"));
const plugin_1 = require("./plugin");
const dedent_1 = require("./util/dedent");
const executable_graph_1 = require("./util/graph/executable-graph");
const logging_1 = require("./util/logging");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    let jiraClient;
    let config;
    let pluginContext;
    (0, node_test_1.beforeEach)(() => {
        config = JSON.parse(node_fs_1.default.readFileSync("./test/resources/cypress.config.json", "utf-8"));
        jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
        const xrayClient = new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
        const jiraOptions = context_1.default.initJiraOptions({}, {
            projectKey: "CYP",
            url: "http://localhost:1234",
        });
        pluginContext = new context_1.PluginContext({
            jiraClient: jiraClient,
            kind: "server",
            xrayClient: xrayClient,
        }, {
            cucumber: undefined,
            http: {},
            jira: jiraOptions,
            plugin: context_1.default.initPluginOptions({}, {}),
            xray: context_1.default.initXrayOptions({}, {}),
        }, config, new context_1.SimpleEvidenceCollection(), new executable_graph_1.ExecutableGraph(), new logging_1.CapturingLogger());
        (0, plugin_1.resetPlugin)();
    });
    await (0, node_test_1.describe)(plugin_1.configureXrayPlugin.name, async () => {
        await (0, node_test_1.it)("registers tasks only if disabled", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const mockedOn = context.mock.fn();
            await (0, plugin_1.configureXrayPlugin)(mockedOn, config, {
                jira: {
                    projectKey: "ABC",
                    url: "http://localhost:1234",
                },
                plugin: {
                    enabled: false,
                },
            });
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Plugin disabled. Skipping further configuration.",
            ]);
            node_assert_1.default.strictEqual(mockedOn.mock.callCount(), 1);
            node_assert_1.default.strictEqual(mockedOn.mock.calls[0].arguments[0], "task");
        });
        await (0, node_test_1.it)("registers tasks only if run in interactive mode", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const mockedOn = context.mock.fn();
            config.isTextTerminal = false;
            await (0, plugin_1.configureXrayPlugin)(mockedOn, config, {
                jira: {
                    projectKey: "ABC",
                    url: "http://localhost:1234",
                },
            });
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Interactive mode detected, disabling plugin.",
            ]);
            node_assert_1.default.strictEqual(mockedOn.mock.callCount(), 1);
            node_assert_1.default.strictEqual(mockedOn.mock.calls[0].arguments[0], "task");
        });
        await (0, node_test_1.it)("initializes the plugin context with the provided options", async (context) => {
            var _a, _b, _c, _d, _e, _f;
            config.env = {
                ["JIRA_API_TOKEN"]: "token",
                jsonEnabled: true,
                jsonOutput: "somewhere",
            };
            const setGlobalContext = context.mock.method(context_1.default, "setGlobalContext");
            context.mock.method(context_1.default, "initClients", () => pluginContext.getClients());
            const options = {
                cucumber: {
                    downloadFeatures: false,
                    featureFileExtension: ".cucumber",
                    uploadFeatures: false,
                },
                http: {},
                jira: {
                    attachVideos: true,
                    fields: {
                        testEnvironments: "field_123",
                        testPlan: "there",
                    },
                    projectKey: "ABC",
                    testExecutionIssue: {
                        fields: {
                            description: "somewhere",
                            issuetype: { name: "QA-1" },
                            labels: "out",
                            summary: "my summary",
                        },
                        key: "ABC-2",
                    },
                    testPlanIssueKey: "ABC-3",
                    url: "http://localhost:1234",
                },
                plugin: {
                    debug: false,
                    enabled: true,
                    logDirectory: "xyz",
                    normalizeScreenshotNames: true,
                },
                xray: {
                    status: {
                        failed: "FAILURE",
                        passed: "OK",
                        pending: "WAITING",
                        skipped: "OMITTED",
                    },
                    testEnvironments: ["A", "B"],
                    uploadResults: false,
                    uploadScreenshots: false,
                },
            };
            await (0, plugin_1.configureXrayPlugin)(util_1.mockedCypressEventEmitter, config, options);
            node_assert_1.default.strictEqual((_a = setGlobalContext.mock.calls[0].arguments[0]) === null || _a === void 0 ? void 0 : _a.getCypressOptions(), config);
            node_assert_1.default.deepStrictEqual(setGlobalContext.mock.calls[0].arguments[0].getOptions().jira, {
                attachVideos: true,
                fields: {
                    description: undefined,
                    labels: undefined,
                    summary: undefined,
                    testEnvironments: "field_123",
                    testPlan: "there",
                },
                projectKey: "ABC",
                testExecutionIssue: {
                    fields: {
                        description: "somewhere",
                        issuetype: { name: "QA-1" },
                        labels: "out",
                        summary: "my summary",
                    },
                    key: "ABC-2",
                },
                testExecutionIssueDescription: undefined,
                testExecutionIssueKey: undefined,
                testExecutionIssueSummary: undefined,
                testExecutionIssueType: "Test Execution",
                testPlanIssueKey: "ABC-3",
                testPlanIssueType: "Test Plan",
                url: "http://localhost:1234",
            });
            node_assert_1.default.deepStrictEqual(setGlobalContext.mock.calls[0].arguments[0].getOptions().plugin, {
                ...options.plugin,
                logDirectory: (0, node_path_1.resolve)(config.projectRoot, "xyz"),
            });
            node_assert_1.default.deepStrictEqual(setGlobalContext.mock.calls[0].arguments[0].getOptions().xray, {
                status: {
                    failed: "FAILURE",
                    passed: "OK",
                    pending: "WAITING",
                    skipped: "OMITTED",
                    step: {
                        failed: undefined,
                        passed: undefined,
                        pending: undefined,
                        skipped: undefined,
                    },
                },
                testEnvironments: ["A", "B"],
                uploadRequests: false,
                uploadResults: false,
                uploadScreenshots: false,
            });
            node_assert_1.default.strictEqual((_b = setGlobalContext.mock.calls[0].arguments[0].getOptions().cucumber) === null || _b === void 0 ? void 0 : _b.featureFileExtension, ".cucumber");
            node_assert_1.default.strictEqual((_c = setGlobalContext.mock.calls[0].arguments[0].getOptions().cucumber) === null || _c === void 0 ? void 0 : _c.downloadFeatures, false);
            node_assert_1.default.strictEqual((_d = setGlobalContext.mock.calls[0].arguments[0].getOptions().cucumber) === null || _d === void 0 ? void 0 : _d.uploadFeatures, false);
            node_assert_1.default.deepStrictEqual((_f = (_e = setGlobalContext.mock.calls[0].arguments[0].getOptions().cucumber) === null || _e === void 0 ? void 0 : _e.preprocessor) === null || _f === void 0 ? void 0 : _f.json, {
                enabled: true,
                output: "somewhere",
            });
            node_assert_1.default.deepStrictEqual(setGlobalContext.mock.calls[0].arguments[0].getOptions().http, options.http);
            node_assert_1.default.strictEqual(setGlobalContext.mock.calls[0].arguments[0].getClients(), pluginContext.getClients());
        });
        await (0, node_test_1.it)("initializes the clients with different http configurations", async (context) => {
            const options = {
                http: {
                    jira: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 1234,
                        },
                    },
                    xray: {
                        proxy: {
                            host: "http://localhost",
                            port: 5678,
                        },
                    },
                },
                jira: {
                    projectKey: "ABC",
                    url: "http://localhost:1234",
                },
            };
            const initClients = context.mock.method(context_1.default, "initClients", () => pluginContext.getClients());
            await (0, plugin_1.configureXrayPlugin)(util_1.mockedCypressEventEmitter, config, options);
            node_assert_1.default.strictEqual(initClients.mock.callCount(), 1);
            node_assert_1.default.deepStrictEqual(initClients.mock.calls[0].arguments[2], {
                jira: new requests_1.AxiosRestClient(axios_1.default, {
                    debug: false,
                    http: {
                        proxy: {
                            host: "http://localhost:1234",
                            port: 1234,
                        },
                    },
                    rateLimiting: undefined,
                }),
                xray: new requests_1.AxiosRestClient(axios_1.default, {
                    debug: false,
                    http: {
                        proxy: {
                            host: "http://localhost",
                            port: 5678,
                        },
                    },
                    rateLimiting: undefined,
                }),
            });
        });
        await (0, node_test_1.it)("initializes the logging module", async (context) => {
            const configure = context.mock.method(logging_1.LOG, "configure", context.mock.fn());
            context.mock.method(context_1.default, "initClients", () => pluginContext.getClients());
            const options = {
                jira: {
                    projectKey: "ABC",
                    url: "http://localhost:1234",
                },
            };
            await (0, plugin_1.configureXrayPlugin)(util_1.mockedCypressEventEmitter, config, options);
            node_assert_1.default.deepStrictEqual(configure.mock.calls[0].arguments, [
                {
                    debug: pluginContext.getOptions().plugin.debug,
                    logDirectory: (0, node_path_1.resolve)(config.projectRoot, "logs"),
                },
            ]);
        });
        await (0, node_test_1.it)("initializes the logging module with resolved relative paths", async (context) => {
            const configure = context.mock.method(logging_1.LOG, "configure", context.mock.fn());
            context.mock.method(context_1.default, "initClients", () => pluginContext.getClients());
            const options = {
                jira: {
                    projectKey: "ABC",
                    url: "http://localhost:1234",
                },
                plugin: {
                    logDirectory: "log-directory",
                },
            };
            await (0, plugin_1.configureXrayPlugin)(util_1.mockedCypressEventEmitter, config, options);
            node_assert_1.default.deepStrictEqual(configure.mock.calls[0].arguments, [
                {
                    debug: pluginContext.getOptions().plugin.debug,
                    logDirectory: (0, node_path_1.resolve)(config.projectRoot, "log-directory"),
                },
            ]);
        });
        await (0, node_test_1.it)("initializes the logging module without changing absolute paths", async (context) => {
            const configure = context.mock.method(logging_1.LOG, "configure", context.mock.fn());
            context.mock.method(context_1.default, "initClients", () => pluginContext.getClients());
            const options = {
                jira: {
                    projectKey: "ABC",
                    url: "http://localhost:1234",
                },
                plugin: {
                    logDirectory: (0, node_path_1.resolve)("."),
                },
            };
            await (0, plugin_1.configureXrayPlugin)(util_1.mockedCypressEventEmitter, config, options);
            node_assert_1.default.deepStrictEqual(configure.mock.calls[0].arguments, [
                {
                    debug: pluginContext.getOptions().plugin.debug,
                    logDirectory: (0, node_path_1.resolve)("."),
                },
            ]);
        });
        await (0, node_test_1.it)("adds upload commands", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            context.mock.method(context_1.default, "initClients", () => pluginContext.getClients());
            const addUploadCommands = context.mock.method(after_run_1.default, "addUploadCommands", context.mock.fn());
            const afterRunResult = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResult.json", "utf-8"));
            const mockedOn = context.mock.fn();
            await (0, plugin_1.configureXrayPlugin)(mockedOn, config, pluginContext.getOptions());
            await mockedOn.mock.calls[1].arguments[1](afterRunResult);
            const expectedContext = new context_1.PluginContext(pluginContext.getClients(), {
                ...pluginContext.getOptions(),
                plugin: {
                    ...pluginContext.getOptions().plugin,
                    logDirectory: (0, node_path_1.resolve)(config.projectRoot, "logs"),
                },
            }, pluginContext.getCypressOptions(), new context_1.SimpleEvidenceCollection(), new executable_graph_1.ExecutableGraph(), new logging_1.CapturingLogger());
            node_assert_1.default.deepStrictEqual(addUploadCommands.mock.calls[0].arguments[0], afterRunResult);
            node_assert_1.default.deepStrictEqual(addUploadCommands.mock.calls[0].arguments[1], pluginContext.getCypressOptions().projectRoot);
            node_assert_1.default.deepStrictEqual(addUploadCommands.mock.calls[0].arguments[2], {
                ...pluginContext.getOptions(),
                plugin: {
                    ...pluginContext.getOptions().plugin,
                    logDirectory: (0, node_path_1.resolve)(config.projectRoot, "logs"),
                },
            });
            node_assert_1.default.deepStrictEqual(addUploadCommands.mock.calls[0].arguments[3], pluginContext.getClients());
            node_assert_1.default.deepStrictEqual(addUploadCommands.mock.calls[0].arguments[4], expectedContext);
            node_assert_1.default.deepStrictEqual(addUploadCommands.mock.calls[0].arguments[5], pluginContext.getGraph());
            node_assert_1.default.strictEqual(addUploadCommands.mock.calls[0].arguments[6] instanceof logging_1.CapturingLogger, true);
        });
        await (0, node_test_1.it)("displays an error for failed runs", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            context.mock.method(context_1.default, "initClients", () => pluginContext.getClients());
            context.mock.method(context_1.default, "getGlobalContext", () => pluginContext);
            const failedResults = {
                failures: 47,
                message: "Pretty messed up",
                status: "failed",
            };
            await (0, plugin_1.configureXrayPlugin)((0, util_1.mockedCypressEventEmitter)("after:run", failedResults), config, pluginContext.getOptions());
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.ERROR,
                (0, dedent_1.dedent)(`
                    Skipping results upload: Failed to run 47 tests.

                      Pretty messed up
                `),
            ]);
        });
        await (0, node_test_1.it)("does not display a warning if the plugin was configured but disabled", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            await (0, plugin_1.configureXrayPlugin)(util_1.mockedCypressEventEmitter, config, {
                jira: { projectKey: "CYP", url: "http://localhost:1234" },
                plugin: { enabled: false },
            });
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Plugin disabled. Skipping further configuration.",
            ]);
        });
        await (0, node_test_1.it)("does not display an error for failed runs if disabled", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const failedResults = {
                failures: 47,
                message: "Pretty messed up",
                status: "failed",
            };
            pluginContext.getOptions().plugin.enabled = false;
            await (0, plugin_1.configureXrayPlugin)((0, util_1.mockedCypressEventEmitter)("after:run", failedResults), config, pluginContext.getOptions());
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Plugin disabled. Skipping further configuration.",
            ]);
        });
        await (0, node_test_1.it)("should skip the results upload if disabled", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            context.mock.method(context_1.default, "initClients", () => pluginContext.getClients());
            context.mock.method(context_1.default, "getGlobalContext", () => pluginContext);
            const afterRunResult = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResult.json", "utf-8"));
            pluginContext.getOptions().xray.uploadResults = false;
            context_1.default.setGlobalContext(pluginContext);
            await (0, plugin_1.configureXrayPlugin)((0, util_1.mockedCypressEventEmitter)("after:run", afterRunResult), config, pluginContext.getOptions());
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Skipping results upload: Plugin is configured to not upload test results.",
            ]);
        });
        await (0, node_test_1.it)("displays a warning if there are failed vertices", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            context.mock.method(context_1.default, "initClients", () => pluginContext.getClients());
            context.mock.method(jiraClient, "getIssueTypes", () => [{ name: "Test Execution" }]);
            const afterRunResult = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResult.json", "utf-8"));
            await (0, plugin_1.configureXrayPlugin)((0, util_1.mockedCypressEventEmitter)("after:run", afterRunResult), config, pluginContext.getOptions());
            // Workaround: yields control back to the configuration function so that the finally
            // block may run.
            await new Promise((r) => {
                setTimeout(() => {
                    r("ok");
                }, 10);
            });
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                "Encountered problems during plugin execution!",
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    ~/repositories/xray/cypress/e2e/demo/example.cy.ts

                      Test: xray upload demo should look for paragraph elements

                        Skipping result upload.

                          Caused by: Test: xray upload demo should look for paragraph elements

                            No test issue keys found in title.

                            You can target existing test issues by adding a corresponding issue key:

                              it("CYP-123 xray upload demo should look for paragraph elements", () => {
                                // ...
                              });

                            For more information, visit:
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                `),
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[2].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    ~/repositories/xray/cypress/e2e/demo/example.cy.ts

                      Test: xray upload demo should look for the anchor element

                        Skipping result upload.

                          Caused by: Test: xray upload demo should look for the anchor element

                            No test issue keys found in title.

                            You can target existing test issues by adding a corresponding issue key:

                              it("CYP-123 xray upload demo should look for the anchor element", () => {
                                // ...
                              });

                            For more information, visit:
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                `),
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[3].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    ~/repositories/xray/cypress/e2e/demo/example.cy.ts

                      Test: xray upload demo should fail

                        Skipping result upload.

                          Caused by: Test: xray upload demo should fail

                            No test issue keys found in title.

                            You can target existing test issues by adding a corresponding issue key:

                              it("CYP-123 xray upload demo should fail", () => {
                                // ...
                              });

                            For more information, visit:
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                `),
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[4].arguments, [
                logging_1.Level.WARNING,
                "No test results were uploaded",
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[5].arguments, [
                logging_1.Level.ERROR,
                (0, dedent_1.dedent)(`
                    Failed to upload Cypress execution results.

                      Caused by: Failed to convert Cypress tests into Xray tests: No Cypress tests to upload
                `),
            ]);
        });
    });
    await (0, node_test_1.it)("displays warning and errors after other log messages", async (context) => {
        const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
        const xrayClient = new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
        context.mock.method(context_1.default, "initClients", () => {
            return {
                jiraClient: jiraClient,
                kind: "cloud",
                xrayClient: xrayClient,
            };
        });
        context.mock.method(context_1.default, "initCucumberOptions", () => {
            return {
                downloadFeatures: false,
                featureFileExtension: ".feature",
                prefixes: {
                    precondition: "Precondition:",
                    test: "TestName:",
                },
                preprocessor: {
                    json: {
                        enabled: true,
                        output: (0, node_path_1.resolve)("./test/resources/fixtures/cucumber/empty-report.json"),
                    },
                },
                uploadFeatures: true,
            };
        });
        context.mock.method(jiraClient, "getFields", () => [
            {
                clauseNames: [],
                custom: false,
                id: "12345",
                name: "summary",
                navigable: false,
                orderable: false,
                schema: {},
                searchable: false,
            },
            {
                clauseNames: [],
                custom: false,
                id: "98765",
                name: "labels",
                navigable: false,
                orderable: false,
                schema: {},
                searchable: false,
            },
        ]);
        context.mock.method(jiraClient, "getIssueTypes", () => [{ name: "Test Execution" }]);
        context.mock.method(xrayClient, "importExecutionMultipart", () => "CYP-123");
        context.mock.method(xrayClient, "importExecutionCucumberMultipart", () => "CYP-123");
        context.mock.method(xrayClient, "importFeature", () => {
            return { errors: [], updatedOrCreatedIssues: ["CYP-222", "CYP-333", "CYP-555"] };
        });
        const afterRunResult = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResult_13_0_0_mixed.json", "utf-8"));
        const spy = context.mock.fn();
        await (0, plugin_1.configureXrayPlugin)(spy, config, {
            cucumber: {
                featureFileExtension: ".feature",
                uploadFeatures: true,
            },
            jira: {
                projectKey: "CYP",
                url: "http://localhost:1234",
            },
            plugin: {
                debug: true,
            },
            xray: {
                uploadScreenshots: false,
            },
        });
        (0, plugin_1.syncFeatureFile)({
            filePath: "./test/resources/features/invalid.feature",
        });
        const [eventName, callback] = spy.mock.calls[1].arguments;
        node_assert_1.default.strictEqual(eventName, "after:run");
        await callback(afterRunResult);
        node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
            logging_1.Level.INFO,
            "Parsing feature file: ./test/resources/features/invalid.feature",
        ]);
        node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
            logging_1.Level.SUCCESS,
            "Uploaded Cypress test results to issue: CYP-123 (http://localhost:1234/browse/CYP-123)",
        ]);
        node_assert_1.default.deepStrictEqual(message.mock.calls[2].arguments, [
            logging_1.Level.WARNING,
            "Encountered problems during plugin execution!",
        ]);
        node_assert_1.default.deepStrictEqual(message.mock.calls[3].arguments, [
            logging_1.Level.ERROR,
            (0, dedent_1.dedent)(`
                Failed to upload Cucumber execution results.

                  Caused by: Skipping Cucumber results upload: No Cucumber tests were executed
            `),
        ]);
        node_assert_1.default.deepStrictEqual(message.mock.calls[4].arguments, [
            logging_1.Level.ERROR,
            (0, dedent_1.dedent)(`
                ./test/resources/features/invalid.feature

                  Failed to import feature file.

                  Caused by: ./test/resources/features/invalid.feature

                    Failed to parse feature file.

                      Parser errors:
                      (9:3): expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ScenarioLine, #RuleLine, #Comment, #Empty, got 'Invalid: Element'
            `),
        ]);
    });
    await (0, node_test_1.describe)(plugin_1.syncFeatureFile.name, async () => {
        let file;
        (0, node_test_1.beforeEach)(() => {
            file = {
                ...{},
                filePath: "./test/resources/features/taggedCloud.feature",
                outputPath: "",
                shouldWatch: false,
            };
        });
        await (0, node_test_1.it)("displays warnings if the plugin was not configured", (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            (0, plugin_1.syncFeatureFile)(file);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    ./test/resources/features/taggedCloud.feature

                      Skipping file:preprocessor hook: Plugin misconfigured: configureXrayPlugin() was not called.

                      Make sure your project is set up correctly: https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/introduction/
                `),
            ]);
        });
        await (0, node_test_1.it)("does not display a warning if the plugin was configured but disabled", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            await (0, plugin_1.configureXrayPlugin)(util_1.mockedCypressEventEmitter, config, {
                jira: { projectKey: "CYP", url: "http://localhost:1234" },
                plugin: { enabled: false },
            });
            (0, plugin_1.syncFeatureFile)(file);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Plugin disabled. Skipping further configuration.",
            ]);
        });
        await (0, node_test_1.it)("does not do anything if disabled", (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            file.filePath = "./test/resources/features/taggedCloud.feature";
            pluginContext.getOptions().plugin.enabled = false;
            context_1.default.setGlobalContext(pluginContext);
            (0, plugin_1.syncFeatureFile)(file);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                (0, dedent_1.dedent)(`
                    ./test/resources/features/taggedCloud.feature

                      Plugin disabled. Skipping feature file synchronization.
                `),
            ]);
        });
        await (0, node_test_1.it)("adds synchronization commands", (context) => {
            const addSynchronizationCommands = context.mock.method(file_preprocessor_1.default, "addSynchronizationCommands");
            pluginContext.getOptions().cucumber = {
                downloadFeatures: false,
                featureFileExtension: ".feature",
                prefixes: {},
                uploadFeatures: true,
            };
            context_1.default.setGlobalContext(pluginContext);
            (0, plugin_1.syncFeatureFile)(file);
            node_assert_1.default.deepStrictEqual(addSynchronizationCommands.mock.calls[0].arguments, [
                file,
                pluginContext.getOptions(),
                pluginContext.getClients(),
                pluginContext.getGraph(),
                pluginContext.getLogger(),
            ]);
        });
        await (0, node_test_1.it)("does not add synchronization commands for native test files", (context) => {
            const addSynchronizationCommands = context.mock.method(file_preprocessor_1.default, "addSynchronizationCommands");
            pluginContext.getOptions().cucumber = {
                downloadFeatures: false,
                featureFileExtension: ".feature",
                prefixes: {},
                uploadFeatures: true,
            };
            context_1.default.setGlobalContext(pluginContext);
            file.filePath = "/something.js";
            (0, plugin_1.syncFeatureFile)(file);
            node_assert_1.default.strictEqual(addSynchronizationCommands.mock.callCount(), 0);
        });
    });
});
