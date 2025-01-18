"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const axios_1 = require("axios");
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const util_1 = require("../../test/util");
const errors_1 = require("./errors");
const logging_1 = require("./logging");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(logging_1.PluginLogger.name, async () => {
        await (0, node_test_1.describe)("message", async () => {
            await (0, node_test_1.it)("handles single line messages", (context) => {
                const info = context.mock.method(console, "info", context.mock.fn());
                const logger = new logging_1.PluginLogger();
                logger.message(logging_1.Level.INFO, "hello");
                node_assert_1.default.deepStrictEqual(info.mock.calls[0].arguments, [
                    `${ansi_colors_1.default.white("│ Cypress Xray Plugin │ INFO    │")} ${ansi_colors_1.default.gray("hello")}`,
                ]);
            });
            await (0, node_test_1.it)("handles multi line messages", (context) => {
                const info = context.mock.method(console, "info", context.mock.fn());
                const logger = new logging_1.PluginLogger();
                logger.message(logging_1.Level.INFO, "hello\nbonjour");
                node_assert_1.default.deepStrictEqual(info.mock.callCount(), 3);
                node_assert_1.default.deepStrictEqual(info.mock.calls[0].arguments, [
                    `${ansi_colors_1.default.white("│ Cypress Xray Plugin │ INFO    │")} ${ansi_colors_1.default.gray("hello")}`,
                ]);
                node_assert_1.default.deepStrictEqual(info.mock.calls[1].arguments, [
                    `${ansi_colors_1.default.white("│ Cypress Xray Plugin │ INFO    │")}   ${ansi_colors_1.default.gray("bonjour")}`,
                ]);
                node_assert_1.default.deepStrictEqual(info.mock.calls[2].arguments, [
                    ansi_colors_1.default.white("│ Cypress Xray Plugin │ INFO    │"),
                ]);
            });
        });
        await (0, node_test_1.describe)("logToFile", async () => {
            await (0, node_test_1.it)("writes to relative directories", () => {
                const logger = new logging_1.PluginLogger({
                    logDirectory: (0, node_path_1.relative)(".", (0, util_1.resolveTestDirPath)("logs")),
                });
                const actualPath = logger.logToFile("[1, 2, 3]", "logToFileRelative.json");
                const expectedPath = (0, util_1.resolveTestDirPath)("logs", "logToFileRelative.json");
                node_assert_1.default.strictEqual(actualPath, expectedPath);
                const parsedFile = node_fs_1.default.readFileSync(expectedPath, "utf8");
                node_assert_1.default.deepStrictEqual(parsedFile, "[1, 2, 3]");
            });
            await (0, node_test_1.it)("writes to absolute directories", () => {
                const logger = new logging_1.PluginLogger({
                    logDirectory: (0, util_1.resolveTestDirPath)("logs"),
                });
                const actualPath = logger.logToFile("[4, 5, 6]", "logToFileAbsolute.json");
                const expectedPath = (0, util_1.resolveTestDirPath)("logs", "logToFileAbsolute.json");
                node_assert_1.default.strictEqual(actualPath, expectedPath);
                const parsedFile = node_fs_1.default.readFileSync(expectedPath, "utf8");
                node_assert_1.default.deepStrictEqual(parsedFile, "[4, 5, 6]");
            });
            await (0, node_test_1.it)("writes to non-existent directories", (context) => {
                const error = context.mock.method(console, "error", context.mock.fn());
                const timestamp = Date.now();
                const logger = new logging_1.PluginLogger({
                    logDirectory: (0, util_1.resolveTestDirPath)("logs", timestamp.toString()),
                });
                logger.logErrorToFile(new Error(JSON.stringify({
                    something: "entirely different",
                })), "logErrorToFileNonExistent");
                const expectedPath = (0, util_1.resolveTestDirPath)("logs", timestamp.toString(), "logErrorToFileNonExistent.json");
                const parsedError = JSON.parse(node_fs_1.default.readFileSync(expectedPath, "utf8"));
                node_assert_1.default.strictEqual("error" in parsedError, true);
                node_assert_1.default.strictEqual("stacktrace" in parsedError, true);
                node_assert_1.default.deepStrictEqual(error.mock.calls[0].arguments, [
                    `${ansi_colors_1.default.white("│ Cypress Xray Plugin │ ERROR   │")} ${ansi_colors_1.default.red(`Complete error logs have been written to: ${expectedPath}`)}`,
                ]);
            });
        });
        await (0, node_test_1.describe)("logErrorToFile", async () => {
            await (0, node_test_1.it)("writes to relative directories", (context) => {
                const error = context.mock.method(console, "error", context.mock.fn());
                const logger = new logging_1.PluginLogger({
                    logDirectory: (0, node_path_1.relative)(".", (0, util_1.resolveTestDirPath)("logs")),
                });
                logger.logErrorToFile(new Error(JSON.stringify({
                    something: "else",
                })), "logErrorToFileRelative");
                const expectedPath = (0, util_1.resolveTestDirPath)("logs", "logErrorToFileRelative.json");
                const parsedError = JSON.parse(node_fs_1.default.readFileSync(expectedPath, "utf8"));
                node_assert_1.default.strictEqual("error" in parsedError, true);
                node_assert_1.default.strictEqual("stacktrace" in parsedError, true);
                node_assert_1.default.deepStrictEqual(error.mock.calls[0].arguments, [
                    `${ansi_colors_1.default.white("│ Cypress Xray Plugin │ ERROR   │")} ${ansi_colors_1.default.red(`Complete error logs have been written to: ${expectedPath}`)}`,
                ]);
            });
            await (0, node_test_1.it)("writes to absolute directories", (context) => {
                const error = context.mock.method(console, "error", context.mock.fn());
                const logger = new logging_1.PluginLogger({
                    logDirectory: (0, util_1.resolveTestDirPath)("logs"),
                });
                logger.logErrorToFile(new Error(JSON.stringify({
                    something: "entirely else",
                })), "logErrorToFileAbsolute");
                const expectedPath = (0, util_1.resolveTestDirPath)("logs", "logErrorToFileAbsolute.json");
                const parsedError = JSON.parse(node_fs_1.default.readFileSync(expectedPath, "utf8"));
                node_assert_1.default.strictEqual("error" in parsedError, true);
                node_assert_1.default.strictEqual("stacktrace" in parsedError, true);
                node_assert_1.default.deepStrictEqual(error.mock.calls[0].arguments, [
                    `${ansi_colors_1.default.white("│ Cypress Xray Plugin │ ERROR   │")} ${ansi_colors_1.default.red(`Complete error logs have been written to: ${expectedPath}`)}`,
                ]);
            });
            await (0, node_test_1.it)("writes to non-existent directories", (context) => {
                const timestamp = Date.now();
                const error = context.mock.method(console, "error", context.mock.fn());
                const logger = new logging_1.PluginLogger({
                    logDirectory: (0, util_1.resolveTestDirPath)("logs", timestamp.toString()),
                });
                logger.logErrorToFile(new Error(JSON.stringify({
                    something: "entirely different",
                })), "logErrorToFileNonExistent");
                const expectedPath = (0, util_1.resolveTestDirPath)("logs", timestamp.toString(), "logErrorToFileNonExistent.json");
                const parsedError = JSON.parse(node_fs_1.default.readFileSync(expectedPath, "utf8"));
                node_assert_1.default.strictEqual("error" in parsedError, true);
                node_assert_1.default.strictEqual("stacktrace" in parsedError, true);
                node_assert_1.default.deepStrictEqual(error.mock.calls[0].arguments, [
                    `${ansi_colors_1.default.white("│ Cypress Xray Plugin │ ERROR   │")} ${ansi_colors_1.default.red(`Complete error logs have been written to: ${expectedPath}`)}`,
                ]);
            });
            await (0, node_test_1.it)("writes axios errors", (context) => {
                const timestamp = Date.now();
                const error = context.mock.method(console, "error", context.mock.fn());
                const logger = new logging_1.PluginLogger({
                    logDirectory: (0, util_1.resolveTestDirPath)("logs", timestamp.toString()),
                });
                logger.logErrorToFile(new axios_1.AxiosError("Request failed with status code 400", "400", { headers: new axios_1.AxiosHeaders() }, null, {
                    config: {
                        headers: new axios_1.AxiosHeaders({
                            ["Authorization"]: "Bearer 123456790",
                        }),
                    },
                    data: {
                        error: "Must provide a project key",
                    },
                    headers: {},
                    status: 400,
                    statusText: "Bad Request",
                }), "logErrorToFileAxios");
                const expectedPath = (0, util_1.resolveTestDirPath)("logs", timestamp.toString(), "logErrorToFileAxios.json");
                node_assert_1.default.deepStrictEqual(error.mock.calls[0].arguments, [
                    `${ansi_colors_1.default.white("│ Cypress Xray Plugin │ ERROR   │")} ${ansi_colors_1.default.red(`Complete error logs have been written to: ${expectedPath}`)}`,
                ]);
                const parsedData = JSON.parse(node_fs_1.default.readFileSync(expectedPath, "utf-8"));
                node_assert_1.default.strictEqual(parsedData.error.message, "Request failed with status code 400");
                node_assert_1.default.strictEqual(parsedData.error.name, "AxiosError");
                node_assert_1.default.strictEqual(parsedData.error.code, "400");
                node_assert_1.default.strictEqual(parsedData.error.status, 400);
                node_assert_1.default.deepStrictEqual(parsedData.response, {
                    error: "Must provide a project key",
                });
            });
            await (0, node_test_1.it)("writes generic errors", (context) => {
                const timestamp = Date.now();
                const error = context.mock.method(console, "error", context.mock.fn());
                const logger = new logging_1.PluginLogger({
                    logDirectory: (0, util_1.resolveTestDirPath)("logs", timestamp.toString()),
                });
                logger.logErrorToFile({ good: "morning" }, "logErrorToFileGeneric");
                const expectedPath = (0, util_1.resolveTestDirPath)("logs", timestamp.toString(), "logErrorToFileGeneric.log");
                const parsedError = JSON.parse(node_fs_1.default.readFileSync(expectedPath, "utf8"));
                node_assert_1.default.deepStrictEqual(parsedError, { good: "morning" });
                node_assert_1.default.deepStrictEqual(error.mock.calls[0].arguments, [
                    `${ansi_colors_1.default.white("│ Cypress Xray Plugin │ ERROR   │")} ${ansi_colors_1.default.red(`Complete error logs have been written to: ${expectedPath}`)}`,
                ]);
            });
            await (0, node_test_1.it)("does not write already logged errors", (context) => {
                const error = context.mock.method(console, "error", context.mock.fn());
                const timestamp = Date.now();
                const logger = new logging_1.PluginLogger({
                    logDirectory: (0, util_1.resolveTestDirPath)("logs", timestamp.toString()),
                });
                logger.logErrorToFile(new errors_1.LoggedError("hello"), "logErrorToFileLogged");
                const expectedPath = (0, util_1.resolveTestDirPath)("logs", timestamp.toString(), "logErrorToFileLogged");
                node_assert_1.default.strictEqual(error.mock.callCount(), 0);
                node_assert_1.default.strictEqual(node_fs_1.default.existsSync(expectedPath), false);
            });
        });
    });
    await (0, node_test_1.describe)(logging_1.CapturingLogger.name, async () => {
        await (0, node_test_1.describe)("message", async () => {
            await (0, node_test_1.it)("stores calls", () => {
                const logger = new logging_1.CapturingLogger();
                logger.message(logging_1.Level.INFO, "hello");
                logger.message(logging_1.Level.ERROR, "alarm");
                node_assert_1.default.deepStrictEqual(logger.getMessages(), [
                    [logging_1.Level.INFO, "hello"],
                    [logging_1.Level.ERROR, "alarm"],
                ]);
            });
        });
        await (0, node_test_1.describe)("logToFile", async () => {
            await (0, node_test_1.it)("stores calls", () => {
                const logger = new logging_1.CapturingLogger();
                node_assert_1.default.deepStrictEqual([
                    logger.logToFile("[1, 2, 3]", "logToFile1.json"),
                    logger.logToFile("[5, 6, 7]", "logToFile2.json"),
                ], ["logToFile1.json", "logToFile2.json"]);
                node_assert_1.default.deepStrictEqual(logger.getFileLogMessages(), [
                    ["[1, 2, 3]", "logToFile1.json"],
                    ["[5, 6, 7]", "logToFile2.json"],
                ]);
            });
        });
        await (0, node_test_1.describe)("logErrorToFile", async () => {
            await (0, node_test_1.it)("stores calls", () => {
                const logger = new logging_1.CapturingLogger();
                logger.logErrorToFile(new Error("I failed"), "logToFile1.json");
                logger.logErrorToFile(new Error("I failed, too"), "logToFile2.json");
                node_assert_1.default.deepStrictEqual(logger.getFileLogErrorMessages(), [
                    [new Error("I failed"), "logToFile1.json"],
                    [new Error("I failed, too"), "logToFile2.json"],
                ]);
            });
        });
        await (0, node_test_1.describe)("configure", async () => {
            await (0, node_test_1.it)("does nothing", () => {
                const unconfiguredLogger = new logging_1.CapturingLogger();
                const configuredLogger = new logging_1.CapturingLogger();
                configuredLogger.configure();
                node_assert_1.default.deepStrictEqual(unconfiguredLogger, configuredLogger);
            });
        });
    });
});
