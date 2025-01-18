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
const dedent_1 = require("../../../../util/dedent");
const logging_1 = require("../../../../util/logging");
const constant_command_1 = require("../constant-command");
const edit_issue_field_command_1 = require("./edit-issue-field-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(edit_issue_field_command_1.EditIssueFieldCommand.name, async () => {
        await (0, node_test_1.it)("edits issues", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "editIssue", context.mock.fn((issueIdOrKey, issueUpdateData) => {
                if (issueIdOrKey === "CYP-123" &&
                    issueUpdateData.fields &&
                    issueUpdateData.fields.customfield_12345 === "hello") {
                    return Promise.resolve("CYP-123");
                }
                if (issueIdOrKey === "CYP-456" &&
                    issueUpdateData.fields &&
                    issueUpdateData.fields.customfield_12345 === "there") {
                    return Promise.resolve("CYP-456");
                }
                throw new Error("Mock called unexpectedly");
            }));
            const command = new edit_issue_field_command_1.EditIssueFieldCommand({
                fieldId: "summary",
                jiraClient: jiraClient,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, "customfield_12345"), new constant_command_1.ConstantCommand(logging_1.LOG, {
                ["CYP-123"]: "hello",
                ["CYP-456"]: "there",
            }));
            node_assert_1.default.deepStrictEqual(await command.compute(), ["CYP-123", "CYP-456"]);
            node_assert_1.default.strictEqual(message.mock.callCount(), 0);
        });
        await (0, node_test_1.it)("logs errors for unsuccessful edits", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "editIssue", context.mock.fn((issueIdOrKey, issueUpdateData) => {
                if (issueIdOrKey === "CYP-123" &&
                    issueUpdateData.fields &&
                    issueUpdateData.fields.customfield_12345[0] === "dev" &&
                    issueUpdateData.fields.customfield_12345[1] === "test") {
                    return Promise.resolve("CYP-123");
                }
                if (issueIdOrKey === "CYP-123" &&
                    issueUpdateData.fields &&
                    issueUpdateData.fields.customfield_12345[0] === "test") {
                    new Error("No editing allowed");
                }
                throw new Error("Mock called unexpectedly");
            }));
            const command = new edit_issue_field_command_1.EditIssueFieldCommand({
                fieldId: "labels",
                jiraClient: jiraClient,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, "customfield_12345"), new constant_command_1.ConstantCommand(logging_1.LOG, {
                ["CYP-123"]: ["dev", "test"],
                ["CYP-456"]: ["test"],
            }));
            node_assert_1.default.deepStrictEqual(await command.compute(), ["CYP-123"]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    CYP-456

                      Failed to set labels field to value: ["test"]
                `),
            ]);
        });
        await (0, node_test_1.it)("returns empty arrays", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "addAttachment", context.mock.fn((issueIdOrKey, ...files) => {
                if (issueIdOrKey === "CYP-123" &&
                    files[0] === "image.jpg" &&
                    files[1] === "something.mp4") {
                    return Promise.resolve([
                        { filename: "image.jpg", size: 12345 },
                        { filename: "something.mp4", size: 54321 },
                    ]);
                }
                throw new Error("Mock called unexpectedly");
            }));
            const command = new edit_issue_field_command_1.EditIssueFieldCommand({
                fieldId: "labels",
                jiraClient: jiraClient,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, "customfield_12345"), new constant_command_1.ConstantCommand(logging_1.LOG, {}));
            node_assert_1.default.deepStrictEqual(await command.compute(), []);
            node_assert_1.default.strictEqual(message.mock.callCount(), 0);
        });
    });
});
