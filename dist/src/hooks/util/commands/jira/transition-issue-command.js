"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionIssueCommand = void 0;
const logging_1 = require("../../../../util/logging");
const command_1 = require("../../../command");
class TransitionIssueCommand extends command_1.Command {
    constructor(parameters, logger, resolvedExecutionIssueKey) {
        super(parameters, logger);
        this.resolvedExecutionIssueKey = resolvedExecutionIssueKey;
    }
    async computeResult() {
        const resolvedExecutionIssueKey = await this.resolvedExecutionIssueKey.compute();
        this.logger.message(logging_1.Level.INFO, `Transitioning test execution issue ${resolvedExecutionIssueKey}`);
        await this.parameters.jiraClient.transitionIssue(resolvedExecutionIssueKey, {
            transition: this.parameters.transition,
        });
    }
}
exports.TransitionIssueCommand = TransitionIssueCommand;
