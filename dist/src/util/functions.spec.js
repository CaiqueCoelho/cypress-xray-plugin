"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const functions_1 = require("./functions");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(functions_1.getOrCall.name, async () => {
        await (0, node_test_1.it)("returns unwrapped values", async () => {
            node_assert_1.default.strictEqual(await (0, functions_1.getOrCall)("hello"), "hello");
        });
        await (0, node_test_1.it)("resolves sync callbacks", async () => {
            node_assert_1.default.strictEqual(await (0, functions_1.getOrCall)(() => 5), 5);
        });
        await (0, node_test_1.it)("resolves async callbacks", async () => {
            node_assert_1.default.strictEqual(await (0, functions_1.getOrCall)(async () => {
                return new Promise((resolve) => {
                    resolve(5);
                });
            }), 5);
        });
    });
});
