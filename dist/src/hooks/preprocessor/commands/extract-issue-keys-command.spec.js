"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const logging_1 = require("../../../util/logging");
const constant_command_1 = require("../../util/commands/constant-command");
const extract_issue_keys_command_1 = require("./extract-issue-keys-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(extract_issue_keys_command_1.ExtractIssueKeysCommand.name, async () => {
        await (0, node_test_1.it)("merges all issue keys into one array", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const extractIssueKeysCommand = new extract_issue_keys_command_1.ExtractIssueKeysCommand(logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, {
                preconditions: [{ key: "CYP-001", summary: "Background" }],
                tests: [
                    { key: "CYP-123", summary: "Hello", tags: [] },
                    { key: "CYP-456", summary: "There", tags: ["some tag"] },
                    {
                        key: "CYP-789",
                        summary: "Guys",
                        tags: ["another tag", "and another one"],
                    },
                ],
            }));
            node_assert_1.default.deepStrictEqual(await extractIssueKeysCommand.compute(), [
                "CYP-123",
                "CYP-456",
                "CYP-789",
                "CYP-001",
            ]);
        });
    });
});
