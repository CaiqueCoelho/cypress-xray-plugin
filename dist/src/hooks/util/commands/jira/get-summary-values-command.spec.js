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
const get_summary_values_command_1 = require("./get-summary-values-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(get_summary_values_command_1.GetSummaryValuesCommand.name, async () => {
        await (0, node_test_1.it)("fetches summaries", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "search", context.mock.fn(async (request) => {
                if (request.fields &&
                    request.fields[0] === "summary" &&
                    request.jql === "issue in (CYP-123,CYP-456,CYP-789)") {
                    return await Promise.resolve([
                        { fields: { ["summary"]: "Hello" }, key: "CYP-123" },
                        { fields: { ["summary"]: "Good Morning" }, key: "CYP-456" },
                        { fields: { ["summary"]: "Goodbye" }, key: "CYP-789" },
                    ]);
                }
                throw new Error("Mock called unexpectedly");
            }));
            const command = new get_summary_values_command_1.GetSummaryValuesCommand({ jiraClient: jiraClient }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-456", "CYP-789"]));
            const summaries = await command.compute();
            node_assert_1.default.deepStrictEqual(summaries, {
                ["CYP-123"]: "Hello",
                ["CYP-456"]: "Good Morning",
                ["CYP-789"]: "Goodbye",
            });
        });
        await (0, node_test_1.it)("displays a warning for issues which do not exist", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "search", context.mock.fn(async (request) => {
                if (request.fields &&
                    request.fields[0] === "summary" &&
                    request.jql === "issue in (CYP-123,CYP-789,CYP-456)") {
                    return await Promise.resolve([
                        { fields: { ["summary"]: "Hello" }, key: "CYP-123" },
                    ]);
                }
                throw new Error("Mock called unexpectedly");
            }));
            const command = new get_summary_values_command_1.GetSummaryValuesCommand({ jiraClient: jiraClient }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-789", "CYP-456"]));
            node_assert_1.default.deepStrictEqual(await command.compute(), {
                ["CYP-123"]: "Hello",
            });
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Failed to find Jira issues:

                      CYP-456
                      CYP-789
                `),
            ]);
        });
        await (0, node_test_1.it)("displays a warning for issues whose fields cannot be parsed", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "search", context.mock.fn(async (request) => {
                if (request.fields &&
                    request.fields[0] === "summary" &&
                    request.jql === "issue in (CYP-123,CYP-789,CYP-456)") {
                    return await Promise.resolve([
                        { fields: { ["summary"]: { an: "object" } }, key: "CYP-123" },
                        {
                            fields: { bonjour: ["Where", "did", "I", "come", "from?"] },
                            key: "CYP-456",
                        },
                        { fields: { ["summary"]: [42, 84] }, key: "CYP-789" },
                        { fields: { ["summary"]: "hi" } },
                    ]);
                }
                throw new Error("Mock called unexpectedly");
            }));
            const command = new get_summary_values_command_1.GetSummaryValuesCommand({ jiraClient: jiraClient }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-789", "CYP-456"]));
            node_assert_1.default.deepStrictEqual(await command.compute(), {});
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Failed to parse Jira field with ID summary in issues:

                      CYP-123: Value is not of type string: {"an":"object"}
                      CYP-456: Expected an object containing property 'summary', but got: {"bonjour":["Where","did","I","come","from?"]}
                      CYP-789: Value is not of type string: [42,84]
                      Unknown: {"fields":{"summary":"hi"}}
                `),
            ]);
        });
        await (0, node_test_1.it)("throws when encountering search failures", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "search", context.mock.fn(async () => {
                return await Promise.reject(new Error("Connection timeout"));
            }));
            const command = new get_summary_values_command_1.GetSummaryValuesCommand({ jiraClient: jiraClient }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-789", "CYP-456"]));
            await node_assert_1.default.rejects(command.compute(), { message: "Connection timeout" });
        });
    });
});
