"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreatedTestExecutionIssueKey = getCreatedTestExecutionIssueKey;
const node_assert_1 = __importDefault(require("node:assert"));
function getCreatedTestExecutionIssueKey(projectKey, output, uploadType) {
    var _a;
    let regex;
    switch (uploadType) {
        case "both":
            regex = new RegExp(`Uploaded test results to issue: (${projectKey}-\\d+)`);
            break;
        case "cucumber":
            regex = new RegExp(`Uploaded Cucumber test results to issue: (${projectKey}-\\d+)`);
            break;
        case "cypress":
            regex = new RegExp(`Uploaded Cypress test results to issue: (${projectKey}-\\d+)`);
            break;
    }
    const createdIssueLine = (_a = output.find((line) => regex.test(line))) === null || _a === void 0 ? void 0 : _a.match(regex);
    node_assert_1.default.ok(createdIssueLine);
    const testExecutionIssueKey = createdIssueLine[1];
    return testExecutionIssueKey;
}
