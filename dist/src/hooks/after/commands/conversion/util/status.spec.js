"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const status_1 = require("./status");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(status_1.getXrayStatus.name, async () => {
        await (0, node_test_1.it)("uses passed as default status name for passed tests", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("passed"), "passed");
        });
        await (0, node_test_1.it)("uses failed as default status name for failed tests", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("failed"), "failed");
        });
        await (0, node_test_1.it)("uses pending as default status name for pending tests", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("pending"), "pending");
        });
        await (0, node_test_1.it)("uses skipped as default status name for skipped tests", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("skipped"), "skipped");
        });
        await (0, node_test_1.it)("uses unknown as default status name for unknown tests", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("unknown"), "unknown");
        });
        await (0, node_test_1.it)("uses undefined as default status name for undefined tests", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("undefined"), "undefined");
        });
        await (0, node_test_1.it)("prefers custom passed statuses", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("passed", {
                passed: "OK",
            }), "OK");
        });
        await (0, node_test_1.it)("prefers custom failed statuses", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("failed", {
                failed: "NO",
            }), "NO");
        });
        await (0, node_test_1.it)("prefers custom pending statuses", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("pending", {
                pending: "WIP",
            }), "WIP");
        });
        await (0, node_test_1.it)("prefers custom skipped statuses", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("skipped", {
                skipped: "SKIP",
            }), "SKIP");
        });
        await (0, node_test_1.it)("does not modify unknown statuses", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("unknown", {
                failed: "FAILING",
                passed: "PASSING",
                pending: "PENDING",
                skipped: "SKIPPING",
            }), "unknown");
        });
        await (0, node_test_1.it)("does not modify undefined statuses", () => {
            node_assert_1.default.strictEqual((0, status_1.getXrayStatus)("undefined", {
                failed: "FAILING",
                passed: "PASSING",
                pending: "PENDING",
                skipped: "SKIPPING",
            }), "undefined");
        });
        await (0, node_test_1.it)("throws for unexpected statuses", () => {
            node_assert_1.default.throws(() => (0, status_1.getXrayStatus)("abc bla bla"), {
                message: "Unknown status: abc bla bla",
            });
        });
    });
});
