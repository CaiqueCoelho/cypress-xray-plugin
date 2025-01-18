"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const credentials_1 = require("../../../../client/authentication/credentials");
const requests_1 = require("../../../../client/https/requests");
const jira_client_1 = require("../../../../client/jira/jira-client");
const logging_1 = require("../../../../util/logging");
const constant_command_1 = require("../constant-command");
const transition_issue_command_1 = require("./transition-issue-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(transition_issue_command_1.TransitionIssueCommand.name, async () => {
        await (0, node_test_1.it)("transitions issues", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            const transitionIssue = context.mock.method(jiraClient, "transitionIssue", context.mock.fn());
            const command = new transition_issue_command_1.TransitionIssueCommand({ jiraClient: jiraClient, transition: { id: "5" } }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-123"));
            await command.compute();
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Transitioning test execution issue CYP-123",
            ]);
            node_assert_1.default.deepStrictEqual(transitionIssue.mock.calls[0].arguments, [
                "CYP-123",
                {
                    transition: {
                        id: "5",
                    },
                },
            ]);
        });
    });
});
