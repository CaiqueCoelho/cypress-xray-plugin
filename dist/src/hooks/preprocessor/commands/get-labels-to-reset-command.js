"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLabelsToResetCommand = void 0;
const dedent_1 = require("../../../util/dedent");
const logging_1 = require("../../../util/logging");
const string_1 = require("../../../util/string");
const command_1 = require("../../command");
class GetLabelsToResetCommand extends command_1.Command {
    constructor(logger, oldValues, newValues) {
        super(null, logger);
        this.oldValues = oldValues;
        this.newValues = newValues;
    }
    async computeResult() {
        const oldValues = await this.oldValues.compute();
        const newValues = await this.newValues.compute();
        const toReset = {};
        for (const [issueKey, newLabels] of Object.entries(newValues)) {
            if (!(issueKey in oldValues)) {
                this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                        ${issueKey}

                          The plugin tried to reset the issue's labels after importing the feature file, but could not because the previous labels could not be retrieved.

                          Make sure to manually restore them if needed.
                    `));
                continue;
            }
            const oldLabels = oldValues[issueKey];
            if (oldLabels.length === newLabels.length &&
                newLabels.every((label) => oldLabels.includes(label))) {
                this.logger.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                        ${issueKey}

                          Skipping resetting labels, the current labels are identical to the previous ones:

                            Previous labels: ${(0, string_1.unknownToString)(oldLabels)}
                            Current  labels: ${(0, string_1.unknownToString)(newLabels)}
                    `));
                continue;
            }
            toReset[issueKey] = oldLabels;
        }
        return toReset;
    }
}
exports.GetLabelsToResetCommand = GetLabelsToResetCommand;
