"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const dedent_1 = require("../../../util/dedent");
const logging_1 = require("../../../util/logging");
const constant_command_1 = require("../../util/commands/constant-command");
const get_updated_issues_command_1 = require("./get-updated-issues-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(get_updated_issues_command_1.GetUpdatedIssuesCommand.name, async () => {
        await (0, node_test_1.it)("returns all affected issues", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new get_updated_issues_command_1.GetUpdatedIssuesCommand({ filePath: "~/home/test/some.feature" }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-456", "CYP-789", "CYP-001"]), new constant_command_1.ConstantCommand(logging_1.LOG, {
                errors: [],
                updatedOrCreatedIssues: ["CYP-123", "CYP-456", "CYP-789", "CYP-001"],
            }));
            node_assert_1.default.deepStrictEqual(await command.compute(), [
                "CYP-123",
                "CYP-456",
                "CYP-789",
                "CYP-001",
            ]);
        });
    });
    await (0, node_test_1.it)("warns about issues not updated by xray", async (context) => {
        const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
        const command = new get_updated_issues_command_1.GetUpdatedIssuesCommand({ filePath: "~/home/test/some.feature" }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-756"]), new constant_command_1.ConstantCommand(logging_1.LOG, {
            errors: [],
            updatedOrCreatedIssues: [],
        }));
        node_assert_1.default.deepStrictEqual(await command.compute(), []);
        node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
            logging_1.Level.WARNING,
            (0, dedent_1.dedent)(`
                ~/home/test/some.feature

                  Mismatch between feature file issue tags and updated Jira issues detected.

                    Issues contained in feature file tags that have not been updated by Xray and may not exist:

                      CYP-123
                      CYP-756

                  Make sure that:
                  - All issues present in feature file tags belong to existing issues.
                  - Your plugin tag prefix settings match those defined in Xray.

                  More information:
                  - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                  - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
            `),
        ]);
    });
    await (0, node_test_1.it)("warns about unknown issues updated by xray", async (context) => {
        const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
        const command = new get_updated_issues_command_1.GetUpdatedIssuesCommand({ filePath: "~/home/test/some.feature" }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, []), new constant_command_1.ConstantCommand(logging_1.LOG, {
            errors: [],
            updatedOrCreatedIssues: ["CYP-123", "CYP-756"],
        }));
        node_assert_1.default.deepStrictEqual(await command.compute(), []);
        node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
            logging_1.Level.WARNING,
            (0, dedent_1.dedent)(`
                ~/home/test/some.feature

                  Mismatch between feature file issue tags and updated Jira issues detected.

                    Issues updated by Xray that do not exist in feature file tags and may have been created:

                      CYP-123
                      CYP-756

                  Make sure that:
                  - All issues present in feature file tags belong to existing issues.
                  - Your plugin tag prefix settings match those defined in Xray.

                  More information:
                  - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                  - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
            `),
        ]);
    });
    await (0, node_test_1.it)("warns about issue key mismatches", async (context) => {
        const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
        const command = new get_updated_issues_command_1.GetUpdatedIssuesCommand({ filePath: "~/home/test/some.feature" }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, ["CYP-123", "CYP-756", "CYP-42"]), new constant_command_1.ConstantCommand(logging_1.LOG, {
            errors: [],
            updatedOrCreatedIssues: ["CYP-536", "CYP-552", "CYP-756"],
        }));
        node_assert_1.default.deepStrictEqual(await command.compute(), ["CYP-756"]);
        node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
            logging_1.Level.WARNING,
            (0, dedent_1.dedent)(`
                ~/home/test/some.feature

                  Mismatch between feature file issue tags and updated Jira issues detected.

                    Issues contained in feature file tags that have not been updated by Xray and may not exist:

                      CYP-123
                      CYP-42

                    Issues updated by Xray that do not exist in feature file tags and may have been created:

                      CYP-536
                      CYP-552

                  Make sure that:
                  - All issues present in feature file tags belong to existing issues.
                  - Your plugin tag prefix settings match those defined in Xray.

                  More information:
                  - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                  - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
            `),
        ]);
    });
});
