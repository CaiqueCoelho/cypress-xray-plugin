"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const credentials_1 = require("../../../../client/authentication/credentials");
const requests_1 = require("../../../../client/https/requests");
const xray_client_server_1 = require("../../../../client/xray/xray-client-server");
const logging_1 = require("../../../../util/logging");
const constant_command_1 = require("../constant-command");
const import_execution_cypress_command_1 = require("./import-execution-cypress-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(import_execution_cypress_command_1.ImportExecutionCypressCommand.name, async () => {
        await (0, node_test_1.it)("imports cypress xray json", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const results = {
                info: { description: "Hello", summary: "Test Execution Summary" },
                testExecutionKey: "CYP-123",
                tests: [
                    { status: "PASSED" },
                    { status: "PASSED" },
                    { status: "PASSED" },
                    { status: "FAILED" },
                ],
            };
            const info = {
                fields: {
                    issuetype: {
                        id: "10008",
                    },
                    labels: ["a", "b"],
                    project: {
                        key: "CYP",
                    },
                    summary: "Brand new Test execution",
                },
            };
            const xrayClient = new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(xrayClient, "importExecutionMultipart", context.mock.fn((executionResults, executionInfo) => {
                if (executionResults === results && executionInfo === info) {
                    return Promise.resolve("CYP-123");
                }
                return Promise.reject(new Error("Mock called unexpectedly"));
            }));
            const command = new import_execution_cypress_command_1.ImportExecutionCypressCommand({
                xrayClient: xrayClient,
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, [results, info]));
            node_assert_1.default.strictEqual(await command.compute(), "CYP-123");
            node_assert_1.default.strictEqual(message.mock.callCount(), 0);
        });
    });
});
