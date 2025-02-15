"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFieldValuesCommand = void 0;
const dedent_1 = require("../../../../util/dedent");
const errors_1 = require("../../../../util/errors");
const logging_1 = require("../../../../util/logging");
const command_1 = require("../../../command");
class GetFieldValuesCommand extends command_1.Command {
    constructor(parameters, logger, fieldId, issueKeys) {
        super(parameters, logger);
        this.fieldId = fieldId;
        this.issueKeys = issueKeys;
    }
    async extractJiraFieldValues(extractor) {
        const fieldId = await this.fieldId.compute();
        const issueKeys = await this.issueKeys.compute();
        const issues = await this.parameters.jiraClient.search({
            fields: [fieldId],
            jql: `issue in (${issueKeys.join(",")})`,
        });
        const unknownIssues = issueKeys.filter((key) => issues.every((issue) => issue.key !== key));
        if (unknownIssues.length > 0) {
            unknownIssues.sort();
            this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                    Failed to find Jira issues:

                      ${unknownIssues.join("\n")}
                `));
        }
        const results = {};
        const issuesWithUnparseableField = [];
        for (const issue of issues) {
            if (!issue.key) {
                issuesWithUnparseableField.push(`Unknown: ${JSON.stringify(issue)}`);
            }
            else {
                try {
                    results[issue.key] = await extractor(issue, fieldId);
                }
                catch (error) {
                    issuesWithUnparseableField.push(`${issue.key}: ${(0, errors_1.errorMessage)(error)}`);
                }
            }
        }
        if (issuesWithUnparseableField.length > 0) {
            issuesWithUnparseableField.sort();
            this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                    Failed to parse Jira field with ID ${fieldId} in issues:

                      ${issuesWithUnparseableField.join("\n")}
                `));
        }
        return results;
    }
}
exports.GetFieldValuesCommand = GetFieldValuesCommand;
