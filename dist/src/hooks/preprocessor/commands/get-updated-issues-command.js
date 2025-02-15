"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUpdatedIssuesCommand = void 0;
const dedent_1 = require("../../../util/dedent");
const help_1 = require("../../../util/help");
const logging_1 = require("../../../util/logging");
const set_1 = require("../../../util/set");
const command_1 = require("../../command");
class GetUpdatedIssuesCommand extends command_1.Command {
    constructor(parameters, logger, expectedAffectedIssues, importResponse) {
        super(parameters, logger);
        this.expectedAffectedIssues = expectedAffectedIssues;
        this.importResponse = importResponse;
    }
    async computeResult() {
        const expectedAffectedIssues = await this.expectedAffectedIssues.compute();
        const importResponse = await this.importResponse.compute();
        const setOverlap = (0, set_1.computeOverlap)(expectedAffectedIssues, importResponse.updatedOrCreatedIssues);
        if (setOverlap.leftOnly.length > 0 || setOverlap.rightOnly.length > 0) {
            const mismatchLinesFeatures = [];
            const mismatchLinesJira = [];
            if (setOverlap.leftOnly.length > 0) {
                mismatchLinesFeatures.push("Issues contained in feature file tags that have not been updated by Xray and may not exist:");
                mismatchLinesFeatures.push("");
                mismatchLinesFeatures.push(...setOverlap.leftOnly.map((issueKey) => `  ${issueKey}`));
            }
            if (setOverlap.rightOnly.length > 0) {
                mismatchLinesJira.push("Issues updated by Xray that do not exist in feature file tags and may have been created:");
                mismatchLinesJira.push("");
                mismatchLinesJira.push(...setOverlap.rightOnly.map((issueKey) => `  ${issueKey}`));
            }
            let mismatchLines;
            if (mismatchLinesFeatures.length > 0 && mismatchLinesJira.length > 0) {
                mismatchLines = (0, dedent_1.dedent)(`
                    ${mismatchLinesFeatures.join("\n")}

                    ${mismatchLinesJira.join("\n")}
                `);
            }
            else if (mismatchLinesFeatures.length > 0) {
                mismatchLines = mismatchLinesFeatures.join("\n");
            }
            else {
                mismatchLines = mismatchLinesJira.join("\n");
            }
            this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                    ${this.parameters.filePath}

                      Mismatch between feature file issue tags and updated Jira issues detected.

                        ${mismatchLines}

                      Make sure that:
                      - All issues present in feature file tags belong to existing issues.
                      - Your plugin tag prefix settings match those defined in Xray.

                      More information:
                      - ${help_1.HELP.plugin.guides.targetingExistingIssues}
                      - ${help_1.HELP.plugin.configuration.cucumber.prefixes}
                `));
        }
        return setOverlap.intersection;
    }
}
exports.GetUpdatedIssuesCommand = GetUpdatedIssuesCommand;
