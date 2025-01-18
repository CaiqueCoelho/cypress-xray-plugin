"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportFeatureCommand = void 0;
const dedent_1 = require("../../../../util/dedent");
const logging_1 = require("../../../../util/logging");
const command_1 = require("../../../command");
class ImportFeatureCommand extends command_1.Command {
    async computeResult() {
        this.logger.message(logging_1.Level.INFO, `Importing feature file to Xray: ${this.parameters.filePath}`);
        const importResponse = await this.parameters.xrayClient.importFeature(this.parameters.filePath, {
            projectId: this.parameters.projectId,
            projectKey: this.parameters.projectKey,
            source: this.parameters.source,
        });
        if (importResponse.errors.length > 0) {
            this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                    ${this.parameters.filePath}

                      Encountered errors during feature file import:
                      ${importResponse.errors.map((error) => `- ${error}`).join("\n")}
                `));
        }
        return importResponse;
    }
}
exports.ImportFeatureCommand = ImportFeatureCommand;
