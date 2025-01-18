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
const parse_feature_file_command_1 = require("./parse-feature-file-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(parse_feature_file_command_1.ParseFeatureFileCommand.name, async () => {
        await (0, node_test_1.it)("displays errors for invalid feature files", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const filePath = "./test/resources/features/invalid.feature";
            const command = new parse_feature_file_command_1.ParseFeatureFileCommand({ filePath: filePath }, logging_1.LOG);
            await node_assert_1.default.rejects(command.compute(), {
                message: (0, dedent_1.dedent)(`
                    ./test/resources/features/invalid.feature

                      Failed to parse feature file.

                        Parser errors:
                        (9:3): expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ScenarioLine, #RuleLine, #Comment, #Empty, got 'Invalid: Element'
                `),
            });
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                `Parsing feature file: ./test/resources/features/invalid.feature`,
            ]);
        });
    });
});
