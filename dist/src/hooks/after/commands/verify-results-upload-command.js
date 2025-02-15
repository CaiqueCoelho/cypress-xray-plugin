"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyResultsUploadCommand = void 0;
const dedent_1 = require("../../../util/dedent");
const errors_1 = require("../../../util/errors");
const logging_1 = require("../../../util/logging");
const command_1 = require("../../command");
class VerifyResultsUploadCommand extends command_1.Command {
    constructor(parameters, logger, inputs) {
        super(parameters, logger);
        this.resolvedCypressExecutionIssueKey = inputs === null || inputs === void 0 ? void 0 : inputs.cypressExecutionIssueKey;
        this.resolvedCucumberExecutionIssueKey = inputs === null || inputs === void 0 ? void 0 : inputs.cucumberExecutionIssueKey;
    }
    async computeResult() {
        var _a, _b;
        const cypressExecutionIssueKey = await ((_a = this.resolvedCypressExecutionIssueKey) === null || _a === void 0 ? void 0 : _a.compute());
        const cucumberExecutionIssueKey = await ((_b = this.resolvedCucumberExecutionIssueKey) === null || _b === void 0 ? void 0 : _b.compute());
        if (cypressExecutionIssueKey && cucumberExecutionIssueKey) {
            if (cypressExecutionIssueKey !== cucumberExecutionIssueKey) {
                throw new errors_1.SkippedError((0, dedent_1.dedent)(`
                        Cucumber execution results were imported to a different test execution issue than the Cypress execution results:

                          Cypress  test execution issue: ${cypressExecutionIssueKey} ${this.parameters.url}/browse/${cypressExecutionIssueKey}
                          Cucumber test execution issue: ${cucumberExecutionIssueKey} ${this.parameters.url}/browse/${cucumberExecutionIssueKey}

                        Make sure your Jira configuration does not prevent modifications of existing test executions.
                    `));
            }
            else {
                this.logger.message(logging_1.Level.SUCCESS, `Uploaded test results to issue: ${cypressExecutionIssueKey} (${this.parameters.url}/browse/${cypressExecutionIssueKey})`);
                return cypressExecutionIssueKey;
            }
        }
        else if (cypressExecutionIssueKey) {
            this.logger.message(logging_1.Level.SUCCESS, `Uploaded Cypress test results to issue: ${cypressExecutionIssueKey} (${this.parameters.url}/browse/${cypressExecutionIssueKey})`);
            return cypressExecutionIssueKey;
        }
        else if (cucumberExecutionIssueKey) {
            this.logger.message(logging_1.Level.SUCCESS, `Uploaded Cucumber test results to issue: ${cucumberExecutionIssueKey} (${this.parameters.url}/browse/${cucumberExecutionIssueKey})`);
            return cucumberExecutionIssueKey;
        }
        throw new errors_1.SkippedError("No test results were uploaded");
    }
}
exports.VerifyResultsUploadCommand = VerifyResultsUploadCommand;
