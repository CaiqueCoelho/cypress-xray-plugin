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
const string_1 = require("./string");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(string_1.unknownToString.name, async () => {
        await (0, node_test_1.it)("string", () => {
            node_assert_1.default.strictEqual((0, string_1.unknownToString)("hi"), "hi");
        });
        await (0, node_test_1.it)("number", () => {
            node_assert_1.default.strictEqual((0, string_1.unknownToString)(423535.568), "423535.568");
        });
        await (0, node_test_1.it)("boolean", () => {
            node_assert_1.default.strictEqual((0, string_1.unknownToString)(false), "false");
        });
        await (0, node_test_1.it)("symbol", () => {
            node_assert_1.default.strictEqual((0, string_1.unknownToString)(Symbol("hello")), "Symbol(hello)");
        });
        await (0, node_test_1.it)("function", () => {
            const f = async (arg1) => {
                await new Promise((resolve) => {
                    resolve(arg1);
                });
            };
            node_assert_1.default.strictEqual((0, string_1.unknownToString)(f), `async (arg1) => {
                await new Promise((resolve) => {
                    resolve(arg1);
                });
            }`);
        });
        await (0, node_test_1.it)("undefined", () => {
            node_assert_1.default.strictEqual((0, string_1.unknownToString)(undefined), "undefined");
        });
        await (0, node_test_1.it)("object", () => {
            node_assert_1.default.strictEqual((0, string_1.unknownToString)({ a: 5, b: [1, 2, 3], c: { d: "hi" } }), '{"a":5,"b":[1,2,3],"c":{"d":"hi"}}');
        });
        await (0, node_test_1.it)("object (pretty)", () => {
            node_assert_1.default.strictEqual((0, string_1.unknownToString)({ a: 5, b: [1, 2, 3], c: { d: "hi" } }, true), (0, dedent_1.dedent)(`
                    {
                      "a": 5,
                      "b": [
                        1,
                        2,
                        3
                      ],
                      "c": {
                        "d": "hi"
                      }
                    }
                `));
        });
    });
});
