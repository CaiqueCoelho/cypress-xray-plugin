"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const errors_1 = require("./errors");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(errors_1.errorMessage.name, async () => {
        await (0, node_test_1.it)("returns error messages", () => {
            node_assert_1.default.strictEqual((0, errors_1.errorMessage)(new Error("Hi")), "Hi");
        });
        await (0, node_test_1.it)("returns other objects as strings", () => {
            node_assert_1.default.strictEqual((0, errors_1.errorMessage)(15), "15");
        });
    });
    await (0, node_test_1.describe)(errors_1.isLoggedError.name, async () => {
        await (0, node_test_1.it)("returns true for LoggedError", () => {
            node_assert_1.default.strictEqual((0, errors_1.isLoggedError)(new errors_1.LoggedError()), true);
        });
        await (0, node_test_1.it)("returns false for Error", () => {
            node_assert_1.default.strictEqual((0, errors_1.isLoggedError)(new Error()), false);
        });
    });
});
