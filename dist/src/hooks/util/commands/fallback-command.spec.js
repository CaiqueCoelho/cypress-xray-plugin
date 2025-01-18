"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const logging_1 = require("../../../util/logging");
const command_1 = require("../../command");
const constant_command_1 = require("./constant-command");
const fallback_command_1 = require("./fallback-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(fallback_command_1.FallbackCommand.name, async () => {
        await (0, node_test_1.it)("computes the result if possible", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const input = new constant_command_1.ConstantCommand(logging_1.LOG, 42);
            const command = new fallback_command_1.FallbackCommand({
                fallbackOn: [command_1.ComputableState.FAILED],
                fallbackValue: "fallback",
            }, logging_1.LOG, input);
            node_assert_1.default.strictEqual(await command.compute(), 42);
        });
        await (0, node_test_1.it)("returns the fallback value", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const input = new constant_command_1.ConstantCommand(logging_1.LOG, 42);
            const command = new fallback_command_1.FallbackCommand({
                fallbackOn: [command_1.ComputableState.FAILED],
                fallbackValue: "fallback",
            }, logging_1.LOG, input);
            input.setState(command_1.ComputableState.FAILED);
            node_assert_1.default.strictEqual(await command.compute(), "fallback");
        });
    });
});
