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
const attach_files_command_1 = require("./attach-files-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(attach_files_command_1.AttachFilesCommand.name, async () => {
        await (0, node_test_1.it)("attaches files", async (context) => {
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
            const command = new attach_files_command_1.AttachFilesCommand({ jiraClient: jiraClient }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["image.jpg", "something.mp4"]), new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-123"));
            node_assert_1.default.deepStrictEqual(await command.compute(), [
                { filename: "image.jpg", size: 12345 },
                { filename: "something.mp4", size: 54321 },
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Attaching files to test execution issue CYP-123",
            ]);
        });
        await (0, node_test_1.it)("does not throw without files to attach", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            const addAttachment = context.mock.method(jiraClient, "addAttachment");
            const command = new attach_files_command_1.AttachFilesCommand({ jiraClient: jiraClient }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, []), new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-123"));
            node_assert_1.default.deepStrictEqual(await command.compute(), []);
            node_assert_1.default.strictEqual(addAttachment.mock.callCount(), 0);
        });
    });
});
