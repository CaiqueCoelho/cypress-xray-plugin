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
const fetch_issue_types_command_1 = require("./fetch-issue-types-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(fetch_issue_types_command_1.FetchIssueTypesCommand.name, async () => {
        await (0, node_test_1.it)("fetches issue types", async (context) => {
            const types = [
                {
                    avatarId: 10314,
                    description: "Test",
                    hierarchyLevel: 0,
                    iconUrl: "https://example.org/rest/api/2/universal_avatar/view/type/issuetype/avatar/10314?size=medium",
                    id: "10017",
                    name: "Test",
                    scope: {
                        project: {
                            id: "10008",
                        },
                        type: "PROJECT",
                    },
                    self: "https://example.org/rest/api/2/issuetype/10017",
                    subtask: false,
                    untranslatedName: "Test",
                },
                {
                    avatarId: 10315,
                    description: "Eine Funktionalität oder Funktion, ausgedrückt als Benutzerziel.",
                    hierarchyLevel: 0,
                    iconUrl: "https://example.org/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315?size=medium",
                    id: "10001",
                    name: "Story",
                    self: "https://example.org/rest/api/2/issuetype/10001",
                    subtask: false,
                    untranslatedName: "Story",
                },
            ];
            const jiraClient = new jira_client_1.BaseJiraClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(jiraClient, "getIssueTypes", context.mock.fn(async () => {
                return await Promise.resolve(types);
            }));
            const command = new fetch_issue_types_command_1.FetchIssueTypesCommand({ jiraClient: jiraClient }, logging_1.LOG);
            node_assert_1.default.deepStrictEqual(await command.compute(), types);
        });
    });
});
