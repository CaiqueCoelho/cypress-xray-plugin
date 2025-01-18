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
const credentials_1 = require("../../../client/authentication/credentials");
const requests_1 = require("../../../client/https/requests");
const xray_client_server_1 = require("../../../client/xray/xray-client-server");
const command_1 = require("../../../hooks/command");
const import_execution_cucumber_command_1 = require("../../../hooks/util/commands/xray/import-execution-cucumber-command");
const import_execution_cypress_command_1 = require("../../../hooks/util/commands/xray/import-execution-cypress-command");
const import_feature_command_1 = require("../../../hooks/util/commands/xray/import-feature-command");
const dedent_1 = require("../../dedent");
const errors_1 = require("../../errors");
const logging_1 = require("../../logging");
const graph_1 = require("../graph");
const graph_logger_1 = require("./graph-logger");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(graph_logger_1.ChainingGraphLogger.name, async () => {
        await (0, node_test_1.it)("logs correctly indented message chains", () => {
            const graph = new graph_1.SimpleDirectedGraph();
            const a = graph.place({ getFailure: () => new Error("A failed") });
            const b = graph.place({ getFailure: () => undefined });
            const c = graph.place({ getFailure: () => undefined });
            const d = graph.place({ getFailure: () => new Error("D failed") });
            const e = graph.place({ getFailure: () => undefined });
            const f = graph.place({ getFailure: () => new Error("F failed") });
            const p = graph.place({ getFailure: () => undefined });
            const q = graph.place({ getFailure: () => undefined });
            const x = graph.place({ getFailure: () => new Error("X failed") });
            const y = graph.place({ getFailure: () => undefined });
            const z = graph.place({ getFailure: () => new errors_1.SkippedError("Z skipped") });
            graph.connect(a, b);
            graph.connect(a, d);
            graph.connect(b, c);
            graph.connect(d, e);
            graph.connect(d, f);
            graph.connect(p, q);
            graph.connect(x, y);
            graph.connect(x, z);
            const logger = new logging_1.CapturingLogger();
            new graph_logger_1.ChainingGraphLogger(logger).logGraph(graph);
            node_assert_1.default.deepStrictEqual(logger.getMessages(), [
                [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        F failed

                          Caused by: D failed

                            Caused by: A failed
                    `),
                ],
                [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        Z skipped

                          Caused by: X failed
                    `),
                ],
            ]);
        });
        await (0, node_test_1.it)("logs correctly indented message chains in diamond form", () => {
            const graph = new graph_1.SimpleDirectedGraph();
            const a = graph.place({ getFailure: () => new Error("A failed") });
            const b = graph.place({ getFailure: () => undefined });
            const c = graph.place({ getFailure: () => undefined });
            const d = graph.place({ getFailure: () => new Error("D failed") });
            const e = graph.place({ getFailure: () => new errors_1.SkippedError("E skipped") });
            const f = graph.place({ getFailure: () => new Error("F failed") });
            const g = graph.place({ getFailure: () => new Error("G failed") });
            const h = graph.place({ getFailure: () => new errors_1.SkippedError("H skipped") });
            const i = graph.place({ getFailure: () => new errors_1.SkippedError("I skipped") });
            graph.connect(a, b);
            graph.connect(a, d);
            graph.connect(b, c);
            graph.connect(d, e);
            graph.connect(d, f);
            graph.connect(e, g);
            graph.connect(f, g);
            graph.connect(g, h);
            graph.connect(g, i);
            const logger = new logging_1.CapturingLogger();
            new graph_logger_1.ChainingGraphLogger(logger).logGraph(graph);
            node_assert_1.default.deepStrictEqual(logger.getMessages(), [
                [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        H skipped

                          Caused by: G failed

                            Caused by: E skipped

                            Caused by: F failed

                              Caused by: D failed

                                Caused by: A failed
                    `),
                ],
                [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        I skipped

                          Caused by: G failed

                            Caused by: E skipped

                            Caused by: F failed

                              Caused by: D failed

                                Caused by: A failed
                    `),
                ],
            ]);
        });
        await (0, node_test_1.it)("does not log entirely successful forests", () => {
            const graph = new graph_1.SimpleDirectedGraph();
            const a = graph.place({ getFailure: () => undefined });
            const b = graph.place({ getFailure: () => undefined });
            const c = graph.place({ getFailure: () => undefined });
            const d = graph.place({ getFailure: () => undefined });
            const e = graph.place({ getFailure: () => undefined });
            const f = graph.place({ getFailure: () => undefined });
            const p = graph.place({ getFailure: () => undefined });
            const q = graph.place({ getFailure: () => undefined });
            const x = graph.place({ getFailure: () => undefined });
            const y = graph.place({ getFailure: () => undefined });
            const z = graph.place({ getFailure: () => undefined });
            graph.connect(a, b);
            graph.connect(a, d);
            graph.connect(b, c);
            graph.connect(d, e);
            graph.connect(d, f);
            graph.connect(p, q);
            graph.connect(x, y);
            graph.connect(x, z);
            const logger = new logging_1.CapturingLogger();
            new graph_logger_1.ChainingGraphLogger(logger).logGraph(graph);
            node_assert_1.default.deepStrictEqual(logger.getMessages(), []);
        });
        await (0, node_test_1.it)("logs correctly indented multiline chains", () => {
            const graph = new graph_1.SimpleDirectedGraph();
            const a = graph.place({
                getFailure: () => new errors_1.SkippedError((0, dedent_1.dedent)(`
                            A failed

                            for some reason
                        `)),
            });
            const b = graph.place({ getFailure: () => undefined });
            const c = graph.place({ getFailure: () => undefined });
            const d = graph.place({
                getFailure: () => new errors_1.SkippedError((0, dedent_1.dedent)(`
                            D skipped

                            because A failed
                        `)),
            });
            const e = graph.place({ getFailure: () => undefined });
            const f = graph.place({ getFailure: () => new errors_1.SkippedError("F skipped") });
            graph.connect(a, b);
            graph.connect(a, d);
            graph.connect(b, c);
            graph.connect(d, e);
            graph.connect(d, f);
            const logger = new logging_1.CapturingLogger();
            new graph_logger_1.ChainingGraphLogger(logger).logGraph(graph);
            node_assert_1.default.deepStrictEqual(logger.getMessages(), [
                [
                    logging_1.Level.WARNING,
                    (0, dedent_1.dedent)(`
                        F skipped

                          Caused by: D skipped

                          because A failed

                            Caused by: A failed

                            for some reason
                    `),
                ],
            ]);
        });
        await (0, node_test_1.it)("logs vertices with priority first", () => {
            const graph = new graph_1.SimpleDirectedGraph();
            const a = graph.place({ getFailure: () => new Error("A failed") });
            const b = graph.place({ getFailure: () => new errors_1.SkippedError("B skipped") });
            const c = graph.place({ getFailure: () => undefined });
            const d = graph.place({ getFailure: () => undefined });
            const e = graph.place({ getFailure: () => new Error("E failed") });
            const f = graph.place({ getFailure: () => new errors_1.SkippedError("F skipped") });
            graph.connect(a, b);
            graph.connect(a, d);
            graph.connect(b, c);
            graph.connect(d, e);
            graph.connect(d, f);
            const logger = new logging_1.CapturingLogger();
            new graph_logger_1.ChainingGraphLogger(logger, (vertex) => vertex === f || vertex === e).logGraph(graph);
            node_assert_1.default.deepStrictEqual(logger.getMessages(), [
                [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        E failed
                    `),
                ],
                [
                    logging_1.Level.WARNING,
                    (0, dedent_1.dedent)(`
                        F skipped
                    `),
                ],
                [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        B skipped

                          Caused by: A failed
                    `),
                ],
            ]);
        });
    });
    await (0, node_test_1.describe)(graph_logger_1.ChainingCommandGraphLogger.name, async () => {
        class FailingCommand extends command_1.Command {
            computeResult() {
                throw new Error(`No computing today: ${this.parameters.message}`);
            }
        }
        await (0, node_test_1.it)("adds additional information to cucumber import command failures", async () => {
            const logger = new logging_1.CapturingLogger();
            const graph = new graph_1.SimpleDirectedGraph();
            const a = graph.place(new FailingCommand({ message: "generic failure" }, logger));
            const b = graph.place(new import_execution_cucumber_command_1.ImportExecutionCucumberCommand({
                xrayClient: new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default)),
            }, logger, a));
            graph.connect(a, b);
            await Promise.allSettled([a.compute()]);
            b.setState(command_1.ComputableState.SKIPPED);
            new graph_logger_1.ChainingCommandGraphLogger(logger).logGraph(graph);
            node_assert_1.default.deepStrictEqual(logger.getMessages(), [
                [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        Failed to upload Cucumber execution results.

                          Caused by: No computing today: generic failure
                    `),
                ],
            ]);
        });
        await (0, node_test_1.it)("adds additional information to cypress import command failures", async () => {
            const logger = new logging_1.CapturingLogger();
            const graph = new graph_1.SimpleDirectedGraph();
            const a = graph.place(new FailingCommand({ message: "generic failure" }, logger));
            const b = graph.place(new import_execution_cypress_command_1.ImportExecutionCypressCommand({
                xrayClient: new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default)),
            }, logger, a));
            graph.connect(a, b);
            await Promise.allSettled([a.compute()]);
            b.setState(command_1.ComputableState.SKIPPED);
            new graph_logger_1.ChainingCommandGraphLogger(logger).logGraph(graph);
            node_assert_1.default.deepStrictEqual(logger.getMessages(), [
                [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        Failed to upload Cypress execution results.

                          Caused by: No computing today: generic failure
                    `),
                ],
            ]);
        });
        await (0, node_test_1.it)("adds additional information to feature file import command failures", async (context) => {
            const logger = new logging_1.CapturingLogger();
            const xrayClient = new xray_client_server_1.ServerClient("http://localhost:1234", new credentials_1.PatCredentials("token"), new requests_1.AxiosRestClient(axios_1.default));
            context.mock.method(xrayClient, "importFeature", context.mock.fn());
            const graph = new graph_1.SimpleDirectedGraph();
            const a = graph.place(new FailingCommand({ message: "cannot parse file" }, logger));
            const b = graph.place(new import_feature_command_1.ImportFeatureCommand({ filePath: "/path/to/file.feature", xrayClient: xrayClient }, logger));
            graph.connect(a, b);
            await Promise.allSettled([a.compute()]);
            b.setState(command_1.ComputableState.SKIPPED);
            new graph_logger_1.ChainingCommandGraphLogger(logger).logGraph(graph);
            node_assert_1.default.deepStrictEqual(logger.getMessages(), [
                [
                    logging_1.Level.ERROR,
                    (0, dedent_1.dedent)(`
                        /path/to/file.feature

                          Failed to import feature file.

                          Caused by: No computing today: cannot parse file
                    `),
                ],
            ]);
        });
    });
});
