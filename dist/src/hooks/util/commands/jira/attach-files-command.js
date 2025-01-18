"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachFilesCommand = void 0;
const logging_1 = require("../../../../util/logging");
const command_1 = require("../../../command");
class AttachFilesCommand extends command_1.Command {
    constructor(parameters, logger, files, resolvedExecutionIssueKey) {
        super(parameters, logger);
        this.files = files;
        this.resolvedExecutionIssueKey = resolvedExecutionIssueKey;
    }
    async computeResult() {
        const resolvedExecutionIssueKey = await this.resolvedExecutionIssueKey.compute();
        const files = await this.files.compute();
        if (files.length === 0) {
            return [];
        }
        this.logger.message(logging_1.Level.INFO, `Attaching files to test execution issue ${resolvedExecutionIssueKey}`);
        return await this.parameters.jiraClient.addAttachment(resolvedExecutionIssueKey, ...files);
    }
}
exports.AttachFilesCommand = AttachFilesCommand;
