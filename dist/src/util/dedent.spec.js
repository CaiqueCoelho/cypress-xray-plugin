"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const dedent_1 = require("./dedent");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.it)("strips leading whitespace", () => {
        node_assert_1.default.strictEqual((0, dedent_1.dedent)(`   Hello\nthere\nyo`), "Hello\nthere\nyo");
    });
    await (0, node_test_1.it)("strips leading and trailing multiline whitespace", () => {
        node_assert_1.default.strictEqual((0, dedent_1.dedent)(`
                Hello
                  there
                    yo
            `), "Hello\n  there\n    yo");
    });
    await (0, node_test_1.it)("adds indentation to newlines in between", () => {
        node_assert_1.default.strictEqual((0, dedent_1.dedent)(`
                Hello
                  there
                    ${["example 1", "example 2"].join("\n")}
                  yo
            `), "Hello\n  there\n    example 1\n    example 2\n  yo");
    });
    await (0, node_test_1.it)("handles unindented strings", () => {
        node_assert_1.default.strictEqual((0, dedent_1.dedent)(`Hello`), "Hello");
    });
});
