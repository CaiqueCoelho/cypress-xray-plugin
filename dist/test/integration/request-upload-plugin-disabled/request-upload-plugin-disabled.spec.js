"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const sh_1 = require("../../sh");
// ============================================================================================== //
// https://github.com/Qytera-Gmbh/cypress-xray-plugin/pull/339
// ============================================================================================== //
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), { timeout: 180000 }, async () => {
    for (const test of [
        {
            logDirectory: (0, node_path_1.join)(__dirname, "server", "logs"),
            projectDirectory: (0, node_path_1.join)(__dirname, "cloud"),
            service: "cloud",
            title: "the cy.request task does not do anything if disabled (cloud)",
        },
        {
            logDirectory: (0, node_path_1.join)(__dirname, "server", "logs"),
            projectDirectory: (0, node_path_1.join)(__dirname, "server"),
            service: "server",
            title: "the cy.request task does not do anything if disabled (server)",
        },
    ]) {
        await (0, node_test_1.it)(test.title, () => {
            (0, sh_1.runCypress)(test.projectDirectory, {
                includeDefaultEnv: test.service,
            });
            node_assert_1.default.strictEqual(node_fs_1.default.existsSync(test.logDirectory), false);
        });
    }
});
