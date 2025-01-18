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
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const util_1 = require("../../../test/util");
const credentials_1 = require("../../client/authentication/credentials");
const requests_1 = require("../../client/https/requests");
const jira_client_1 = require("../../client/jira/jira-client");
const xray_client_server_1 = require("../../client/xray/xray-client-server");
const context_1 = __importStar(require("../../context"));
const executable_graph_1 = require("../../util/graph/executable-graph");
const logging_1 = require("../../util/logging");
const command_1 = require("../command");
const constant_command_1 = require("../util/commands/constant-command");
const destructure_command_1 = require("../util/commands/destructure-command");
const fallback_command_1 = require("../util/commands/fallback-command");
const attach_files_command_1 = require("../util/commands/jira/attach-files-command");
const extract_field_id_command_1 = require("../util/commands/jira/extract-field-id-command");
const fetch_all_fields_command_1 = require("../util/commands/jira/fetch-all-fields-command");
const get_summary_values_command_1 = require("../util/commands/jira/get-summary-values-command");
const transition_issue_command_1 = require("../util/commands/jira/transition-issue-command");
const import_execution_cucumber_command_1 = require("../util/commands/xray/import-execution-cucumber-command");
const import_execution_cypress_command_1 = require("../util/commands/xray/import-execution-cypress-command");
const import_feature_command_1 = require("../util/commands/xray/import-feature-command");
const after_run_1 = __importDefault(require("./after-run"));
const convert_info_command_1 = require("./commands/conversion/convert-info-command");
const assert_cucumber_conversion_valid_command_1 = require("./commands/conversion/cucumber/assert-cucumber-conversion-valid-command");
const combine_cucumber_multipart_command_1 = require("./commands/conversion/cucumber/combine-cucumber-multipart-command");
const convert_cucumber_features_command_1 = require("./commands/conversion/cucumber/convert-cucumber-features-command");
const assert_cypress_conversion_valid_command_1 = require("./commands/conversion/cypress/assert-cypress-conversion-valid-command");
const combine_cypress_xray_command_1 = require("./commands/conversion/cypress/combine-cypress-xray-command");
const convert_cypress_tests_command_1 = require("./commands/conversion/cypress/convert-cypress-tests-command");
const extract_video_files_command_1 = require("./commands/extract-video-files-command");
const verify_execution_issue_key_command_1 = require("./commands/verify-execution-issue-key-command");
const verify_results_upload_command_1 = require("./commands/verify-results-upload-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    let clients;
    let options;
    (0, node_test_1.beforeEach)(async () => {
        options = {
            cucumber: await context_1.default.initCucumberOptions({
                env: { jsonEnabled: true },
                excludeSpecPattern: "",
                projectRoot: "",
                reporter: "",
                specPattern: "",
                testingType: "component",
            }, {
                featureFileExtension: ".feature",
                prefixes: {
                    precondition: "Precondition:",
                    test: "TestName:",
                },
                uploadFeatures: true,
            }),
            http: {},
            jira: context_1.default.initJiraOptions({}, {
                projectKey: "CYP",
                url: "http://localhost:1234",
            }),
            plugin: context_1.default.initPluginOptions({}, {}),
            xray: context_1.default.initXrayOptions({}, {}),
        };
        const restClient = new requests_1.AxiosRestClient(axios_1.default);
        clients = {
            jiraClient: new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), restClient),
            kind: "server",
            xrayClient: new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), restClient),
        };
    });
    await (0, node_test_1.describe)(after_run_1.default.addUploadCommands.name, async () => {
        await (0, node_test_1.describe)("cypress", async () => {
            let result;
            (0, node_test_1.beforeEach)(() => {
                result = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultExistingTestIssues.json", "utf-8"));
            });
            await (0, node_test_1.it)("adds commands necessary for cypress results upload", async () => {
                const graph = new executable_graph_1.ExecutableGraph();
                await after_run_1.default.addUploadCommands(result, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                // Vertices.
                const [resultsCommand, convertCypressTestsCommand, issueSummaryCommand, issuetypeCommand, convertCommand, combineCypressJsonCommand, assertCypressConversionValidCommand, importExecutionCypressCommand, fallbackCypressUploadCommand, verifyResultsUploadCommand,] = [...graph.getVertices()];
                (0, util_1.assertIsInstanceOf)(resultsCommand, constant_command_1.ConstantCommand);
                (0, util_1.assertIsInstanceOf)(convertCypressTestsCommand, convert_cypress_tests_command_1.ConvertCypressTestsCommand);
                (0, util_1.assertIsInstanceOf)(issueSummaryCommand, constant_command_1.ConstantCommand);
                (0, util_1.assertIsInstanceOf)(issuetypeCommand, constant_command_1.ConstantCommand);
                (0, util_1.assertIsInstanceOf)(convertCommand, convert_info_command_1.ConvertInfoServerCommand);
                (0, util_1.assertIsInstanceOf)(combineCypressJsonCommand, combine_cypress_xray_command_1.CombineCypressJsonCommand);
                (0, util_1.assertIsInstanceOf)(assertCypressConversionValidCommand, assert_cypress_conversion_valid_command_1.AssertCypressConversionValidCommand);
                (0, util_1.assertIsInstanceOf)(importExecutionCypressCommand, import_execution_cypress_command_1.ImportExecutionCypressCommand);
                (0, util_1.assertIsInstanceOf)(fallbackCypressUploadCommand, fallback_command_1.FallbackCommand);
                (0, util_1.assertIsInstanceOf)(verifyResultsUploadCommand, verify_results_upload_command_1.VerifyResultsUploadCommand);
                // Vertex data.
                node_assert_1.default.deepStrictEqual(resultsCommand.getValue(), result);
                node_assert_1.default.deepStrictEqual(convertCypressTestsCommand.getParameters(), {
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    featureFileExtension: ".feature",
                    normalizeScreenshotNames: false,
                    projectKey: "CYP",
                    uploadScreenshots: true,
                    useCloudStatusFallback: false,
                    xrayStatus: {
                        failed: undefined,
                        passed: undefined,
                        pending: undefined,
                        skipped: undefined,
                        step: {
                            failed: undefined,
                            passed: undefined,
                            pending: undefined,
                            skipped: undefined,
                        },
                    },
                });
                node_assert_1.default.deepStrictEqual(convertCommand.getParameters(), {
                    jira: {
                        projectKey: options.jira.projectKey,
                        testPlanIssueKey: undefined,
                    },
                    xray: options.xray,
                });
                node_assert_1.default.deepStrictEqual(issueSummaryCommand.getValue(), "Execution Results [2022-11-28T17:41:12.234Z]");
                node_assert_1.default.deepStrictEqual(issuetypeCommand.getValue(), { name: "Test Execution" });
                node_assert_1.default.deepStrictEqual(combineCypressJsonCommand.getParameters(), {
                    testExecutionIssueKey: undefined,
                });
                node_assert_1.default.deepStrictEqual(importExecutionCypressCommand.getParameters(), {
                    xrayClient: clients.xrayClient,
                });
                node_assert_1.default.deepStrictEqual(fallbackCypressUploadCommand.getParameters(), {
                    fallbackOn: [command_1.ComputableState.FAILED, command_1.ComputableState.SKIPPED],
                    fallbackValue: undefined,
                });
                node_assert_1.default.deepStrictEqual(verifyResultsUploadCommand.getParameters(), {
                    url: "http://localhost:1234",
                });
                // Edges.
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(resultsCommand)], [convertCypressTestsCommand, convertCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(convertCypressTestsCommand)], [combineCypressJsonCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(issueSummaryCommand)], [convertCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(convertCommand)], [combineCypressJsonCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(combineCypressJsonCommand)], [assertCypressConversionValidCommand, importExecutionCypressCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(assertCypressConversionValidCommand)], [importExecutionCypressCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(importExecutionCypressCommand)], [fallbackCypressUploadCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(fallbackCypressUploadCommand)], [verifyResultsUploadCommand]);
                node_assert_1.default.strictEqual(graph.size("vertices"), 10);
                node_assert_1.default.strictEqual(graph.size("edges"), 11);
            });
            await (0, node_test_1.it)("uses configured test execution issue keys", async () => {
                const graph = new executable_graph_1.ExecutableGraph();
                options.jira.testExecutionIssue = {
                    key: "CYP-415",
                };
                await after_run_1.default.addUploadCommands(result, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                // Vertices.
                const commands = [...graph.getVertices()];
                const issueKeysCommand = commands[3];
                const getSummaryValuesCommand = commands[4];
                const destructureCommand = commands[5];
                const convertInfoServerCommand = commands[7];
                const importCypressExecutionCommand = commands[10];
                const verifyExecutionIssueKeyCommand = commands[11];
                const fallbackCypressUploadCommand = commands[12];
                (0, util_1.assertIsInstanceOf)(issueKeysCommand, constant_command_1.ConstantCommand);
                (0, util_1.assertIsInstanceOf)(getSummaryValuesCommand, get_summary_values_command_1.GetSummaryValuesCommand);
                (0, util_1.assertIsInstanceOf)(destructureCommand, destructure_command_1.DestructureCommand);
                (0, util_1.assertIsInstanceOf)(importCypressExecutionCommand, import_execution_cypress_command_1.ImportExecutionCypressCommand);
                (0, util_1.assertIsInstanceOf)(verifyExecutionIssueKeyCommand, verify_execution_issue_key_command_1.VerifyExecutionIssueKeyCommand);
                (0, util_1.assertIsInstanceOf)(fallbackCypressUploadCommand, fallback_command_1.FallbackCommand);
                // Vertex data.
                node_assert_1.default.deepStrictEqual(issueKeysCommand.getValue(), ["CYP-415"]);
                node_assert_1.default.deepStrictEqual(getSummaryValuesCommand.getParameters(), {
                    jiraClient: clients.jiraClient,
                });
                node_assert_1.default.deepStrictEqual(destructureCommand.getParameters(), {
                    accessor: "CYP-415",
                });
                node_assert_1.default.deepStrictEqual(verifyExecutionIssueKeyCommand.getParameters(), {
                    displayCloudHelp: false,
                    importType: "cypress",
                    testExecutionIssueKey: "CYP-415",
                    testExecutionIssueType: { name: "Test Execution" },
                });
                // Edges.
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(issueKeysCommand)], [getSummaryValuesCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(getSummaryValuesCommand)], [destructureCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(destructureCommand)], [convertInfoServerCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(importCypressExecutionCommand)], [verifyExecutionIssueKeyCommand, fallbackCypressUploadCommand]);
                node_assert_1.default.strictEqual(graph.size("vertices"), 14);
                node_assert_1.default.strictEqual(graph.size("edges"), 15);
            });
            await (0, node_test_1.it)("uses configured test execution issue data with known fields", async () => {
                const graph = new executable_graph_1.ExecutableGraph();
                options.jira.testExecutionIssue = {
                    fields: {
                        issuetype: {
                            name: "Test Run",
                        },
                    },
                    key: "CYP-415",
                };
                await after_run_1.default.addUploadCommands(result, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                // Vertices.
                const commands = [...graph.getVertices()];
                const issueKeysCommand = commands[3];
                const getSummaryValuesCommand = commands[4];
                (0, util_1.assertIsInstanceOf)(issueKeysCommand, constant_command_1.ConstantCommand);
                (0, util_1.assertIsInstanceOf)(getSummaryValuesCommand, get_summary_values_command_1.GetSummaryValuesCommand);
                // Vertex data.
                node_assert_1.default.deepStrictEqual(issueKeysCommand.getValue(), ["CYP-415"]);
                node_assert_1.default.deepStrictEqual(getSummaryValuesCommand.getParameters(), {
                    jiraClient: clients.jiraClient,
                });
                // Edges.
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(issueKeysCommand)], [getSummaryValuesCommand]);
                node_assert_1.default.strictEqual(graph.size("vertices"), 14);
                node_assert_1.default.strictEqual(graph.size("edges"), 15);
            });
            await (0, node_test_1.it)("uses configured summaries", async () => {
                const graph = new executable_graph_1.ExecutableGraph();
                options.jira.testExecutionIssue = {
                    fields: {
                        summary: "My summary",
                    },
                };
                await after_run_1.default.addUploadCommands(result, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                // Vertices.
                const commands = [...graph.getVertices()];
                const issueSummaryCommand = commands[3];
                const convertInfoServerCommand = commands[5];
                (0, util_1.assertIsInstanceOf)(issueSummaryCommand, constant_command_1.ConstantCommand);
                (0, util_1.assertIsInstanceOf)(convertInfoServerCommand, convert_info_command_1.ConvertInfoServerCommand);
                // Vertex data.
                node_assert_1.default.deepStrictEqual(issueSummaryCommand.getValue(), "My summary");
                // Edges.
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(issueSummaryCommand)], [convertInfoServerCommand]);
                node_assert_1.default.strictEqual(graph.size("vertices"), 11);
                node_assert_1.default.strictEqual(graph.size("edges"), 12);
            });
            await (0, node_test_1.it)("uses configured custom issue data", async () => {
                const graph = new executable_graph_1.ExecutableGraph();
                options.jira.testExecutionIssue = {
                    fields: {
                        assignee: "someone else",
                        ["customfield_12345"]: "bonjour",
                    },
                };
                await after_run_1.default.addUploadCommands(result, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                // Vertices.
                const commands = [...graph.getVertices()];
                const issueUpdateCommand = commands[2];
                (0, util_1.assertIsInstanceOf)(issueUpdateCommand, constant_command_1.ConstantCommand);
                // Vertex data.
                node_assert_1.default.deepStrictEqual(issueUpdateCommand.getValue(), {
                    fields: {
                        assignee: "someone else",
                        ["customfield_12345"]: "bonjour",
                    },
                });
                node_assert_1.default.strictEqual(graph.size("vertices"), 11);
                node_assert_1.default.strictEqual(graph.size("edges"), 12);
            });
            await (0, node_test_1.it)("attaches videos", async () => {
                const graph = new executable_graph_1.ExecutableGraph();
                options.jira.attachVideos = true;
                await after_run_1.default.addUploadCommands(result, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                // Vertices.
                const commands = [...graph.getVertices()];
                const resultsCommand = commands[0];
                const verifyResultsUploadCommand = commands[9];
                const extractVideoFilesCommand = commands[10];
                const attachVideosCommand = commands[11];
                (0, util_1.assertIsInstanceOf)(extractVideoFilesCommand, extract_video_files_command_1.ExtractVideoFilesCommand);
                (0, util_1.assertIsInstanceOf)(attachVideosCommand, attach_files_command_1.AttachFilesCommand);
                // Vertex data.
                node_assert_1.default.deepStrictEqual(attachVideosCommand.getParameters(), {
                    jiraClient: clients.jiraClient,
                });
                // Edges.
                node_assert_1.default.ok([...graph.getSuccessors(resultsCommand)].includes(extractVideoFilesCommand));
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(extractVideoFilesCommand)], [attachVideosCommand]);
                node_assert_1.default.ok([...graph.getSuccessors(verifyResultsUploadCommand)].includes(attachVideosCommand));
                node_assert_1.default.strictEqual(graph.size("vertices"), 12);
                node_assert_1.default.strictEqual(graph.size("edges"), 14);
            });
            await (0, node_test_1.it)("explicitly transitions issues in server environments", async () => {
                const graph = new executable_graph_1.ExecutableGraph();
                options.jira.testExecutionIssue = {
                    transition: {
                        id: "6",
                    },
                };
                clients.kind = "server";
                await after_run_1.default.addUploadCommands(result, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                // Vertices.
                const commands = [...graph.getVertices()];
                const verifyResultsUploadCommand = commands[10];
                const transitionIssueCommand = commands[11];
                (0, util_1.assertIsInstanceOf)(transitionIssueCommand, transition_issue_command_1.TransitionIssueCommand);
                // Vertex data.
                node_assert_1.default.deepStrictEqual(transitionIssueCommand.getParameters(), {
                    jiraClient: clients.jiraClient,
                    transition: {
                        id: "6",
                    },
                });
                // Edges.
                node_assert_1.default.ok([...graph.getSuccessors(verifyResultsUploadCommand)].includes(transitionIssueCommand));
                node_assert_1.default.strictEqual(graph.size("vertices"), 12);
                node_assert_1.default.strictEqual(graph.size("edges"), 13);
            });
            await (0, node_test_1.it)("does not explicitly transition issues in cloud environments", async () => {
                const graph = new executable_graph_1.ExecutableGraph();
                options.jira.testExecutionIssue = {
                    transition: {
                        id: "6",
                    },
                };
                clients.kind = "cloud";
                await after_run_1.default.addUploadCommands(result, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                // Vertices.
                const commands = [...graph.getVertices()];
                const verifyResultsUploadCommand = commands[10];
                (0, util_1.assertIsInstanceOf)(verifyResultsUploadCommand, verify_results_upload_command_1.VerifyResultsUploadCommand);
                // Edges.
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(verifyResultsUploadCommand)], []);
                node_assert_1.default.strictEqual(graph.size("vertices"), 11);
                node_assert_1.default.strictEqual(graph.size("edges"), 12);
            });
        });
        await (0, node_test_1.describe)("cucumber", async () => {
            let cypressResult;
            let cucumberResult;
            (0, node_test_1.beforeEach)(() => {
                cypressResult = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultCucumber.json", "utf-8"));
                options.cucumber = {
                    downloadFeatures: false,
                    featureFileExtension: ".feature",
                    prefixes: {},
                    preprocessor: {
                        json: {
                            enabled: true,
                            output: "./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartServer.json",
                        },
                    },
                    uploadFeatures: false,
                };
                cucumberResult = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartServer.json", "utf-8"));
            });
            await (0, node_test_1.describe)("server", async () => {
                await (0, node_test_1.it)("adds commands necessary for cucumber results upload", async (context) => {
                    context.mock.timers.enable({ apis: ["Date"] });
                    context.mock.timers.tick(12345);
                    const graph = new executable_graph_1.ExecutableGraph();
                    await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                    // Vertices.
                    const [cypressResultsCommand, issueSummaryCommand, issuetypeCommand, convertMultipartInfoCommand, cucumberResultsCommand, convertCucumberFeaturesCommand, combineCucumberMultipartCommand, assertConversionValidCommand, importCucumberExecutionCommand, fallbackCucumberUploadCommand, verifyResultsUploadCommand,] = [...graph.getVertices()];
                    (0, util_1.assertIsInstanceOf)(cypressResultsCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(cucumberResultsCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(issueSummaryCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(issuetypeCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(convertMultipartInfoCommand, convert_info_command_1.ConvertInfoServerCommand);
                    (0, util_1.assertIsInstanceOf)(convertCucumberFeaturesCommand, convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand);
                    (0, util_1.assertIsInstanceOf)(combineCucumberMultipartCommand, combine_cucumber_multipart_command_1.CombineCucumberMultipartCommand);
                    (0, util_1.assertIsInstanceOf)(assertConversionValidCommand, assert_cucumber_conversion_valid_command_1.AssertCucumberConversionValidCommand);
                    (0, util_1.assertIsInstanceOf)(importCucumberExecutionCommand, import_execution_cucumber_command_1.ImportExecutionCucumberCommand);
                    (0, util_1.assertIsInstanceOf)(fallbackCucumberUploadCommand, fallback_command_1.FallbackCommand);
                    (0, util_1.assertIsInstanceOf)(verifyResultsUploadCommand, verify_results_upload_command_1.VerifyResultsUploadCommand);
                    // Vertex data.
                    node_assert_1.default.deepStrictEqual(cypressResultsCommand.getValue(), cypressResult);
                    node_assert_1.default.deepStrictEqual(cucumberResultsCommand.getValue(), cucumberResult);
                    node_assert_1.default.deepStrictEqual(issueSummaryCommand.getValue(), "Execution Results [2023-07-23T21:26:15.539Z]");
                    node_assert_1.default.deepStrictEqual(issuetypeCommand.getValue(), {
                        name: "Test Execution",
                    });
                    node_assert_1.default.deepStrictEqual(convertMultipartInfoCommand.getParameters(), {
                        jira: {
                            projectKey: options.jira.projectKey,
                            testPlanIssueKey: undefined,
                        },
                        xray: options.xray,
                    });
                    node_assert_1.default.deepStrictEqual(convertCucumberFeaturesCommand.getParameters(), {
                        cucumber: {
                            prefixes: {
                                precondition: undefined,
                                test: undefined,
                            },
                        },
                        jira: {
                            projectKey: "CYP",
                        },
                        projectRoot: ".",
                        useCloudTags: false,
                        xray: {
                            status: {
                                failed: undefined,
                                passed: undefined,
                                pending: undefined,
                                skipped: undefined,
                                step: {
                                    failed: undefined,
                                    passed: undefined,
                                    pending: undefined,
                                    skipped: undefined,
                                },
                            },
                            testEnvironments: undefined,
                            uploadScreenshots: true,
                        },
                    });
                    node_assert_1.default.deepStrictEqual(importCucumberExecutionCommand.getParameters(), {
                        xrayClient: clients.xrayClient,
                    });
                    node_assert_1.default.deepStrictEqual(fallbackCucumberUploadCommand.getParameters(), {
                        fallbackOn: [command_1.ComputableState.FAILED, command_1.ComputableState.SKIPPED],
                        fallbackValue: undefined,
                    });
                    // Edges.
                    node_assert_1.default.ok([...graph.getSuccessors(cypressResultsCommand)].includes(convertMultipartInfoCommand));
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(cucumberResultsCommand)], [convertCucumberFeaturesCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(issueSummaryCommand)], [convertMultipartInfoCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(issuetypeCommand)], [convertMultipartInfoCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(convertMultipartInfoCommand)], [combineCucumberMultipartCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(convertCucumberFeaturesCommand)], [combineCucumberMultipartCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(combineCucumberMultipartCommand)], [assertConversionValidCommand, importCucumberExecutionCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(assertConversionValidCommand)], [importCucumberExecutionCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(importCucumberExecutionCommand)], [fallbackCucumberUploadCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(fallbackCucumberUploadCommand)], [verifyResultsUploadCommand]);
                    node_assert_1.default.strictEqual(graph.size("vertices"), 11);
                    node_assert_1.default.strictEqual(graph.size("edges"), 11);
                });
                await (0, node_test_1.it)("uses configured test plan data", async () => {
                    options.jira.testPlanIssueKey = "CYP-42";
                    const graph = new executable_graph_1.ExecutableGraph();
                    await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                    // Vertices.
                    const commands = [...graph.getVertices()];
                    const fetchAllFieldsCommand = commands[0];
                    const testPlanIdCommand = commands[1];
                    const convertCommand = commands[5];
                    (0, util_1.assertIsInstanceOf)(fetchAllFieldsCommand, fetch_all_fields_command_1.FetchAllFieldsCommand);
                    (0, util_1.assertIsInstanceOf)(testPlanIdCommand, extract_field_id_command_1.ExtractFieldIdCommand);
                    // Vertex data.
                    node_assert_1.default.deepStrictEqual(fetchAllFieldsCommand.getParameters(), {
                        jiraClient: clients.jiraClient,
                    });
                    node_assert_1.default.deepStrictEqual(testPlanIdCommand.getParameters(), {
                        field: extract_field_id_command_1.JiraField.TEST_PLAN,
                    });
                    // Edges.
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(fetchAllFieldsCommand)], [testPlanIdCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(testPlanIdCommand)], [convertCommand]);
                    node_assert_1.default.strictEqual(graph.size("vertices"), 13);
                    node_assert_1.default.strictEqual(graph.size("edges"), 13);
                });
                await (0, node_test_1.it)("uses configured test plan data with hardcoded test plan ids", async () => {
                    options.jira.testPlanIssueKey = "CYP-42";
                    options.jira.fields.testPlan = "customfield_12345";
                    const graph = new executable_graph_1.ExecutableGraph();
                    await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                    // Vertices.
                    const commands = [...graph.getVertices()];
                    const testPlanIdCommand = commands[0];
                    const convertCommand = commands[4];
                    (0, util_1.assertIsInstanceOf)(testPlanIdCommand, constant_command_1.ConstantCommand);
                    // Vertex data.
                    node_assert_1.default.strictEqual(testPlanIdCommand.getValue(), "customfield_12345");
                    // Edges.
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(testPlanIdCommand)], [convertCommand]);
                    node_assert_1.default.strictEqual(graph.size("vertices"), 12);
                    node_assert_1.default.strictEqual(graph.size("edges"), 12);
                });
                await (0, node_test_1.it)("uses configured test environment data", async () => {
                    options.xray.testEnvironments = ["DEV"];
                    const graph = new executable_graph_1.ExecutableGraph();
                    await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                    // Vertices.
                    const commands = [...graph.getVertices()];
                    const fetchAllFieldsCommand = commands[0];
                    const testEnvironmentsIdCommand = commands[1];
                    const convertCommand = commands[5];
                    (0, util_1.assertIsInstanceOf)(fetchAllFieldsCommand, fetch_all_fields_command_1.FetchAllFieldsCommand);
                    (0, util_1.assertIsInstanceOf)(testEnvironmentsIdCommand, extract_field_id_command_1.ExtractFieldIdCommand);
                    // Vertex data.
                    node_assert_1.default.deepStrictEqual(fetchAllFieldsCommand.getParameters(), {
                        jiraClient: clients.jiraClient,
                    });
                    node_assert_1.default.deepStrictEqual(testEnvironmentsIdCommand.getParameters(), {
                        field: extract_field_id_command_1.JiraField.TEST_ENVIRONMENTS,
                    });
                    // Edges.
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(fetchAllFieldsCommand)], [testEnvironmentsIdCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(testEnvironmentsIdCommand)], [convertCommand]);
                    node_assert_1.default.strictEqual(graph.size("vertices"), 13);
                    node_assert_1.default.strictEqual(graph.size("edges"), 13);
                });
                await (0, node_test_1.it)("uses configured test environment data with hardcoded test environment ids", async () => {
                    options.xray.testEnvironments = ["DEV"];
                    options.jira.fields.testEnvironments = "customfield_67890";
                    const graph = new executable_graph_1.ExecutableGraph();
                    await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                    // Vertices.
                    const commands = [...graph.getVertices()];
                    const testEnvironmentsIdCommand = commands[0];
                    const convertCommand = commands[4];
                    (0, util_1.assertIsInstanceOf)(testEnvironmentsIdCommand, constant_command_1.ConstantCommand);
                    // Vertex data.
                    node_assert_1.default.strictEqual(testEnvironmentsIdCommand.getValue(), "customfield_67890");
                    // Edges.
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(testEnvironmentsIdCommand)], [convertCommand]);
                    node_assert_1.default.strictEqual(graph.size("vertices"), 12);
                    node_assert_1.default.strictEqual(graph.size("edges"), 12);
                });
                await (0, node_test_1.it)("uses configured test plan and environment data", async () => {
                    options.jira.testPlanIssueKey = "CYP-42";
                    options.xray.testEnvironments = ["DEV"];
                    const graph = new executable_graph_1.ExecutableGraph();
                    await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                    // Vertices.
                    const commands = [...graph.getVertices()];
                    const fetchAllFieldsCommand = commands[0];
                    const testPlanIdCommand = commands[1];
                    const testEnvironmentsIdCommand = commands[2];
                    const convertCommand = commands[6];
                    (0, util_1.assertIsInstanceOf)(fetchAllFieldsCommand, fetch_all_fields_command_1.FetchAllFieldsCommand);
                    (0, util_1.assertIsInstanceOf)(testPlanIdCommand, extract_field_id_command_1.ExtractFieldIdCommand);
                    (0, util_1.assertIsInstanceOf)(testEnvironmentsIdCommand, extract_field_id_command_1.ExtractFieldIdCommand);
                    // Edges.
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(fetchAllFieldsCommand)], [testPlanIdCommand, testEnvironmentsIdCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(testPlanIdCommand)], [convertCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(testEnvironmentsIdCommand)], [convertCommand]);
                    node_assert_1.default.strictEqual(graph.size("vertices"), 14);
                    node_assert_1.default.strictEqual(graph.size("edges"), 15);
                });
                await (0, node_test_1.it)("uses configured test plan and environment data with hardcoded ids", async () => {
                    options.jira.testPlanIssueKey = "CYP-42";
                    options.jira.fields.testPlan = "customfield_12345";
                    options.xray.testEnvironments = ["DEV"];
                    options.jira.fields.testEnvironments = "customfield_67890";
                    const graph = new executable_graph_1.ExecutableGraph();
                    await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                    // Vertices.
                    const commands = [...graph.getVertices()];
                    const testPlanIdCommand = commands[0];
                    const testEnvironmentsIdCommand = commands[1];
                    const convertCommand = commands[5];
                    (0, util_1.assertIsInstanceOf)(testPlanIdCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(testEnvironmentsIdCommand, constant_command_1.ConstantCommand);
                    // Vertex data.
                    node_assert_1.default.strictEqual(testPlanIdCommand.getValue(), "customfield_12345");
                    node_assert_1.default.strictEqual(testEnvironmentsIdCommand.getValue(), "customfield_67890");
                    // Edges.
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(testPlanIdCommand)], [convertCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(testEnvironmentsIdCommand)], [convertCommand]);
                    node_assert_1.default.strictEqual(graph.size("vertices"), 13);
                    node_assert_1.default.strictEqual(graph.size("edges"), 13);
                });
            });
            await (0, node_test_1.describe)("cloud", async () => {
                (0, node_test_1.beforeEach)(() => {
                    clients.kind = "cloud";
                });
                await (0, node_test_1.it)("adds commands necessary for cucumber results upload", async () => {
                    const graph = new executable_graph_1.ExecutableGraph();
                    await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                    // Vertices.
                    const commands = [...graph.getVertices()];
                    const issuetypeCommand = commands[2];
                    const convertCommand = commands[3];
                    const convertCucumberFeaturesCommand = commands[5];
                    (0, util_1.assertIsInstanceOf)(issuetypeCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(convertCommand, convert_info_command_1.ConvertInfoCloudCommand);
                    node_assert_1.default.deepStrictEqual(issuetypeCommand.getValue(), {
                        name: "Test Execution",
                    });
                    node_assert_1.default.deepStrictEqual(convertCommand.getParameters(), {
                        jira: {
                            projectKey: options.jira.projectKey,
                            testPlanIssueKey: undefined,
                        },
                        xray: options.xray,
                    });
                    node_assert_1.default.deepStrictEqual(convertCucumberFeaturesCommand.getParameters(), {
                        cucumber: {
                            prefixes: {
                                precondition: undefined,
                                test: undefined,
                            },
                        },
                        jira: {
                            projectKey: "CYP",
                        },
                        projectRoot: ".",
                        useCloudTags: true,
                        xray: {
                            status: {
                                failed: undefined,
                                passed: undefined,
                                pending: undefined,
                                skipped: undefined,
                                step: {
                                    failed: undefined,
                                    passed: undefined,
                                    pending: undefined,
                                    skipped: undefined,
                                },
                            },
                            testEnvironments: undefined,
                            uploadScreenshots: true,
                        },
                    });
                    node_assert_1.default.strictEqual(graph.size("vertices"), 11);
                });
                await (0, node_test_1.it)("uses configured test execution issue data", async () => {
                    const graph = new executable_graph_1.ExecutableGraph();
                    options.jira.testExecutionIssue = {
                        fields: {
                            issuetype: {
                                name: "Test Run",
                            },
                        },
                        key: "CYP-42",
                    };
                    await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                    // Vertices.
                    const [cypressResultsCommand, issueUpdateCommand, issueKeysCommand, getSummaryValuesCommand, destructureCommand, issuetypeCommand, convertInfoCloudCommand, cucumberResultsCommand, testExecutionIssueKeyCommand, convertCucumberFeaturesCommand, combineCucumberMultipartCommand, assertConversionValidCommand, importCucumberExecutionCommand, verifyExecutionIssueKeyCommand, fallbackCucumberUploadCommand, verifyResultsUploadCommand,] = [...graph.getVertices()];
                    (0, util_1.assertIsInstanceOf)(cypressResultsCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(issueUpdateCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(cucumberResultsCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(testExecutionIssueKeyCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(issueKeysCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(getSummaryValuesCommand, get_summary_values_command_1.GetSummaryValuesCommand);
                    (0, util_1.assertIsInstanceOf)(destructureCommand, destructure_command_1.DestructureCommand);
                    (0, util_1.assertIsInstanceOf)(issuetypeCommand, constant_command_1.ConstantCommand);
                    (0, util_1.assertIsInstanceOf)(convertInfoCloudCommand, convert_info_command_1.ConvertInfoCloudCommand);
                    (0, util_1.assertIsInstanceOf)(convertCucumberFeaturesCommand, convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand);
                    (0, util_1.assertIsInstanceOf)(combineCucumberMultipartCommand, combine_cucumber_multipart_command_1.CombineCucumberMultipartCommand);
                    (0, util_1.assertIsInstanceOf)(assertConversionValidCommand, assert_cucumber_conversion_valid_command_1.AssertCucumberConversionValidCommand);
                    (0, util_1.assertIsInstanceOf)(importCucumberExecutionCommand, import_execution_cucumber_command_1.ImportExecutionCucumberCommand);
                    (0, util_1.assertIsInstanceOf)(verifyExecutionIssueKeyCommand, verify_execution_issue_key_command_1.VerifyExecutionIssueKeyCommand);
                    (0, util_1.assertIsInstanceOf)(fallbackCucumberUploadCommand, fallback_command_1.FallbackCommand);
                    (0, util_1.assertIsInstanceOf)(verifyResultsUploadCommand, verify_results_upload_command_1.VerifyResultsUploadCommand);
                    // Vertex data.
                    node_assert_1.default.deepStrictEqual(cypressResultsCommand.getValue(), cypressResult);
                    node_assert_1.default.deepStrictEqual(issueUpdateCommand.getValue(), {
                        fields: {
                            issuetype: {
                                name: "Test Run",
                            },
                        },
                        key: "CYP-42",
                    });
                    node_assert_1.default.deepStrictEqual(cucumberResultsCommand.getValue(), cucumberResult);
                    node_assert_1.default.deepStrictEqual(testExecutionIssueKeyCommand.getValue(), "CYP-42");
                    node_assert_1.default.deepStrictEqual(issuetypeCommand.getValue(), {
                        name: "Test Run",
                    });
                    node_assert_1.default.deepStrictEqual(issueKeysCommand.getValue(), ["CYP-42"]);
                    node_assert_1.default.deepStrictEqual(getSummaryValuesCommand.getParameters(), {
                        jiraClient: clients.jiraClient,
                    });
                    node_assert_1.default.deepStrictEqual(destructureCommand.getParameters(), {
                        accessor: "CYP-42",
                    });
                    node_assert_1.default.deepStrictEqual(convertInfoCloudCommand.getParameters(), {
                        jira: {
                            projectKey: options.jira.projectKey,
                            testPlanIssueKey: undefined,
                        },
                        xray: options.xray,
                    });
                    node_assert_1.default.deepStrictEqual(convertCucumberFeaturesCommand.getParameters(), {
                        cucumber: {
                            prefixes: {
                                precondition: undefined,
                                test: undefined,
                            },
                        },
                        jira: {
                            projectKey: "CYP",
                        },
                        projectRoot: ".",
                        useCloudTags: true,
                        xray: {
                            status: {
                                failed: undefined,
                                passed: undefined,
                                pending: undefined,
                                skipped: undefined,
                                step: {
                                    failed: undefined,
                                    passed: undefined,
                                    pending: undefined,
                                    skipped: undefined,
                                },
                            },
                            testEnvironments: undefined,
                            uploadScreenshots: true,
                        },
                    });
                    node_assert_1.default.deepStrictEqual(importCucumberExecutionCommand.getParameters(), {
                        xrayClient: clients.xrayClient,
                    });
                    node_assert_1.default.deepStrictEqual(verifyExecutionIssueKeyCommand.getParameters(), {
                        displayCloudHelp: true,
                        importType: "cucumber",
                        testExecutionIssueKey: "CYP-42",
                        testExecutionIssueType: { name: "Test Run" },
                    });
                    // Edges.
                    node_assert_1.default.ok([...graph.getSuccessors(cypressResultsCommand)].includes(convertInfoCloudCommand));
                    node_assert_1.default.ok([...graph.getSuccessors(issueUpdateCommand)].includes(convertInfoCloudCommand));
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(cucumberResultsCommand)], [convertCucumberFeaturesCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(testExecutionIssueKeyCommand)], [convertCucumberFeaturesCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(issuetypeCommand)], [convertInfoCloudCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(issueKeysCommand)], [getSummaryValuesCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(getSummaryValuesCommand)], [destructureCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(destructureCommand)], [convertInfoCloudCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(convertInfoCloudCommand)], [combineCucumberMultipartCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(convertCucumberFeaturesCommand)], [combineCucumberMultipartCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(combineCucumberMultipartCommand)], [assertConversionValidCommand, importCucumberExecutionCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(assertConversionValidCommand)], [importCucumberExecutionCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(importCucumberExecutionCommand)], [verifyExecutionIssueKeyCommand, fallbackCucumberUploadCommand]);
                    node_assert_1.default.deepStrictEqual([...graph.getSuccessors(fallbackCucumberUploadCommand)], [verifyResultsUploadCommand]);
                    node_assert_1.default.strictEqual(graph.size("vertices"), 16);
                    node_assert_1.default.strictEqual(graph.size("edges"), 16);
                });
            });
            await (0, node_test_1.it)("throws if the cucumber report was not configured", async () => {
                const graph = new executable_graph_1.ExecutableGraph();
                const preprocessorOptions = options.cucumber;
                preprocessorOptions.preprocessor = undefined;
                await node_assert_1.default.rejects(after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG), {
                    message: "Failed to prepare Cucumber upload: Cucumber preprocessor JSON report path not configured.",
                });
            });
            await (0, node_test_1.it)("does not add any commands if neither cypress nor cucumber results exist", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                cypressResult.runs = [];
                const graph = new executable_graph_1.ExecutableGraph();
                await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                node_assert_1.default.strictEqual(graph.size("vertices"), 0);
                node_assert_1.default.strictEqual(graph.size("edges"), 0);
                node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                    logging_1.Level.WARNING,
                    "No test execution results to upload, skipping results upload preparations.",
                ]);
            });
            await (0, node_test_1.it)("adds connections from feature file imports to execution uploads", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                options.cucumber = {
                    downloadFeatures: false,
                    featureFileExtension: ".feature",
                    prefixes: {},
                    preprocessor: {
                        json: {
                            enabled: true,
                            output: "./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartServer.json",
                        },
                    },
                    uploadFeatures: true,
                };
                const graph = new executable_graph_1.ExecutableGraph();
                graph.place(new import_feature_command_1.ImportFeatureCommand({
                    filePath: (0, node_path_1.relative)(".", "cypress/e2e/outline.cy.feature"),
                    xrayClient: clients.xrayClient,
                }, logging_1.LOG));
                graph.place(new import_feature_command_1.ImportFeatureCommand({
                    filePath: (0, node_path_1.relative)(".", "cypress/e2e/spec.cy.feature"),
                    xrayClient: clients.xrayClient,
                }, logging_1.LOG));
                graph.place(new import_feature_command_1.ImportFeatureCommand({
                    filePath: (0, node_path_1.relative)(".", "cypress/e2e/nonexistent.cy.feature"),
                    xrayClient: clients.xrayClient,
                }, logging_1.LOG));
                await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                // Vertices.
                const commands = [...graph.getVertices()];
                const importFeatureCommand1 = commands[0];
                const importFeatureCommand2 = commands[1];
                const importFeatureCommand3 = commands[2];
                const importCucumberExecutionCommand = commands[11];
                // Edges.
                node_assert_1.default.ok([...graph.getSuccessors(importFeatureCommand1)].includes(importCucumberExecutionCommand));
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(importFeatureCommand2)], [importCucumberExecutionCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(importFeatureCommand3)], []);
                node_assert_1.default.strictEqual(graph.size("vertices"), 14);
                node_assert_1.default.strictEqual(graph.size("edges"), 13);
            });
        });
        await (0, node_test_1.describe)("mixed", async () => {
            let cypressResult;
            let cucumberResult;
            (0, node_test_1.beforeEach)(() => {
                cypressResult = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/runResultCucumberMixed.json", "utf-8"));
                cucumberResult = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartServer.json", "utf-8"));
                options.cucumber = {
                    downloadFeatures: false,
                    featureFileExtension: ".feature",
                    prefixes: {},
                    preprocessor: {
                        json: {
                            enabled: true,
                            output: "./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartServer.json",
                        },
                    },
                    uploadFeatures: false,
                };
            });
            await (0, node_test_1.it)("adds commands necessary for mixed results upload", async (context) => {
                context.mock.timers.enable({ apis: ["Date"] });
                context.mock.timers.tick(12345);
                const graph = new executable_graph_1.ExecutableGraph();
                await after_run_1.default.addUploadCommands(cypressResult, ".", options, clients, new context_1.SimpleEvidenceCollection(), graph, logging_1.LOG);
                // Vertices.
                const [cypressResultsCommand, convertCypressTestsCommand, issueSummaryCommand, issuetypeCommand, convertInfoServerCommand, combineCypressJsonCommand, assertCypressConversionValidCommand, importExecutionCypressCommand, cucumberResultsCommand, convertCucumberFeaturesCommand, combineCucumberMultipartCommand, assertCucumberConversionValidCommand, importCucumberExecutionCommand, fallbackCypressUploadCommand, fallbackCucumberUploadCommand, verifyResultsUploadCommand,] = [...graph.getVertices()];
                (0, util_1.assertIsInstanceOf)(cypressResultsCommand, constant_command_1.ConstantCommand);
                (0, util_1.assertIsInstanceOf)(convertCypressTestsCommand, convert_cypress_tests_command_1.ConvertCypressTestsCommand);
                (0, util_1.assertIsInstanceOf)(issueSummaryCommand, constant_command_1.ConstantCommand);
                (0, util_1.assertIsInstanceOf)(issuetypeCommand, constant_command_1.ConstantCommand);
                (0, util_1.assertIsInstanceOf)(convertInfoServerCommand, convert_info_command_1.ConvertInfoServerCommand);
                (0, util_1.assertIsInstanceOf)(combineCypressJsonCommand, combine_cypress_xray_command_1.CombineCypressJsonCommand);
                (0, util_1.assertIsInstanceOf)(assertCypressConversionValidCommand, assert_cypress_conversion_valid_command_1.AssertCypressConversionValidCommand);
                (0, util_1.assertIsInstanceOf)(importExecutionCypressCommand, import_execution_cypress_command_1.ImportExecutionCypressCommand);
                (0, util_1.assertIsInstanceOf)(cucumberResultsCommand, constant_command_1.ConstantCommand);
                (0, util_1.assertIsInstanceOf)(fallbackCypressUploadCommand, fallback_command_1.FallbackCommand);
                (0, util_1.assertIsInstanceOf)(convertCucumberFeaturesCommand, convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand);
                (0, util_1.assertIsInstanceOf)(combineCucumberMultipartCommand, combine_cucumber_multipart_command_1.CombineCucumberMultipartCommand);
                (0, util_1.assertIsInstanceOf)(assertCucumberConversionValidCommand, assert_cucumber_conversion_valid_command_1.AssertCucumberConversionValidCommand);
                (0, util_1.assertIsInstanceOf)(importCucumberExecutionCommand, import_execution_cucumber_command_1.ImportExecutionCucumberCommand);
                (0, util_1.assertIsInstanceOf)(fallbackCucumberUploadCommand, fallback_command_1.FallbackCommand);
                (0, util_1.assertIsInstanceOf)(verifyResultsUploadCommand, verify_results_upload_command_1.VerifyResultsUploadCommand);
                // Vertex data.
                node_assert_1.default.deepStrictEqual(cypressResultsCommand.getValue(), cypressResult);
                node_assert_1.default.deepStrictEqual(convertCypressTestsCommand.getParameters(), {
                    evidenceCollection: new context_1.SimpleEvidenceCollection(),
                    featureFileExtension: ".feature",
                    normalizeScreenshotNames: false,
                    projectKey: "CYP",
                    uploadScreenshots: true,
                    useCloudStatusFallback: false,
                    xrayStatus: {
                        failed: undefined,
                        passed: undefined,
                        pending: undefined,
                        skipped: undefined,
                        step: {
                            failed: undefined,
                            passed: undefined,
                            pending: undefined,
                            skipped: undefined,
                        },
                    },
                });
                node_assert_1.default.deepStrictEqual(issueSummaryCommand.getValue(), "Execution Results [2023-07-23T21:26:15.539Z]");
                node_assert_1.default.deepStrictEqual(issuetypeCommand.getValue(), {
                    name: "Test Execution",
                });
                node_assert_1.default.deepStrictEqual(convertInfoServerCommand.getParameters(), {
                    jira: {
                        projectKey: options.jira.projectKey,
                        testPlanIssueKey: undefined,
                    },
                    xray: options.xray,
                });
                node_assert_1.default.deepStrictEqual(combineCypressJsonCommand.getParameters(), {
                    testExecutionIssueKey: undefined,
                });
                node_assert_1.default.deepStrictEqual(importExecutionCypressCommand.getParameters(), {
                    xrayClient: clients.xrayClient,
                });
                node_assert_1.default.deepStrictEqual(cucumberResultsCommand.getValue(), cucumberResult);
                node_assert_1.default.deepStrictEqual(fallbackCypressUploadCommand.getParameters(), {
                    fallbackOn: [command_1.ComputableState.FAILED, command_1.ComputableState.SKIPPED],
                    fallbackValue: undefined,
                });
                node_assert_1.default.deepStrictEqual(convertCucumberFeaturesCommand.getParameters(), {
                    cucumber: {
                        prefixes: {
                            precondition: undefined,
                            test: undefined,
                        },
                    },
                    jira: {
                        projectKey: "CYP",
                    },
                    projectRoot: ".",
                    useCloudTags: false,
                    xray: {
                        status: {
                            failed: undefined,
                            passed: undefined,
                            pending: undefined,
                            skipped: undefined,
                            step: {
                                failed: undefined,
                                passed: undefined,
                                pending: undefined,
                                skipped: undefined,
                            },
                        },
                        testEnvironments: undefined,
                        uploadScreenshots: true,
                    },
                });
                node_assert_1.default.deepStrictEqual(importCucumberExecutionCommand.getParameters(), {
                    xrayClient: clients.xrayClient,
                });
                node_assert_1.default.deepStrictEqual(fallbackCucumberUploadCommand.getParameters(), {
                    fallbackOn: [command_1.ComputableState.FAILED, command_1.ComputableState.SKIPPED],
                    fallbackValue: undefined,
                });
                node_assert_1.default.deepStrictEqual(verifyResultsUploadCommand.getParameters(), {
                    url: "http://localhost:1234",
                });
                // Edges.
                // Cypress.
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(cypressResultsCommand)], [convertCypressTestsCommand, convertInfoServerCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(convertCypressTestsCommand)], [combineCypressJsonCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(issueSummaryCommand)], [convertInfoServerCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(issuetypeCommand)], [convertInfoServerCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(convertInfoServerCommand)], [combineCypressJsonCommand, combineCucumberMultipartCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(combineCypressJsonCommand)], [assertCypressConversionValidCommand, importExecutionCypressCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(assertCypressConversionValidCommand)], [importExecutionCypressCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(importExecutionCypressCommand)], [convertCucumberFeaturesCommand, fallbackCypressUploadCommand]);
                // Cucumber.
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(cucumberResultsCommand)], [convertCucumberFeaturesCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(fallbackCypressUploadCommand)], [verifyResultsUploadCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(convertCucumberFeaturesCommand)], [combineCucumberMultipartCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(combineCucumberMultipartCommand)], [assertCucumberConversionValidCommand, importCucumberExecutionCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(assertCucumberConversionValidCommand)], [importCucumberExecutionCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(importCucumberExecutionCommand)], [fallbackCucumberUploadCommand]);
                node_assert_1.default.deepStrictEqual([...graph.getSuccessors(fallbackCucumberUploadCommand)], [verifyResultsUploadCommand]);
                node_assert_1.default.strictEqual(graph.size("vertices"), 16);
                node_assert_1.default.strictEqual(graph.size("edges"), 20);
            });
        });
    });
});
