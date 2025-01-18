"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSummariesToResetCommand = void 0;
const dedent_1 = require("../../../util/dedent");
const logging_1 = require("../../../util/logging");
const string_1 = require("../../../util/string");
const command_1 = require("../../command");
class GetSummariesToResetCommand extends command_1.Command {
    constructor(logger, oldValues, newValues) {
        super(null, logger);
        this.oldValues = oldValues;
        this.newValues = newValues;
    }
    async computeResult() {
        const oldValues = await this.oldValues.compute();
        const newValues = await this.newValues.compute();
        const toReset = {};
        for (const [issueKey, newSummary] of Object.entries(newValues)) {
            if (!(issueKey in oldValues)) {
                this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                        ${issueKey}

                          The plugin tried to reset the issue's summary after importing the feature file, but could not because the previous summary could not be retrieved.

                          Make sure to manually restore it if needed.
                    `));
                continue;
            }
            const oldSummary = oldValues[issueKey];
            if (oldSummary === newSummary) {
                this.logger.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                        ${issueKey}

                          Skipping resetting summary, the current summary is identical to the previous one:

                        Previous summary: ${(0, string_1.unknownToString)(oldSummary)}
                        Current  summary: ${(0, string_1.unknownToString)(newSummary)}
                    `));
                continue;
            }
            toReset[issueKey] = oldSummary;
        }
        return toReset;
    }
}
exports.GetSummariesToResetCommand = GetSummariesToResetCommand;
