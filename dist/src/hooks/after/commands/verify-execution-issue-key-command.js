"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyExecutionIssueKeyCommand = void 0;
const dedent_1 = require("../../../util/dedent");
const help_1 = require("../../../util/help");
const logging_1 = require("../../../util/logging");
const command_1 = require("../../command");
class VerifyExecutionIssueKeyCommand extends command_1.Command {
    constructor(parameters, logger, resolvedExecutionIssue) {
        super(parameters, logger);
        this.resolvedExecutionIssue = resolvedExecutionIssue;
    }
    async computeResult() {
        const resolvedExecutionIssueKey = await this.resolvedExecutionIssue.compute();
        if (this.parameters.testExecutionIssueKey &&
            resolvedExecutionIssueKey !== this.parameters.testExecutionIssueKey) {
            this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                    ${this.parameters.importType === "cypress" ? "Cypress" : "Cucumber"} execution results were imported to test execution ${resolvedExecutionIssueKey}, which is different from the configured one: ${this.parameters.testExecutionIssueKey}

                    Make sure issue ${this.parameters.testExecutionIssueKey} actually exists and is of type: ${JSON.stringify(this.parameters.testExecutionIssueType, null, 2)}

                    More information
                    - ${help_1.HELP.plugin.configuration.jira.testExecutionIssue.fields.issuetype}
                    - ${this.parameters.displayCloudHelp
                ? help_1.HELP.xray.issueTypeMapping.cloud
                : help_1.HELP.xray.issueTypeMapping.server}
                `));
        }
        return resolvedExecutionIssueKey;
    }
}
exports.VerifyExecutionIssueKeyCommand = VerifyExecutionIssueKeyCommand;
