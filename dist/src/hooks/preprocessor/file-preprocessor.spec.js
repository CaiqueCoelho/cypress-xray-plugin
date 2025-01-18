"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const util_1 = require("../../../test/util");
const credentials_1 = require("../../client/authentication/credentials");
const requests_1 = require("../../client/https/requests");
const jira_client_1 = require("../../client/jira/jira-client");
const xray_client_server_1 = require("../../client/xray/xray-client-server");
const context_1 = __importDefault(require("../../context"));
const executable_graph_1 = require("../../util/graph/executable-graph");
const logging_1 = require("../../util/logging");
const edit_issue_field_command_1 = require("../util/commands/jira/edit-issue-field-command");
const get_label_values_command_1 = require("../util/commands/jira/get-label-values-command");
const get_summary_values_command_1 = require("../util/commands/jira/get-summary-values-command");
const import_feature_command_1 = require("../util/commands/xray/import-feature-command");
const extract_feature_file_issues_command_1 = require("./commands/extract-feature-file-issues-command");
const extract_issue_keys_command_1 = require("./commands/extract-issue-keys-command");
const get_labels_to_reset_command_1 = require("./commands/get-labels-to-reset-command");
const get_summaries_to_reset_command_1 = require("./commands/get-summaries-to-reset-command");
const get_updated_issues_command_1 = require("./commands/get-updated-issues-command");
const parse_feature_file_command_1 = require("./commands/parse-feature-file-command");
const file_preprocessor_1 = __importDefault(require("./file-preprocessor"));
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
    await (0, node_test_1.describe)(file_preprocessor_1.default.addSynchronizationCommands.name, async () => {
        const file = {
            ...{},
            filePath: "./path/to/file.feature",
            outputPath: "no.idea",
            shouldWatch: false,
        };
        await (0, node_test_1.it)("adds all commands necessary for feature file upload", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const graph = new executable_graph_1.ExecutableGraph();
            file_preprocessor_1.default.addSynchronizationCommands(file, options, clients, graph, logging_1.LOG);
            const commands = [...graph.getVertices()];
            (0, util_1.assertIsInstanceOf)(commands[0], parse_feature_file_command_1.ParseFeatureFileCommand);
            node_assert_1.default.deepStrictEqual(commands[0].getParameters(), {
                filePath: "./path/to/file.feature",
            });
            (0, util_1.assertIsInstanceOf)(commands[1], extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand);
            node_assert_1.default.deepStrictEqual(commands[1].getParameters(), {
                displayCloudHelp: false,
                filePath: "./path/to/file.feature",
                prefixes: {
                    precondition: "Precondition:",
                    test: "TestName:",
                },
                projectKey: "CYP",
            });
            (0, util_1.assertIsInstanceOf)(commands[2], extract_issue_keys_command_1.ExtractIssueKeysCommand);
            (0, util_1.assertIsInstanceOf)(commands[3], get_summary_values_command_1.GetSummaryValuesCommand);
            (0, util_1.assertIsInstanceOf)(commands[4], get_label_values_command_1.GetLabelValuesCommand);
            (0, util_1.assertIsInstanceOf)(commands[5], import_feature_command_1.ImportFeatureCommand);
            node_assert_1.default.deepStrictEqual(commands[5].getParameters(), {
                filePath: "./path/to/file.feature",
                projectKey: "CYP",
                xrayClient: clients.xrayClient,
            });
            (0, util_1.assertIsInstanceOf)(commands[6], get_updated_issues_command_1.GetUpdatedIssuesCommand);
            (0, util_1.assertIsInstanceOf)(commands[7], get_summary_values_command_1.GetSummaryValuesCommand);
            (0, util_1.assertIsInstanceOf)(commands[8], get_label_values_command_1.GetLabelValuesCommand);
            (0, util_1.assertIsInstanceOf)(commands[9], get_summaries_to_reset_command_1.GetSummariesToResetCommand);
            (0, util_1.assertIsInstanceOf)(commands[10], get_labels_to_reset_command_1.GetLabelsToResetCommand);
            (0, util_1.assertIsInstanceOf)(commands[11], edit_issue_field_command_1.EditIssueFieldCommand);
            node_assert_1.default.deepStrictEqual(commands[11].getParameters(), {
                fieldId: "summary",
                jiraClient: clients.jiraClient,
            });
            (0, util_1.assertIsInstanceOf)(commands[12], edit_issue_field_command_1.EditIssueFieldCommand);
            node_assert_1.default.deepStrictEqual(commands[12].getParameters(), {
                fieldId: "labels",
                jiraClient: clients.jiraClient,
            });
            node_assert_1.default.strictEqual(graph.size("vertices"), 13);
        });
        await (0, node_test_1.it)("correctly connects all commands", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const graph = new executable_graph_1.ExecutableGraph();
            file_preprocessor_1.default.addSynchronizationCommands(file, options, clients, graph, logging_1.LOG);
            const [parseFeatureFileCommand, extractIssueDataCommand, extractIssueKeysCommand, getCurrentSummariesCommand, getCurrentLabelsCommand, importFeatureCommand, getUpdatedIssuesCommand, getNewSummariesCommand, getNewLabelsCommand, getSummariesToResetCommand, getLabelsToResetCommand, editSummariesCommand, editLabelsCommand,] = [...graph.getVertices()];
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(parseFeatureFileCommand)], []);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(extractIssueDataCommand)], [parseFeatureFileCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(extractIssueKeysCommand)], [extractIssueDataCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getCurrentSummariesCommand)], [extractIssueKeysCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getCurrentLabelsCommand)], [extractIssueKeysCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(importFeatureCommand)], [getCurrentSummariesCommand, getCurrentLabelsCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getUpdatedIssuesCommand)], [extractIssueKeysCommand, importFeatureCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getNewSummariesCommand)], [extractIssueKeysCommand, getUpdatedIssuesCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getNewLabelsCommand)], [extractIssueKeysCommand, getUpdatedIssuesCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getSummariesToResetCommand)], [getCurrentSummariesCommand, getNewSummariesCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getLabelsToResetCommand)], [getCurrentLabelsCommand, getNewLabelsCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(editSummariesCommand)], [getSummariesToResetCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(editLabelsCommand)], [getLabelsToResetCommand]);
            node_assert_1.default.strictEqual(graph.size("edges"), 18);
        });
        await (0, node_test_1.it)("reuses existing commands", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const graph = new executable_graph_1.ExecutableGraph();
            const parseFeatureFileCommand = graph.place(new parse_feature_file_command_1.ParseFeatureFileCommand({ filePath: "./path/to/file.feature" }, logging_1.LOG));
            file_preprocessor_1.default.addSynchronizationCommands(file, options, clients, graph, logging_1.LOG);
            const commands = [...graph.getVertices()];
            const extractIssueDataCommand = commands[1];
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(extractIssueDataCommand)], [parseFeatureFileCommand]);
        });
        await (0, node_test_1.it)("uses preconfigured jira field ids", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const graph = new executable_graph_1.ExecutableGraph();
            file_preprocessor_1.default.addSynchronizationCommands(file, options, clients, graph, logging_1.LOG);
            const commands = [...graph.getVertices()];
            const extractIssueKeysCommand = commands[2];
            const getCurrentSummariesCommand = commands[3];
            const getCurrentLabelsCommand = commands[4];
            const getUpdatedIssuesCommand = commands[6];
            const getNewSummariesCommand = commands[7];
            const getNewLabelsCommand = commands[8];
            (0, util_1.assertIsInstanceOf)(extractIssueKeysCommand, extract_issue_keys_command_1.ExtractIssueKeysCommand);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getCurrentSummariesCommand)], [extractIssueKeysCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getCurrentLabelsCommand)], [extractIssueKeysCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getNewSummariesCommand)], [extractIssueKeysCommand, getUpdatedIssuesCommand]);
            node_assert_1.default.deepStrictEqual([...graph.getPredecessors(getNewLabelsCommand)], [extractIssueKeysCommand, getUpdatedIssuesCommand]);
            node_assert_1.default.strictEqual(graph.size("vertices"), 13);
            node_assert_1.default.strictEqual(graph.size("edges"), 18);
        });
    });
});
