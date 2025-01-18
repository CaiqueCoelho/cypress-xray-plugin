"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExecutionCypressCommand = void 0;
const command_1 = require("../../../command");
class ImportExecutionCypressCommand extends command_1.Command {
    constructor(parameters, logger, execution) {
        super(parameters, logger);
        this.execution = execution;
    }
    async computeResult() {
        const [results, info] = await this.execution.compute();
        return await this.parameters.xrayClient.importExecutionMultipart(results, info);
    }
}
exports.ImportExecutionCypressCommand = ImportExecutionCypressCommand;
