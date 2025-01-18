"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditIssueFieldCommand = void 0;
const dedent_1 = require("../../../../util/dedent");
const logging_1 = require("../../../../util/logging");
const string_1 = require("../../../../util/string");
const command_1 = require("../../../command");
class EditIssueFieldCommand extends command_1.Command {
    constructor(parameters, logger, fieldId, fieldValues) {
        super(parameters, logger);
        this.fieldId = fieldId;
        this.fieldValues = fieldValues;
    }
    async computeResult() {
        const fieldValues = await this.fieldValues.compute();
        const fieldId = await this.fieldId.compute();
        const successfullyEditedIssues = [];
        for (const [issueKey, newValue] of Object.entries(fieldValues)) {
            const fields = { [fieldId]: newValue };
            try {
                successfullyEditedIssues.push(await this.parameters.jiraClient.editIssue(issueKey, { fields: fields }));
                // Error are logged in editIssue.
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }
            catch (error) {
                this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                        ${issueKey}

                          Failed to set ${(0, string_1.unknownToString)(this.parameters.fieldId)} field to value: ${(0, string_1.unknownToString)(newValue)}
                    `));
            }
        }
        return successfullyEditedIssues;
    }
}
exports.EditIssueFieldCommand = EditIssueFieldCommand;
