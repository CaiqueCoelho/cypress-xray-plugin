"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const credentials_1 = require("../../../../client/authentication/credentials");
const requests_1 = require("../../../../client/https/requests");
const xray_client_server_1 = require("../../../../client/xray/xray-client-server");
const logging_1 = require("../../../../util/logging");
const constant_command_1 = require("../constant-command");
const import_execution_cucumber_command_1 = require("./import-execution-cucumber-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(import_execution_cucumber_command_1.ImportExecutionCucumberCommand.name, async () => {
        await (0, node_test_1.it)("imports cucumber multipart", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const xrayClient = new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            const multipart = {
                features: JSON.parse(node_fs_1.default.readFileSync("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8")),
                info: JSON.parse(node_fs_1.default.readFileSync("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartInfoCloud.json", "utf-8")),
            };
            context.mock.method(xrayClient, "importExecutionCucumberMultipart", context.mock.fn((cucumberJson, cucumberInfo) => {
                if (cucumberJson === multipart.features &&
                    cucumberInfo === multipart.info) {
                    return Promise.resolve("CYP-123");
                }
                return Promise.reject(new Error("Mock called unexpectedly"));
            }));
            const command = new import_execution_cucumber_command_1.ImportExecutionCucumberCommand({
                xrayClient: xrayClient,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, multipart));
            node_assert_1.default.strictEqual(await command.compute(), "CYP-123");
            node_assert_1.default.strictEqual(message.mock.callCount(), 0);
        });
    });
});
