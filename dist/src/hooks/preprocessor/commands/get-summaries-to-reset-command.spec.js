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
const get_summaries_to_reset_command_1 = require("./get-summaries-to-reset-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(get_summaries_to_reset_command_1.GetSummariesToResetCommand.name, async () => {
        await (0, node_test_1.it)("returns summaries of issues to reset", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new get_summaries_to_reset_command_1.GetSummariesToResetCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, {
                ["CYP-123"]: "Old Summary",
                ["CYP-456"]: "Old Summary Too",
            }), new constant_command_1.ConstantCommand(logging_1.LOG, {
                ["CYP-123"]: "New Summary",
                ["CYP-456"]: "Old Summary Too",
            }));
            node_assert_1.default.deepStrictEqual(await command.compute(), {
                ["CYP-123"]: "Old Summary",
            });
        });
        await (0, node_test_1.it)("warns about unknown old summaries", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new get_summaries_to_reset_command_1.GetSummariesToResetCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, {}), new constant_command_1.ConstantCommand(logging_1.LOG, {
                ["CYP-123"]: "New Summary",
            }));
            node_assert_1.default.deepStrictEqual(await command.compute(), {});
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    CYP-123

                      The plugin tried to reset the issue's summary after importing the feature file, but could not because the previous summary could not be retrieved.

                      Make sure to manually restore it if needed.
                `),
            ]);
        });
    });
});
