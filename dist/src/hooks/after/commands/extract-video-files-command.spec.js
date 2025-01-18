"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const logging_1 = require("../../../util/logging");
const constant_command_1 = require("../../util/commands/constant-command");
const extract_video_files_command_1 = require("./extract-video-files-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(extract_video_files_command_1.ExtractVideoFilesCommand.name, async () => {
        await (0, node_test_1.it)("extracts video files", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const runResults = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResult.json", "utf-8"));
            const command = new extract_video_files_command_1.ExtractVideoFilesCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, runResults));
            node_assert_1.default.deepStrictEqual(await command.compute(), [
                "~/repositories/xray/cypress/videos/example.cy.ts.mp4",
            ]);
        });
        await (0, node_test_1.it)("skips null paths", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const runResults = JSON.parse(node_fs_1.default.readFileSync("./test/resources/runResult_13_0_0.json", "utf-8"));
            const command = new extract_video_files_command_1.ExtractVideoFilesCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, runResults));
            node_assert_1.default.deepStrictEqual(await command.compute(), []);
        });
    });
});
