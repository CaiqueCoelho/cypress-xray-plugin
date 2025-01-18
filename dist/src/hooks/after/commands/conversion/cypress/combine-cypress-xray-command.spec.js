"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const logging_1 = require("../../../../../util/logging");
const constant_command_1 = require("../../../../util/commands/constant-command");
const combine_cypress_xray_command_1 = require("./combine-cypress-xray-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(combine_cypress_xray_command_1.CombineCypressJsonCommand.name, async () => {
        await (0, node_test_1.it)("combines cucumber multipart data", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new combine_cypress_xray_command_1.CombineCypressJsonCommand({ testExecutionIssueKey: "CYP-123" }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, [{ status: "PASS" }, { status: "FAIL" }]), new constant_command_1.ConstantCommand(logging_1.LOG, {
                fields: {
                    description: "Run using Cypress",
                    issuetype: { name: "Test Execution", subtask: false },
                    project: {
                        key: "CYP",
                    },
                    summary: "A test execution",
                },
            }));
            node_assert_1.default.deepStrictEqual(await command.compute(), [
                {
                    testExecutionKey: "CYP-123",
                    tests: [{ status: "PASS" }, { status: "FAIL" }],
                },
                {
                    fields: {
                        description: "Run using Cypress",
                        issuetype: { name: "Test Execution", subtask: false },
                        project: {
                            key: "CYP",
                        },
                        summary: "A test execution",
                    },
                },
            ]);
        });
    });
});
