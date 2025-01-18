"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExecutionCucumberCommand = void 0;
const command_1 = require("../../../command");
class ImportExecutionCucumberCommand extends command_1.Command {
    constructor(parameters, logger, cucumberMultipart) {
        super(parameters, logger);
        this.cucumberMultipart = cucumberMultipart;
    }
    async computeResult() {
        const cucumberMultipart = await this.cucumberMultipart.compute();
        return await this.parameters.xrayClient.importExecutionCucumberMultipart(cucumberMultipart.features, cucumberMultipart.info);
    }
}
exports.ImportExecutionCucumberCommand = ImportExecutionCucumberCommand;
