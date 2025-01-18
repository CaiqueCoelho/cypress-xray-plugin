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
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(constant_command_1.ConstantCommand.name, async () => {
        await (0, node_test_1.it)("returns the value", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new constant_command_1.ConstantCommand(logging_1.LOG, {
                a: 10,
                b: 20,
            });
            node_assert_1.default.deepStrictEqual(await command.compute(), {
                a: 10,
                b: 20,
            });
        });
    });
});
