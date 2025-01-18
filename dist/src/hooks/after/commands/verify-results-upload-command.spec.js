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
const errors_1 = require("../../../util/errors");
const logging_1 = require("../../../util/logging");
const constant_command_1 = require("../../util/commands/constant-command");
const verify_results_upload_command_1 = require("./verify-results-upload-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(verify_results_upload_command_1.VerifyResultsUploadCommand.name, async () => {
        await (0, node_test_1.it)("prints a success message for successful cypress uploads", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new verify_results_upload_command_1.VerifyResultsUploadCommand({ url: "http://localhost:1234" }, logging_1.LOG, {
                cucumberExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, undefined),
                cypressExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-123"),
            });
            await command.compute();
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.SUCCESS,
                "Uploaded Cypress test results to issue: CYP-123 (http://localhost:1234/browse/CYP-123)",
            ]);
        });
        await (0, node_test_1.it)("prints a success message for successful cucumber uploads", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new verify_results_upload_command_1.VerifyResultsUploadCommand({ url: "http://localhost:1234" }, logging_1.LOG, {
                cucumberExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-123"),
                cypressExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, undefined),
            });
            await command.compute();
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.SUCCESS,
                "Uploaded Cucumber test results to issue: CYP-123 (http://localhost:1234/browse/CYP-123)",
            ]);
        });
        await (0, node_test_1.it)("prints a success message for successful uploads", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new verify_results_upload_command_1.VerifyResultsUploadCommand({ url: "http://localhost:1234" }, logging_1.LOG, {
                cucumberExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-123"),
                cypressExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-123"),
            });
            await command.compute();
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.SUCCESS,
                "Uploaded test results to issue: CYP-123 (http://localhost:1234/browse/CYP-123)",
            ]);
        });
        await (0, node_test_1.it)("skips for mismatched execution issue keys", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new verify_results_upload_command_1.VerifyResultsUploadCommand({ url: "http://localhost:1234" }, logging_1.LOG, {
                cucumberExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-456"),
                cypressExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-123"),
            });
            await node_assert_1.default.rejects(command.compute(), errors_1.SkippedError, (0, dedent_1.dedent)(`
                    Cucumber execution results were imported to a different test execution issue than the Cypress execution results:

                      Cypress  test execution issue: CYP-123 http://localhost:1234/browse/CYP-123
                      Cucumber test execution issue: CYP-456 http://localhost:1234/browse/CYP-456

                    Make sure your Jira configuration does not prevent modifications of existing test executions.
                `));
        });
        await (0, node_test_1.it)("skips when there are no results", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new verify_results_upload_command_1.VerifyResultsUploadCommand({ url: "http://localhost:1234" }, logging_1.LOG, {
                cucumberExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, undefined),
                cypressExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, undefined),
            });
            await node_assert_1.default.rejects(command.compute(), errors_1.SkippedError, "No test results were uploaded");
        });
    });
});
