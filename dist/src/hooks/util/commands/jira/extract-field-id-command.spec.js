"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const dedent_1 = require("../../../../util/dedent");
const logging_1 = require("../../../../util/logging");
const constant_command_1 = require("../constant-command");
const extract_field_id_command_1 = require("./extract-field-id-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(extract_field_id_command_1.ExtractFieldIdCommand.name, async () => {
        await (0, node_test_1.it)("extracts fields case-insensitively", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new extract_field_id_command_1.ExtractFieldIdCommand({ field: extract_field_id_command_1.JiraField.TEST_PLAN }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, [
                {
                    clauseNames: ["test plan"],
                    custom: false,
                    id: "customfield_12345",
                    name: "Test Plan",
                    navigable: true,
                    orderable: true,
                    schema: {
                        system: "test plan",
                        type: "string",
                    },
                    searchable: true,
                },
                {
                    clauseNames: ["description"],
                    custom: false,
                    id: "description",
                    name: "Description",
                    navigable: true,
                    orderable: true,
                    schema: {
                        system: "description",
                        type: "string",
                    },
                    searchable: true,
                },
            ]));
            node_assert_1.default.strictEqual(await command.compute(), "customfield_12345");
        });
        await (0, node_test_1.it)("throws for missing fields", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new extract_field_id_command_1.ExtractFieldIdCommand({ field: extract_field_id_command_1.JiraField.TEST_PLAN }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, [
                {
                    clauseNames: ["summary"],
                    custom: false,
                    id: "customfield_12345",
                    name: "Summary",
                    navigable: true,
                    orderable: true,
                    schema: {
                        system: "summary",
                        type: "string",
                    },
                    searchable: true,
                },
            ]));
            await node_assert_1.default.rejects(command.compute(), {
                message: (0, dedent_1.dedent)(`
                    Failed to fetch Jira field ID for field with name: test plan
                    Make sure the field actually exists and that your Jira language settings did not modify the field's name

                    Available fields:
                      name: "Summary" id: "customfield_12345"

                    You can provide field IDs directly without relying on language settings:

                      jira: {
                        fields: {
                          testPlan: // corresponding field ID
                        }
                      }
                `),
            });
        });
        await (0, node_test_1.describe)("throws for missing fields and displays a hint", async () => {
            await (0, node_test_1.it)(extract_field_id_command_1.JiraField.TEST_ENVIRONMENTS, async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const command = new extract_field_id_command_1.ExtractFieldIdCommand({ field: extract_field_id_command_1.JiraField.TEST_ENVIRONMENTS }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, []));
                await node_assert_1.default.rejects(command.compute(), {
                    message: (0, dedent_1.dedent)(`
                        Failed to fetch Jira field ID for field with name: test environments
                        Make sure the field actually exists and that your Jira language settings did not modify the field's name

                        You can provide field IDs directly without relying on language settings:

                          jira: {
                            fields: {
                              testEnvironments: // corresponding field ID
                            }
                          }
                    `),
                });
            });
            await (0, node_test_1.it)(extract_field_id_command_1.JiraField.TEST_PLAN, async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const command = new extract_field_id_command_1.ExtractFieldIdCommand({ field: extract_field_id_command_1.JiraField.TEST_PLAN }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, []));
                await node_assert_1.default.rejects(command.compute(), {
                    message: (0, dedent_1.dedent)(`
                        Failed to fetch Jira field ID for field with name: test plan
                        Make sure the field actually exists and that your Jira language settings did not modify the field's name

                        You can provide field IDs directly without relying on language settings:

                          jira: {
                            fields: {
                              testPlan: // corresponding field ID
                            }
                          }
                    `),
                });
            });
        });
        await (0, node_test_1.it)("throws for multiple fields", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new extract_field_id_command_1.ExtractFieldIdCommand({ field: extract_field_id_command_1.JiraField.TEST_PLAN }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, [
                {
                    clauseNames: ["Test Plan"],
                    custom: false,
                    id: "testPlan",
                    name: "Test Plan",
                    navigable: true,
                    orderable: true,
                    schema: {
                        system: "Test Plan",
                        type: "string",
                    },
                    searchable: true,
                },
                {
                    clauseNames: ["Test Plan (custom)"],
                    custom: false,
                    id: "customfield_12345",
                    name: "Test Plan",
                    navigable: true,
                    orderable: true,
                    schema: {
                        customId: 5125,
                        type: "string",
                    },
                    searchable: true,
                },
            ]));
            await node_assert_1.default.rejects(command.compute(), {
                message: (0, dedent_1.dedent)(`
                    Failed to fetch Jira field ID for field with name: test plan
                    There are multiple fields with this name

                    Duplicates:
                      clauseNames: ["Test Plan (custom)"], custom: false, id: "customfield_12345", name: "Test Plan", navigable: true, orderable: true, schema: {"customId":5125,"type":"string"}     , searchable: true
                      clauseNames: ["Test Plan"]         , custom: false, id: "testPlan"         , name: "Test Plan", navigable: true, orderable: true, schema: {"system":"Test Plan","type":"string"}, searchable: true

                    You can provide field IDs in the options:

                      jira: {
                        fields: {
                          testPlan: // "testPlan" or "customfield_12345"
                        }
                      }
                `),
            });
        });
    });
});
