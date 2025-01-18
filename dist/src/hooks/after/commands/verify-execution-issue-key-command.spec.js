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
const verify_execution_issue_key_command_1 = require("./verify-execution-issue-key-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(verify_execution_issue_key_command_1.VerifyExecutionIssueKeyCommand.name, async () => {
        await (0, node_test_1.it)("verifies without warning", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new verify_execution_issue_key_command_1.VerifyExecutionIssueKeyCommand({
                displayCloudHelp: false,
                importType: "cypress",
                testExecutionIssueKey: "CYP-123",
                testExecutionIssueType: { name: "Test Execution" },
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-123"));
            await command.compute();
            node_assert_1.default.strictEqual(message.mock.callCount(), 0);
        });
        await (0, node_test_1.it)("prints a warning for cypress import failures", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new verify_execution_issue_key_command_1.VerifyExecutionIssueKeyCommand({
                displayCloudHelp: true,
                importType: "cypress",
                testExecutionIssueKey: "CYP-123",
                testExecutionIssueType: { name: "Test Execution" },
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-456"));
            await command.compute();
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Cypress execution results were imported to test execution CYP-456, which is different from the configured one: CYP-123

                    Make sure issue CYP-123 actually exists and is of type: {
                      "name": "Test Execution"
                    }

                    More information
                    - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/jira/#issuetype
                    - https://docs.getxray.app/display/XRAYCLOUD/Project+Settings%3A+Issue+Types+Mapping
                `),
            ]);
        });
        await (0, node_test_1.it)("prints a warning for cucumber import failures", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new verify_execution_issue_key_command_1.VerifyExecutionIssueKeyCommand({
                displayCloudHelp: false,
                importType: "cucumber",
                testExecutionIssueKey: "CYP-123",
                testExecutionIssueType: { name: "Test Execution" },
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-456"));
            await command.compute();
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Cucumber execution results were imported to test execution CYP-456, which is different from the configured one: CYP-123

                    Make sure issue CYP-123 actually exists and is of type: {
                      "name": "Test Execution"
                    }

                    More information
                    - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/jira/#issuetype
                    - https://docs.getxray.app/display/XRAY/Configuring+a+Jira+project+to+be+used+as+an+Xray+Test+Project
                `),
            ]);
        });
    });
});
