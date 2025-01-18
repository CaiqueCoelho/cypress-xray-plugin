"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const compare_1 = require("./compare");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(compare_1.contains.name, async () => {
        await (0, node_test_1.describe)("primitive types", async () => {
            await (0, node_test_1.it)("bigint", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(BigInt(200), BigInt(200)), true);
            });
            await (0, node_test_1.it)("bigint (negative)", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(BigInt(200), BigInt(500)), false);
            });
            await (0, node_test_1.it)("boolean", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(true, true), true);
            });
            await (0, node_test_1.it)("boolean (negative)", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(true, false), false);
            });
            await (0, node_test_1.it)("function", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(console.log, console.log), true);
            });
            await (0, node_test_1.it)("function (negative)", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(console.log, console.info), false);
            });
            await (0, node_test_1.it)("number", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(42, 42), true);
            });
            await (0, node_test_1.it)("number (negative)", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(42, 1000), false);
            });
            await (0, node_test_1.it)("string", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)("hello", "hello"), true);
            });
            await (0, node_test_1.it)("string (negative)", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)("hello", "bye"), false);
            });
            await (0, node_test_1.it)("symbol", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(Symbol.for("abc"), Symbol.for("abc")), true);
            });
            await (0, node_test_1.it)("symbol (negative)", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(Symbol.for("abc"), Symbol.for("def")), false);
            });
            await (0, node_test_1.it)("undefined", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(undefined, undefined), true);
            });
            await (0, node_test_1.it)("undefined (negative)", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(undefined, 42), false);
            });
        });
        await (0, node_test_1.describe)("arrays", async () => {
            await (0, node_test_1.it)("equal", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)([1, 2, 3, "hello", false], [1, 2, 3, "hello", false]), true);
            });
            await (0, node_test_1.it)("partially equal", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)([1, 2, 3, "hello", false], [false, "hello", 3]), true);
            });
            await (0, node_test_1.it)("not equal", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)([1, 2, 3, "hello", false], [true, "bye", 17]), false);
            });
            await (0, node_test_1.it)("not equal and no array", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)(null, [1, 2, 3]), false);
            });
        });
        await (0, node_test_1.describe)("objects", async () => {
            await (0, node_test_1.it)("equal", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)({ a: "b", c: 5, d: false }, { a: "b", c: 5, d: false }), true);
            });
            await (0, node_test_1.it)("partially equal", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)({ a: "b", c: 5, d: false }, { c: 5, d: false }), true);
            });
            await (0, node_test_1.it)("not equal", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)({ a: "b", c: 5, d: false }, { [5]: "oh no", x: "y" }), false);
            });
        });
        await (0, node_test_1.describe)("complex", async () => {
            await (0, node_test_1.it)("partially equal", () => {
                node_assert_1.default.strictEqual((0, compare_1.contains)({
                    a: "b",
                    c: 5,
                    d: [
                        { e: 42, f: 100, g: "hi", h: [32, 1052] },
                        null,
                        { x: [17, { y: null, z: "bonjour" }] },
                    ],
                }, {
                    c: 5,
                    d: [{ g: "hi", h: [1052] }, { x: [{ z: "bonjour" }] }],
                }), true);
            });
        });
    });
});
