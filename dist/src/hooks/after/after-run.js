"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const functions_1 = require("../../util/functions");
const logging_1 = require("../../util/logging");
const command_1 = require("../command");
const destructure_command_1 = require("../util/commands/destructure-command");
const fallback_command_1 = require("../util/commands/fallback-command");
const attach_files_command_1 = require("../util/commands/jira/attach-files-command");
const extract_field_id_command_1 = require("../util/commands/jira/extract-field-id-command");
const get_summary_values_command_1 = require("../util/commands/jira/get-summary-values-command");
const transition_issue_command_1 = require("../util/commands/jira/transition-issue-command");
const import_execution_cucumber_command_1 = require("../util/commands/xray/import-execution-cucumber-command");
const import_execution_cypress_command_1 = require("../util/commands/xray/import-execution-cypress-command");
const import_feature_command_1 = require("../util/commands/xray/import-feature-command");
const util_1 = require("../util/util");
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
const util_2 = require("./util");
async function addUploadCommands(results, projectRoot, options, clients, evidenceCollection, graph, logger) {
    var _a, _b, _c, _d, _e, _f;
    const containsCypressTests = (0, util_2.containsCypressTest)(results, (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension);
    const containsCucumberTests = (0, util_2.containsCucumberTest)(results, (_b = options.cucumber) === null || _b === void 0 ? void 0 : _b.featureFileExtension);
    if (!containsCypressTests && !containsCucumberTests) {
        logger.message(logging_1.Level.WARNING, "No test execution results to upload, skipping results upload preparations.");
        return;
    }
    // We need to cast here because:
    // - jira.testExecutionIssue is typed to always use the installed Cypress results type
    // - the plugin internally works with the intersection of result types of all Cypress versions
    // But there's basically no way for the results to not be the installed Cypress results type, so
    // it should not be a problem.
    const issueData = await (0, functions_1.getOrCall)(options.jira.testExecutionIssue, {
        results: results,
    });
    const testPlanIssueKey = await (0, functions_1.getOrCall)(options.jira.testPlanIssueKey, {
        results: results,
    });
    const builder = new AfterRunBuilder({
        clients: clients,
        evidenceCollection: evidenceCollection,
        graph: graph,
        issueData: issueData,
        logger: logger,
        options: options,
        results: results,
    });
    let importCypressExecutionCommand;
    let importCucumberExecutionCommand;
    if (containsCypressTests) {
        importCypressExecutionCommand = getImportExecutionCypressCommand(graph, clients, builder, {
            reusesExecutionIssue: (issueData === null || issueData === void 0 ? void 0 : issueData.key) !== undefined || options.jira.testExecutionIssueKey !== undefined,
            testEnvironments: options.xray.testEnvironments,
            testPlanIssueKey: testPlanIssueKey,
        });
    }
    if (containsCucumberTests) {
        importCucumberExecutionCommand = getImportExecutionCucumberCommand(graph, clients, builder, {
            cucumberReportPath: (_d = (_c = options.cucumber) === null || _c === void 0 ? void 0 : _c.preprocessor) === null || _d === void 0 ? void 0 : _d.json.output,
            projectRoot: projectRoot,
            reusesExecutionIssue: (issueData === null || issueData === void 0 ? void 0 : issueData.key) !== undefined ||
                options.jira.testExecutionIssueKey !== undefined,
            testEnvironments: options.xray.testEnvironments,
            testExecutionIssueKeyCommand: importCypressExecutionCommand,
            testPlanIssueKey: testPlanIssueKey,
        });
        // Make sure to add an edge from any feature file imports to the execution. Otherwise, the
        // execution will contain old steps (those which were there prior to feature import).
        if ((_e = options.cucumber) === null || _e === void 0 ? void 0 : _e.uploadFeatures) {
            for (const importFeatureCommand of graph.getVertices()) {
                if (importFeatureCommand instanceof import_feature_command_1.ImportFeatureCommand) {
                    const filePath = path_1.default.relative(projectRoot, importFeatureCommand.getParameters().filePath);
                    if (results.runs.some((run) => {
                        const specPath = path_1.default.relative(projectRoot, run.spec.relative);
                        return specPath === filePath;
                    })) {
                        // We can still upload results even if the feature file import fails. It's
                        // better to upload mismatched results than none at all.
                        graph.connect(importFeatureCommand, importCucumberExecutionCommand, true);
                    }
                }
            }
        }
    }
    let fallbackCypressUploadCommand;
    let fallbackCucumberUploadCommand;
    if (importCypressExecutionCommand) {
        fallbackCypressUploadCommand = builder.addFallbackCommand({
            fallbackOn: [command_1.ComputableState.FAILED, command_1.ComputableState.SKIPPED],
            fallbackValue: undefined,
            input: importCypressExecutionCommand,
        });
    }
    if (importCucumberExecutionCommand) {
        fallbackCucumberUploadCommand = builder.addFallbackCommand({
            fallbackOn: [command_1.ComputableState.FAILED, command_1.ComputableState.SKIPPED],
            fallbackValue: undefined,
            input: importCucumberExecutionCommand,
        });
    }
    const finalExecutionIssueKey = builder.addVerifyResultUploadCommand({
        cucumberExecutionIssueKey: fallbackCucumberUploadCommand,
        cypressExecutionIssueKey: fallbackCypressUploadCommand,
    });
    if (options.jira.attachVideos) {
        builder.addAttachVideosCommand({ resolvedExecutionIssueKey: finalExecutionIssueKey });
    }
    // Workaround for: https://jira.atlassian.com/browse/JRASERVER-66881.
    if ((issueData === null || issueData === void 0 ? void 0 : issueData.transition) &&
        !((_f = issueData.key) !== null && _f !== void 0 ? _f : options.jira.testExecutionIssueKey) &&
        clients.kind === "server") {
        builder.addTransitionIssueCommand({
            issueKey: finalExecutionIssueKey,
            transition: issueData.transition,
        });
    }
}
function getImportExecutionCypressCommand(graph, clients, builder, options) {
    const convertCypressTestsCommand = builder.addConvertCypressTestsCommand();
    const convertMultipartInfoCommand = addConvertMultipartInfoCommand(graph, clients, builder, {
        testEnvironments: options.testEnvironments,
        testPlanIssueKey: options.testPlanIssueKey,
    });
    const combineResultsJsonCommand = builder.addCombineCypressJsonCommand({
        convertCypressTestsCommand: convertCypressTestsCommand,
        convertMultipartInfoCommand: convertMultipartInfoCommand,
    });
    const assertConversionValidCommand = builder.addAssertCypressConversionValidCommand({
        xrayTestExecutionResults: combineResultsJsonCommand,
    });
    const importCypressExecutionCommand = builder.addImportExecutionCypressCommand({
        execution: combineResultsJsonCommand,
    });
    graph.connect(assertConversionValidCommand, importCypressExecutionCommand);
    if (options.reusesExecutionIssue) {
        builder.addVerifyExecutionIssueKeyCommand({
            importType: "cypress",
            resolvedExecutionIssue: importCypressExecutionCommand,
        });
    }
    return importCypressExecutionCommand;
}
function getImportExecutionCucumberCommand(graph, clients, builder, options) {
    if (!options.cucumberReportPath) {
        throw new Error("Failed to prepare Cucumber upload: Cucumber preprocessor JSON report path not configured.");
    }
    const convertMultipartInfoCommand = addConvertMultipartInfoCommand(graph, clients, builder, {
        testEnvironments: options.testEnvironments,
        testPlanIssueKey: options.testPlanIssueKey,
    });
    const cucumberResultsCommand = builder.getCucumberResultsCommand({
        cucumberReportPath: options.cucumberReportPath,
        projectRoot: options.projectRoot,
    });
    const convertCucumberFeaturesCommand = builder.addConvertCucumberFeaturesCommand({
        cucumberResults: cucumberResultsCommand,
        projectRoot: options.projectRoot,
        testExecutionIssueKeyCommand: options.testExecutionIssueKeyCommand,
    });
    const combineCucumberMultipartCommand = builder.addCombineCucumberMultipartCommand({
        cucumberMultipartFeatures: convertCucumberFeaturesCommand,
        cucumberMultipartInfo: convertMultipartInfoCommand,
    });
    const assertConversionValidCommand = builder.addAssertCucumberConversionValidCommand({
        cucumberMultipart: combineCucumberMultipartCommand,
    });
    const importCucumberExecutionCommand = builder.addImportExecutionCucumberCommand({
        cucumberMultipart: combineCucumberMultipartCommand,
    });
    graph.connect(assertConversionValidCommand, importCucumberExecutionCommand);
    if (options.reusesExecutionIssue) {
        builder.addVerifyExecutionIssueKeyCommand({
            importType: "cucumber",
            resolvedExecutionIssue: importCucumberExecutionCommand,
        });
    }
    return importCucumberExecutionCommand;
}
function addConvertMultipartInfoCommand(graph, clients, builder, options) {
    let convertCommand;
    if (clients.kind === "cloud") {
        convertCommand = graph.find((command) => command instanceof convert_info_command_1.ConvertInfoCloudCommand);
    }
    else {
        convertCommand = graph.find((command) => command instanceof convert_info_command_1.ConvertInfoServerCommand);
    }
    if (convertCommand) {
        return convertCommand;
    }
    if (clients.kind === "cloud") {
        convertCommand = builder.addConvertInfoCloudCommand({
            testPlanIssueKey: options.testPlanIssueKey,
        });
    }
    else {
        let testPlanIdCommand = undefined;
        let testEnvironmentsIdCommand = undefined;
        if (options.testPlanIssueKey) {
            testPlanIdCommand = builder.addExtractFieldIdCommand("test-plan");
        }
        if (options.testEnvironments) {
            testEnvironmentsIdCommand = builder.addExtractFieldIdCommand("test-environments");
        }
        convertCommand = builder.addConvertInfoServerCommand({
            fieldIds: {
                testEnvironment: testEnvironmentsIdCommand,
                testPlan: testPlanIdCommand,
            },
            testPlanIssueKey: options.testPlanIssueKey,
        });
    }
    return convertCommand;
}
class AfterRunBuilder {
    constructor(args) {
        this.graph = args.graph;
        this.results = args.results;
        this.options = args.options;
        this.issueData = args.issueData;
        this.evidenceCollection = args.evidenceCollection;
        this.clients = args.clients;
        this.logger = args.logger;
        this.constants = {};
    }
    getCucumberResultsCommand(parameters) {
        // Cypress might change process.cwd(), so we need to query the root directory.
        // See: https://github.com/cypress-io/cypress/issues/22689
        const reportPath = path_1.default.resolve(parameters.projectRoot, parameters.cucumberReportPath);
        const cucumberResults = JSON.parse(fs_1.default.readFileSync(reportPath, "utf-8"));
        return (0, util_1.getOrCreateConstantCommand)(this.graph, this.logger, cucumberResults);
    }
    addConvertCypressTestsCommand() {
        var _a;
        const resultsCommand = this.getResultsCommand();
        const command = this.graph.place(new convert_cypress_tests_command_1.ConvertCypressTestsCommand({
            evidenceCollection: this.evidenceCollection,
            featureFileExtension: (_a = this.options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension,
            normalizeScreenshotNames: this.options.plugin.normalizeScreenshotNames,
            projectKey: this.options.jira.projectKey,
            uploadScreenshots: this.options.xray.uploadScreenshots,
            useCloudStatusFallback: this.clients.kind === "cloud",
            xrayStatus: this.options.xray.status,
        }, this.logger, resultsCommand));
        this.graph.connect(resultsCommand, command);
        return command;
    }
    addCombineCypressJsonCommand(parameters) {
        var _a, _b;
        const command = this.graph.place(new combine_cypress_xray_command_1.CombineCypressJsonCommand({
            testExecutionIssueKey: (_b = (_a = this.issueData) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : this.options.jira.testExecutionIssueKey,
        }, this.logger, parameters.convertCypressTestsCommand, parameters.convertMultipartInfoCommand));
        this.graph.connect(parameters.convertCypressTestsCommand, command);
        this.graph.connect(parameters.convertMultipartInfoCommand, command);
        return command;
    }
    addAssertCypressConversionValidCommand(parameters) {
        const command = this.graph.place(new assert_cypress_conversion_valid_command_1.AssertCypressConversionValidCommand(this.logger, parameters.xrayTestExecutionResults));
        this.graph.connect(parameters.xrayTestExecutionResults, command);
        return command;
    }
    addImportExecutionCypressCommand(parameters) {
        const command = this.graph.place(new import_execution_cypress_command_1.ImportExecutionCypressCommand({ xrayClient: this.clients.xrayClient }, this.logger, parameters.execution));
        this.graph.connect(parameters.execution, command);
        return command;
    }
    addExtractFieldIdCommand(field) {
        switch (field) {
            case "test-plan":
                return this.options.jira.fields.testPlan
                    ? (0, util_1.getOrCreateConstantCommand)(this.graph, this.logger, this.options.jira.fields.testPlan)
                    : (0, util_1.getOrCreateExtractFieldIdCommand)(extract_field_id_command_1.JiraField.TEST_PLAN, this.clients.jiraClient, this.graph, this.logger);
            case "test-environments":
                return this.options.jira.fields.testEnvironments
                    ? (0, util_1.getOrCreateConstantCommand)(this.graph, this.logger, this.options.jira.fields.testEnvironments)
                    : (0, util_1.getOrCreateExtractFieldIdCommand)(extract_field_id_command_1.JiraField.TEST_ENVIRONMENTS, this.clients.jiraClient, this.graph, this.logger);
        }
    }
    addConvertInfoCloudCommand(parameters) {
        const resultsCommand = this.getResultsCommand();
        const issueData = this.getIssueData();
        const command = new convert_info_command_1.ConvertInfoCloudCommand({
            jira: {
                projectKey: this.options.jira.projectKey,
                testPlanIssueKey: parameters.testPlanIssueKey,
            },
            xray: this.options.xray,
        }, this.logger, {
            issuetype: issueData.issuetype,
            issueUpdate: issueData.issueUpdate,
            results: resultsCommand,
            summary: issueData.summary,
        });
        this.graph.place(command);
        this.graph.connect(resultsCommand, command);
        this.graph.connect(issueData.summary, command);
        this.graph.connect(issueData.issuetype, command);
        if (issueData.issueUpdate) {
            this.graph.connect(issueData.issueUpdate, command);
        }
        return command;
    }
    addConvertInfoServerCommand(parameters) {
        const resultsCommand = this.getResultsCommand();
        const issueData = this.getIssueData();
        const command = new convert_info_command_1.ConvertInfoServerCommand({
            jira: {
                projectKey: this.options.jira.projectKey,
                testPlanIssueKey: parameters.testPlanIssueKey,
            },
            xray: this.options.xray,
        }, this.logger, {
            fieldIds: {
                testEnvironmentsId: parameters.fieldIds.testEnvironment,
                testPlanId: parameters.fieldIds.testPlan,
            },
            issuetype: issueData.issuetype,
            issueUpdate: issueData.issueUpdate,
            results: resultsCommand,
            summary: issueData.summary,
        });
        this.graph.place(command);
        this.graph.connect(resultsCommand, command);
        this.graph.connect(issueData.summary, command);
        this.graph.connect(issueData.issuetype, command);
        if (issueData.issueUpdate) {
            this.graph.connect(issueData.issueUpdate, command);
        }
        if (parameters.fieldIds.testEnvironment) {
            this.graph.connect(parameters.fieldIds.testEnvironment, command);
        }
        if (parameters.fieldIds.testPlan) {
            this.graph.connect(parameters.fieldIds.testPlan, command);
        }
        return command;
    }
    addConvertCucumberFeaturesCommand(parameters) {
        var _a, _b, _c, _d;
        let resolvedExecutionIssueKeyCommand;
        if (parameters.testExecutionIssueKeyCommand) {
            resolvedExecutionIssueKeyCommand = parameters.testExecutionIssueKeyCommand;
        }
        else {
            const executionIssueKey = (_b = (_a = this.issueData) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : this.options.jira.testExecutionIssueKey;
            if (executionIssueKey) {
                resolvedExecutionIssueKeyCommand = (0, util_1.getOrCreateConstantCommand)(this.graph, this.logger, executionIssueKey);
            }
        }
        const command = this.graph.place(new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
            cucumber: {
                prefixes: {
                    precondition: (_c = this.options.cucumber) === null || _c === void 0 ? void 0 : _c.prefixes.precondition,
                    test: (_d = this.options.cucumber) === null || _d === void 0 ? void 0 : _d.prefixes.test,
                },
            },
            jira: {
                projectKey: this.options.jira.projectKey,
            },
            projectRoot: parameters.projectRoot,
            useCloudTags: this.clients.kind === "cloud",
            xray: {
                status: this.options.xray.status,
                testEnvironments: this.options.xray.testEnvironments,
                uploadScreenshots: this.options.xray.uploadScreenshots,
            },
        }, this.logger, {
            cucumberResults: parameters.cucumberResults,
            testExecutionIssueKey: resolvedExecutionIssueKeyCommand,
        }));
        this.graph.connect(parameters.cucumberResults, command);
        if (resolvedExecutionIssueKeyCommand) {
            this.graph.connect(resolvedExecutionIssueKeyCommand, command);
        }
        return command;
    }
    addCombineCucumberMultipartCommand(parameters) {
        const command = this.graph.place(new combine_cucumber_multipart_command_1.CombineCucumberMultipartCommand(this.logger, parameters.cucumberMultipartInfo, parameters.cucumberMultipartFeatures));
        this.graph.connect(parameters.cucumberMultipartInfo, command);
        this.graph.connect(parameters.cucumberMultipartFeatures, command);
        return command;
    }
    addAssertCucumberConversionValidCommand(parameters) {
        const command = this.graph.place(new assert_cucumber_conversion_valid_command_1.AssertCucumberConversionValidCommand(this.logger, parameters.cucumberMultipart));
        this.graph.connect(parameters.cucumberMultipart, command);
        return command;
    }
    addVerifyExecutionIssueKeyCommand(parameters) {
        var _a, _b, _c, _d, _e;
        const command = this.graph.place(new verify_execution_issue_key_command_1.VerifyExecutionIssueKeyCommand({
            displayCloudHelp: this.clients.kind === "cloud",
            importType: parameters.importType,
            testExecutionIssueKey: (_b = (_a = this.issueData) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : this.options.jira.testExecutionIssueKey,
            testExecutionIssueType: (_e = (_d = (_c = this.issueData) === null || _c === void 0 ? void 0 : _c.fields) === null || _d === void 0 ? void 0 : _d.issuetype) !== null && _e !== void 0 ? _e : {
                name: this.options.jira.testExecutionIssueType,
            },
        }, this.logger, parameters.resolvedExecutionIssue));
        this.graph.connect(parameters.resolvedExecutionIssue, command);
        return command;
    }
    addImportExecutionCucumberCommand(parameters) {
        const command = this.graph.place(new import_execution_cucumber_command_1.ImportExecutionCucumberCommand({ xrayClient: this.clients.xrayClient }, this.logger, parameters.cucumberMultipart));
        this.graph.connect(parameters.cucumberMultipart, command);
        return command;
    }
    addFallbackCommand(parameters) {
        return this.graph.findOrDefault((fallback_command_1.FallbackCommand), () => {
            const command = this.graph.place(new fallback_command_1.FallbackCommand({
                fallbackOn: parameters.fallbackOn,
                fallbackValue: parameters.fallbackValue,
            }, this.logger, parameters.input));
            this.graph.connect(parameters.input, command, true);
            return command;
        }, (command) => {
            const predecessors = [...this.graph.getPredecessors(command)];
            return predecessors.length === 1 && predecessors[0] === parameters.input;
        });
    }
    addVerifyResultUploadCommand(parameters) {
        const command = this.graph.place(new verify_results_upload_command_1.VerifyResultsUploadCommand({ url: this.options.jira.url }, this.logger, {
            cucumberExecutionIssueKey: parameters.cucumberExecutionIssueKey,
            cypressExecutionIssueKey: parameters.cypressExecutionIssueKey,
        }));
        if (parameters.cypressExecutionIssueKey) {
            this.graph.connect(parameters.cypressExecutionIssueKey, command);
        }
        if (parameters.cucumberExecutionIssueKey) {
            this.graph.connect(parameters.cucumberExecutionIssueKey, command);
        }
        return command;
    }
    addAttachVideosCommand(parameters) {
        const resultsCommand = this.getResultsCommand();
        const extractVideoFilesCommand = this.graph.place(new extract_video_files_command_1.ExtractVideoFilesCommand(this.logger, resultsCommand));
        this.graph.connect(resultsCommand, extractVideoFilesCommand);
        const command = this.graph.place(new attach_files_command_1.AttachFilesCommand({ jiraClient: this.clients.jiraClient }, this.logger, extractVideoFilesCommand, parameters.resolvedExecutionIssueKey));
        this.graph.connect(extractVideoFilesCommand, command);
        this.graph.connect(parameters.resolvedExecutionIssueKey, command);
        return command;
    }
    addTransitionIssueCommand(parameters) {
        const command = this.graph.place(new transition_issue_command_1.TransitionIssueCommand({
            jiraClient: this.clients.jiraClient,
            transition: parameters.transition,
        }, this.logger, parameters.issueKey));
        this.graph.connect(parameters.issueKey, command);
        return command;
    }
    getIssueData() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        let issueUpdateCommand;
        let summaryCommand = (_a = this.constants.executionIssue) === null || _a === void 0 ? void 0 : _a.summary;
        let issuetypeCommand = (_b = this.constants.executionIssue) === null || _b === void 0 ? void 0 : _b.issuetype;
        if (!((_c = this.constants.executionIssue) === null || _c === void 0 ? void 0 : _c.issueUpdate) && this.issueData) {
            issueUpdateCommand = (0, util_1.getOrCreateConstantCommand)(this.graph, this.logger, this.issueData);
            this.constants.executionIssue = {
                ...this.constants.executionIssue,
                issueUpdate: issueUpdateCommand,
            };
        }
        if (!summaryCommand) {
            const summary = (_f = (_e = (_d = this.issueData) === null || _d === void 0 ? void 0 : _d.fields) === null || _e === void 0 ? void 0 : _e.summary) !== null && _f !== void 0 ? _f : this.options.jira.testExecutionIssueSummary;
            if (summary) {
                summaryCommand = (0, util_1.getOrCreateConstantCommand)(this.graph, this.logger, summary);
            }
            else {
                const testExecutionIssueKey = (_h = (_g = this.issueData) === null || _g === void 0 ? void 0 : _g.key) !== null && _h !== void 0 ? _h : this.options.jira.testExecutionIssueKey;
                if (testExecutionIssueKey) {
                    const issueKeysCommand = (0, util_1.getOrCreateConstantCommand)(this.graph, this.logger, [
                        testExecutionIssueKey,
                    ]);
                    const getSummaryValuesCommand = this.graph.findOrDefault(get_summary_values_command_1.GetSummaryValuesCommand, () => {
                        const command = this.graph.place(new get_summary_values_command_1.GetSummaryValuesCommand({ jiraClient: this.clients.jiraClient }, this.logger, issueKeysCommand));
                        this.graph.connect(issueKeysCommand, command);
                        return command;
                    }, (vertex) => [...this.graph.getPredecessors(vertex)].includes(issueKeysCommand));
                    summaryCommand = this.graph.place(new destructure_command_1.DestructureCommand(this.logger, getSummaryValuesCommand, testExecutionIssueKey));
                    this.graph.connect(getSummaryValuesCommand, summaryCommand);
                }
                else {
                    summaryCommand = (0, util_1.getOrCreateConstantCommand)(this.graph, this.logger, `Execution Results [${this.results.startedTestsAt}]`);
                }
            }
            this.constants.executionIssue = {
                ...this.constants.executionIssue,
                summary: summaryCommand,
            };
        }
        if (!issuetypeCommand) {
            issuetypeCommand = (0, util_1.getOrCreateConstantCommand)(this.graph, this.logger, (_l = (_k = (_j = this.issueData) === null || _j === void 0 ? void 0 : _j.fields) === null || _k === void 0 ? void 0 : _k.issuetype) !== null && _l !== void 0 ? _l : {
                name: this.options.jira.testExecutionIssueType,
            });
            this.constants.executionIssue = {
                ...this.constants.executionIssue,
                issuetype: issuetypeCommand,
            };
        }
        return {
            issuetype: issuetypeCommand,
            issueUpdate: issueUpdateCommand,
            summary: summaryCommand,
        };
    }
    getResultsCommand() {
        if (!this.constants.results) {
            this.constants.results = (0, util_1.getOrCreateConstantCommand)(this.graph, this.logger, this.results);
        }
        return this.constants.results;
    }
}
/**
 * Workaround until module mocking becomes a stable feature. The current approach allows replacing
 * the function with a mocked one.
 *
 * @see https://nodejs.org/docs/latest-v23.x/api/test.html#mockmodulespecifier-options
 */
exports.default = { addUploadCommands };
