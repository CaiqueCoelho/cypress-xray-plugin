"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertCucumberFeaturesCommand = void 0;
const path_1 = __importDefault(require("path"));
const dedent_1 = require("../../../../../util/dedent");
const errors_1 = require("../../../../../util/errors");
const logging_1 = require("../../../../../util/logging");
const command_1 = require("../../../../command");
const scenario_1 = require("../../../../preprocessor/commands/parsing/scenario");
const status_1 = require("../util/status");
class ConvertCucumberFeaturesCommand extends command_1.Command {
    constructor(parameters, logger, input) {
        super(parameters, logger);
        this.cucumberResults = input.cucumberResults;
        this.testExecutionIssueKey = input.testExecutionIssueKey;
    }
    async computeResult() {
        var _a;
        const input = await this.cucumberResults.compute();
        const testExecutionIssueKey = await ((_a = this.testExecutionIssueKey) === null || _a === void 0 ? void 0 : _a.compute());
        const tests = [];
        for (const result of input) {
            const test = {
                ...result,
            };
            if (testExecutionIssueKey) {
                const testExecutionIssueTag = {
                    name: `@${testExecutionIssueKey}`,
                };
                // Xray uses the first encountered issue tag for deducing the test execution issue.
                // Note: The tag is a feature tag, not a scenario tag!
                if (result.tags) {
                    test.tags = [testExecutionIssueTag, ...result.tags];
                }
                else {
                    test.tags = [testExecutionIssueTag];
                }
            }
            const elements = [];
            for (const element of result.elements) {
                const filepath = path_1.default.resolve(this.parameters.projectRoot, result.uri);
                try {
                    if (element.type === "scenario") {
                        this.assertScenarioContainsIssueKey(element);
                        const modifiedElement = {
                            ...element,
                            steps: this.getSteps(element),
                        };
                        elements.push(modifiedElement);
                    }
                }
                catch (error) {
                    const elementDescription = `${element.type[0].toUpperCase()}${element.type.substring(1)}: ${element.name.length > 0 ? element.name : "<no name>"}`;
                    this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                            ${filepath}

                              ${elementDescription}

                                Skipping result upload.

                                  Caused by: ${(0, errors_1.errorMessage)(error)}
                        `));
                }
            }
            if (elements.length > 0) {
                test.elements = elements;
                tests.push(test);
            }
        }
        return tests;
    }
    getSteps(element) {
        const steps = [];
        element.steps.forEach((step) => {
            steps.push({
                ...step,
                embeddings: this.parameters.xray.uploadScreenshots ? step.embeddings : [],
                result: {
                    ...step.result,
                    status: (0, status_1.getXrayStatus)(step.result.status, this.parameters.xray.status.step),
                },
            });
        });
        return steps;
    }
    assertScenarioContainsIssueKey(element) {
        const issueKeys = [];
        if (element.tags) {
            for (const tag of element.tags) {
                const matches = tag.name.match((0, scenario_1.getScenarioTagRegex)(this.parameters.jira.projectKey, this.parameters.cucumber.prefixes.test));
                if (!matches) {
                    continue;
                }
                // We know the regex: the match will contain the value in the first group.
                issueKeys.push(matches[1]);
            }
        }
        if (issueKeys.length === 0) {
            throw (0, errors_1.missingTestKeyInCucumberScenarioError)({
                keyword: element.keyword,
                name: element.name,
                steps: element.steps.map((step) => {
                    return { keyword: step.keyword, text: step.name };
                }),
                tags: element.tags,
            }, this.parameters.jira.projectKey, this.parameters.useCloudTags === true);
        }
    }
}
exports.ConvertCucumberFeaturesCommand = ConvertCucumberFeaturesCommand;
