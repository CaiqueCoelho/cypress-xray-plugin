"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const base64_1 = require("./base64");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.it)("should encode png files to base64", () => {
        const encodedString = (0, base64_1.encodeFile)("./test/resources/turtle.png");
        node_assert_1.default.notStrictEqual(encodedString.length, 0);
    });
    await (0, node_test_1.it)("should encode txt files to base64", () => {
        const encodedString = (0, base64_1.encodeFile)("./test/resources/greetings.txt");
        node_assert_1.default.strictEqual(encodedString, "SGVsbG8gVGhlcmUh");
    });
});
