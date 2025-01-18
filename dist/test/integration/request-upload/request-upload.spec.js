"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = require("node:path");
const node_process_1 = __importDefault(require("node:process"));
const node_test_1 = require("node:test");
const sh_1 = require("../../sh");
// ============================================================================================== //
// https://github.com/Qytera-Gmbh/cypress-xray-plugin/issues/314
// ============================================================================================== //
(0, node_test_1.describe)((0, node_path_1.relative)(node_process_1.default.cwd(), __filename), () => {
    for (const test of [
        {
            logDirectory: (0, node_path_1.join)(__dirname, "automatic-cloud", "logs"),
            projectDirectory: (0, node_path_1.join)(__dirname, "automatic-cloud"),
            service: "cloud",
            title: "cy.request gets overwritten (cloud)",
        },
        {
            logDirectory: (0, node_path_1.join)(__dirname, "automatic-server", "logs"),
            projectDirectory: (0, node_path_1.join)(__dirname, "automatic-server"),
            service: "server",
            title: "cy.request gets overwritten (server)",
        },
        {
            logDirectory: (0, node_path_1.join)(__dirname, "manual-cloud", "logs"),
            projectDirectory: (0, node_path_1.join)(__dirname, "manual-cloud"),
            service: "cloud",
            title: "cy.request gets overwritten using manual task calls (cloud)",
        },
        {
            logDirectory: (0, node_path_1.join)(__dirname, "manual-server", "logs"),
            projectDirectory: (0, node_path_1.join)(__dirname, "manual-server"),
            service: "server",
            title: "cy.request gets overwritten using manual task calls (server)",
        },
    ]) {
        (0, node_test_1.it)(test.title, () => {
            (0, sh_1.runCypress)(test.projectDirectory, {
                includeDefaultEnv: test.service,
            });
            for (const entry of node_fs_1.default.readdirSync(test.logDirectory, {
                withFileTypes: true,
            })) {
                // 14_15_52_POST_https_xray.cloud.getxray.app_api_v2_import_execution_multipart_request.json
                if (!/.+_POST_.+_import_execution_multipart_request.json/.exec(entry.name)) {
                    continue;
                }
                const fileContent = JSON.parse(node_fs_1.default.readFileSync((0, node_path_1.join)(entry.parentPath, entry.name), "utf8"));
                node_assert_1.default.strictEqual(fileContent.body.includes('"evidence":[{"contentType":"application/json","data":"ImxvY2FsaG9zdDo4MDgwIg=="'), true);
                return;
            }
            node_assert_1.default.fail(`Expected to find a logged import execution request in log directory ${ansi_colors_1.default.red(test.logDirectory)}, but did not find any`);
        });
    }
});
