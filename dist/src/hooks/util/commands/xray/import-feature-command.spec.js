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
const dedent_1 = require("../../../../util/dedent");
const logging_1 = require("../../../../util/logging");
const import_feature_command_1 = require("./import-feature-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(import_feature_command_1.ImportFeatureCommand.name, async () => {
        await (0, node_test_1.it)("imports features", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const xrayClient = new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(xrayClient, "importFeature", context.mock.fn(async () => {
                return Promise.resolve({
                    errors: [],
                    updatedOrCreatedIssues: ["CYP-123", "CYP-42"],
                });
            }));
            const command = new import_feature_command_1.ImportFeatureCommand({
                filePath: "/path/to/some/cucumber.feature",
                xrayClient: xrayClient,
            }, logging_1.LOG);
            node_assert_1.default.deepStrictEqual(await command.compute(), {
                errors: [],
                updatedOrCreatedIssues: ["CYP-123", "CYP-42"],
            });
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Importing feature file to Xray: /path/to/some/cucumber.feature",
            ]);
        });
        await (0, node_test_1.it)("warns about import errors", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const xrayClient = new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(xrayClient, "importFeature", context.mock.fn(async () => {
                return Promise.resolve({
                    errors: ["CYP-123 does not exist", "CYP-42: Access denied", "Big\nProblem"],
                    updatedOrCreatedIssues: [],
                });
            }));
            const command = new import_feature_command_1.ImportFeatureCommand({
                filePath: "/path/to/some/cucumber.feature",
                xrayClient: xrayClient,
            }, logging_1.LOG);
            await command.compute();
            node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    /path/to/some/cucumber.feature

                      Encountered errors during feature file import:
                      - CYP-123 does not exist
                      - CYP-42: Access denied
                      - Big\nProblem
                `),
            ]);
        });
    });
});
