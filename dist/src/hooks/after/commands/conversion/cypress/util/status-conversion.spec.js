"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const status_1 = require("../../../../../../types/cypress/status");
const status_conversion_1 = require("./status-conversion");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(status_conversion_1.toCypressStatus.name, async () => {
        await (0, node_test_1.it)("parses passed statuses", () => {
            node_assert_1.default.strictEqual((0, status_conversion_1.toCypressStatus)("passed"), status_1.CypressStatus.PASSED);
        });
        await (0, node_test_1.it)("parses failed statuses", () => {
            node_assert_1.default.strictEqual((0, status_conversion_1.toCypressStatus)("failed"), status_1.CypressStatus.FAILED);
        });
        await (0, node_test_1.it)("parses pending statuses", () => {
            node_assert_1.default.strictEqual((0, status_conversion_1.toCypressStatus)("pending"), status_1.CypressStatus.PENDING);
        });
        await (0, node_test_1.it)("parses skipped statuses", () => {
            node_assert_1.default.strictEqual((0, status_conversion_1.toCypressStatus)("skipped"), status_1.CypressStatus.SKIPPED);
        });
        await (0, node_test_1.it)("throws for unknown statuses", () => {
            node_assert_1.default.throws(() => (0, status_conversion_1.toCypressStatus)("5"), {
                message: "Unknown Cypress test status: 5",
            });
        });
    });
    await (0, node_test_1.describe)(status_conversion_1.getXrayStatus.name, async () => {
        await (0, node_test_1.describe)("server", async () => {
            await (0, node_test_1.it)("uses PASS as default status name for passed tests", () => {
                node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.PASSED, false), "PASS");
            });
            await (0, node_test_1.it)("uses FAIL as default status name for failed tests", () => {
                node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.FAILED, false), "FAIL");
            });
            await (0, node_test_1.it)("uses TODO as default status name for pending tests", () => {
                node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.PENDING, false), "TODO");
            });
            await (0, node_test_1.it)("uses FAIL as default status name for skipped tests", () => {
                node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.SKIPPED, false), "FAIL");
            });
        });
        await (0, node_test_1.describe)("cloud", async () => {
            await (0, node_test_1.it)("uses PASSED as default status name for passed tests", () => {
                node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.PASSED, true), "PASSED");
            });
            await (0, node_test_1.it)("uses FAILED as default status name for failed tests", () => {
                node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.FAILED, true), "FAILED");
            });
            await (0, node_test_1.it)("uses TO DO as default status name for pending tests", () => {
                node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.PENDING, true), "TO DO");
            });
            await (0, node_test_1.it)("uses FAILED as default status name for skipped tests", () => {
                node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.SKIPPED, true), "FAILED");
            });
        });
        await (0, node_test_1.it)("prefers custom passed statuses", () => {
            node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.PASSED, true, {
                passed: "OK",
            }), "OK");
        });
        await (0, node_test_1.it)("prefers custom failed statuses", () => {
            node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.FAILED, true, {
                failed: "NO",
            }), "NO");
        });
        await (0, node_test_1.it)("prefers custom pending statuses", () => {
            node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.PENDING, true, {
                pending: "WIP",
            }), "WIP");
        });
        await (0, node_test_1.it)("prefers custom skipped statuses", () => {
            node_assert_1.default.strictEqual((0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.SKIPPED, true, {
                skipped: "SKIP",
            }), "SKIP");
        });
    });
});
