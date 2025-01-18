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
const assert_cypress_conversion_valid_command_1 = require("./assert-cypress-conversion-valid-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(assert_cypress_conversion_valid_command_1.AssertCypressConversionValidCommand.name, async () => {
        await (0, node_test_1.it)("correctly verifies xray json data", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const xrayJson = [
                {
                    testExecutionKey: "CYP-123",
                    tests: [{ status: "PASS" }, { status: "FAIL" }],
                },
                {
                    fields: {
                        description: "Run using Cypress",
                        issuetype: { name: "Test Execution" },
                        project: {
                            key: "CYP",
                        },
                        summary: "A test execution",
                    },
                },
            ];
            const command = new assert_cypress_conversion_valid_command_1.AssertCypressConversionValidCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, xrayJson));
            await node_assert_1.default.doesNotReject(command.compute());
        });
        await (0, node_test_1.it)("throws for missing xray test arrays", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const xrayJson = [
                { testExecutionKey: "CYP-123" },
                {
                    fields: {
                        description: "Run using Cypress",
                        issuetype: { name: "Test Execution" },
                        project: {
                            key: "CYP",
                        },
                        summary: "A test execution",
                    },
                },
            ];
            const command = new assert_cypress_conversion_valid_command_1.AssertCypressConversionValidCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, xrayJson));
            await node_assert_1.default.rejects(command.compute(), {
                message: "Skipping Cypress results upload: No native Cypress tests were executed",
            });
        });
        await (0, node_test_1.it)("throws for empty xray test arrays", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const xrayJson = [
                {
                    testExecutionKey: "CYP-123",
                    tests: [],
                },
                {
                    fields: {
                        description: "Run using Cypress",
                        issuetype: { name: "Test Execution" },
                        project: {
                            key: "CYP",
                        },
                        summary: "A test execution",
                    },
                },
            ];
            const command = new assert_cypress_conversion_valid_command_1.AssertCypressConversionValidCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, xrayJson));
            await node_assert_1.default.rejects(command.compute(), {
                message: "Skipping Cypress results upload: No native Cypress tests were executed",
            });
        });
    });
});
