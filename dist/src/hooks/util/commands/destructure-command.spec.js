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
const constant_command_1 = require("./constant-command");
const destructure_command_1 = require("./destructure-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(destructure_command_1.DestructureCommand.name, async () => {
        await (0, node_test_1.it)("returns the accessed object value", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new destructure_command_1.DestructureCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, {
                a: 10,
                b: { c: "bonjour" },
            }), "b");
            node_assert_1.default.deepStrictEqual(await command.compute(), { c: "bonjour" });
        });
        await (0, node_test_1.it)("throws for invalid object accesses", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new destructure_command_1.DestructureCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, {
                a: 10,
                b: 20,
            }), "c");
            await node_assert_1.default.rejects(command.compute(), {
                message: 'Failed to access element c in: {"a":10,"b":20}',
            });
        });
    });
});
