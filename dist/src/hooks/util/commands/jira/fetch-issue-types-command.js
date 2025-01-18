"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchIssueTypesCommand = void 0;
const command_1 = require("../../../command");
class FetchIssueTypesCommand extends command_1.Command {
    async computeResult() {
        return await this.parameters.jiraClient.getIssueTypes();
    }
}
exports.FetchIssueTypesCommand = FetchIssueTypesCommand;
