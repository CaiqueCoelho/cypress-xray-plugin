"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const logging_1 = require("../../../../../util/logging");
const constant_command_1 = require("../../../../util/commands/constant-command");
const assert_cucumber_conversion_valid_command_1 = require("./assert-cucumber-conversion-valid-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(assert_cucumber_conversion_valid_command_1.AssertCucumberConversionValidCommand.name, async () => {
        await (0, node_test_1.it)("correctly verifies cucumber multipart data", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberFeatures = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartServer.json", "utf-8"));
            const cucumberInfo = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartInfoServer.json", "utf-8"));
            const cucumberMultipart = {
                features: cucumberFeatures,
                info: cucumberInfo,
            };
            const command = new assert_cucumber_conversion_valid_command_1.AssertCucumberConversionValidCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, cucumberMultipart));
            await node_assert_1.default.doesNotReject(command.compute());
        });
        await (0, node_test_1.it)("throws for empty feature arrays", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberInfo = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartInfoServer.json", "utf-8"));
            const cucumberMultipart = {
                features: [],
                info: cucumberInfo,
            };
            const command = new assert_cucumber_conversion_valid_command_1.AssertCucumberConversionValidCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, cucumberMultipart));
            await node_assert_1.default.rejects(command.compute(), {
                message: "Skipping Cucumber results upload: No Cucumber tests were executed",
            });
        });
    });
});
