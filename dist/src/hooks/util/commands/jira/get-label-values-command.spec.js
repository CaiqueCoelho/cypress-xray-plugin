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
const get_label_values_command_1 = require("./get-label-values-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(get_label_values_command_1.GetLabelValuesCommand.name, async () => {
        await (0, node_test_1.it)("fetches labels", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "search", context.mock.fn(async (request) => {
                if (request.fields &&
                    request.fields[0] === "labels" &&
                    request.jql === "issue in (CYP-123,CYP-456,CYP-789)") {
                    return await Promise.resolve([
                        { fields: { labels: ["label", "two labels"] }, key: "CYP-123" },
                        { fields: { labels: ["three labels"] }, key: "CYP-456" },
                        { fields: { labels: [] }, key: "CYP-789" },
                    ]);
                }
                throw new Error("Mock called unexpectedly");
            }));
            const command = new get_label_values_command_1.GetLabelValuesCommand({ jiraClient: jiraClient }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-456", "CYP-789"]));
            const summaries = await command.compute();
            node_assert_1.default.deepStrictEqual(summaries, {
                ["CYP-123"]: ["label", "two labels"],
                ["CYP-456"]: ["three labels"],
                ["CYP-789"]: [],
            });
        });
        await (0, node_test_1.it)("displays a warning for issues which do not exist", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "search", context.mock.fn(async (request) => {
                if (request.fields &&
                    request.fields[0] === "labels" &&
                    request.jql === "issue in (CYP-123,CYP-789,CYP-456)") {
                    return await Promise.resolve([
                        { fields: { labels: ["label"] }, key: "CYP-123" },
                    ]);
                }
                throw new Error("Mock called unexpectedly");
            }));
            const command = new get_label_values_command_1.GetLabelValuesCommand({ jiraClient: jiraClient }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-789", "CYP-456"]));
            node_assert_1.default.deepStrictEqual(await command.compute(), {
                ["CYP-123"]: ["label"],
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
                    request.fields[0] === "labels" &&
                    request.jql === "issue in (CYP-123,CYP-789,CYP-456)") {
                    return await Promise.resolve([
                        { fields: { labels: "string" }, key: "CYP-123" },
                        { fields: { bonjour: 42 }, key: "CYP-456" },
                        { fields: { labels: [42, 84] }, key: "CYP-789" },
                        { fields: { labels: ["hi", "there"] } },
                    ]);
                }
                throw new Error("Mock called unexpectedly");
            }));
            const command = new get_label_values_command_1.GetLabelValuesCommand({ jiraClient: jiraClient }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-789", "CYP-456"]));
            node_assert_1.default.deepStrictEqual(await command.compute(), {});
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Failed to parse Jira field with ID labels in issues:

                      CYP-123: Value is not an array of type string: "string"
                      CYP-456: Expected an object containing property 'labels', but got: {"bonjour":42}
                      CYP-789: Value is not an array of type string: [42,84]
                      Unknown: {"fields":{"labels":["hi","there"]}}
                `),
            ]);
        });
        await (0, node_test_1.it)("throws when encountering search failures", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "search", context.mock.fn(async (request) => {
                if (request.fields &&
                    request.fields[0] === "labels" &&
                    request.jql === "issue in (CYP-123,CYP-789,CYP-456)") {
                    await Promise.reject(new Error("Connection timeout"));
                }
                throw new Error("Mock called unexpectedly");
            }));
            const command = new get_label_values_command_1.GetLabelValuesCommand({ jiraClient: jiraClient }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-789", "CYP-456"]));
            await node_assert_1.default.rejects(command.compute(), { message: "Connection timeout" });
        });
    });
});
