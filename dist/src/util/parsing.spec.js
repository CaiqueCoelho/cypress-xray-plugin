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
const parsing_1 = require("./parsing");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(parsing_1.asBoolean.name, async () => {
        await (0, node_test_1.describe)(true.toString(), async () => {
            await (0, node_test_1.it)("y", () => {
                node_assert_1.default.strictEqual((0, parsing_1.asBoolean)("y"), true);
            });
            await (0, node_test_1.it)("yes", () => {
                node_assert_1.default.strictEqual((0, parsing_1.asBoolean)("yes"), true);
            });
            await (0, node_test_1.it)("true", () => {
                node_assert_1.default.strictEqual((0, parsing_1.asBoolean)("true"), true);
            });
            await (0, node_test_1.it)("1", () => {
                node_assert_1.default.strictEqual((0, parsing_1.asBoolean)("1"), true);
            });
            await (0, node_test_1.it)("on", () => {
                node_assert_1.default.strictEqual((0, parsing_1.asBoolean)("on"), true);
            });
        });
        await (0, node_test_1.describe)(false.toString(), async () => {
            await (0, node_test_1.it)("n", () => {
                node_assert_1.default.strictEqual((0, parsing_1.asBoolean)("n"), false);
            });
            await (0, node_test_1.it)("no", () => {
                node_assert_1.default.strictEqual((0, parsing_1.asBoolean)("no"), false);
            });
            await (0, node_test_1.it)("false", () => {
                node_assert_1.default.strictEqual((0, parsing_1.asBoolean)("false"), false);
            });
            await (0, node_test_1.it)("0", () => {
                node_assert_1.default.strictEqual((0, parsing_1.asBoolean)("0"), false);
            });
            await (0, node_test_1.it)("off", () => {
                node_assert_1.default.strictEqual((0, parsing_1.asBoolean)("off"), false);
            });
        });
        await (0, node_test_1.it)("throws for unknown values", () => {
            node_assert_1.default.throws(() => (0, parsing_1.asBoolean)("hi"), {
                message: "Failed to parse boolean value from string: hi",
            });
        });
    });
    await (0, node_test_1.describe)(parsing_1.asFloat.name, async () => {
        await (0, node_test_1.it)("10", () => {
            node_assert_1.default.strictEqual((0, parsing_1.asFloat)("10"), 10.0);
        });
        await (0, node_test_1.it)("-1242.0535", () => {
            node_assert_1.default.strictEqual((0, parsing_1.asFloat)("-1242.0535"), -1242.0535);
        });
        await (0, node_test_1.it)("returns NaN for unknown values", () => {
            node_assert_1.default.strictEqual((0, parsing_1.asFloat)("hi"), NaN);
        });
    });
    await (0, node_test_1.describe)(parsing_1.asInt.name, async () => {
        await (0, node_test_1.it)("10", () => {
            node_assert_1.default.strictEqual((0, parsing_1.asInt)("10"), 10);
        });
        await (0, node_test_1.it)("-1242.0535", () => {
            node_assert_1.default.strictEqual((0, parsing_1.asInt)("-1242.0535"), -1242);
        });
        await (0, node_test_1.it)("returns NaN for unknown values", () => {
            node_assert_1.default.strictEqual((0, parsing_1.asInt)("hi"), NaN);
        });
    });
    await (0, node_test_1.describe)(parsing_1.asArrayOfStrings.name, async () => {
        await (0, node_test_1.it)("parses arrays containing primitives", () => {
            node_assert_1.default.deepStrictEqual((0, parsing_1.asArrayOfStrings)([false, 5, 6, "hello", Symbol("anubis")]), [
                "false",
                "5",
                "6",
                "hello",
                "Symbol(anubis)",
            ]);
        });
        await (0, node_test_1.it)("throws for non-array arguments", () => {
            node_assert_1.default.throws(() => (0, parsing_1.asArrayOfStrings)(5), {
                message: (0, dedent_1.dedent)(`
                    Failed to parse as array of strings: 5
                    Expected an array of primitives, but got: 5
                `),
            });
        });
        await (0, node_test_1.it)("throws for empty arguments", () => {
            node_assert_1.default.throws(() => (0, parsing_1.asArrayOfStrings)([]), {
                message: (0, dedent_1.dedent)(`
                    Failed to parse as array of strings: []
                    Expected an array of primitives with at least one element
                `),
            });
        });
        await (0, node_test_1.it)("throws for non-array elements", () => {
            node_assert_1.default.throws(() => (0, parsing_1.asArrayOfStrings)([1, 2, [3, "4"], 5]), {
                message: (0, dedent_1.dedent)(`
                    Failed to parse as array of strings: [1,2,[3,"4"],5]
                    Expected a primitive element at index 2, but got: [3,"4"]
                `),
            });
        });
    });
    await (0, node_test_1.describe)(parsing_1.asObject.name, async () => {
        await (0, node_test_1.it)("parses objects", () => {
            node_assert_1.default.deepStrictEqual((0, parsing_1.asObject)({ hello: 5, something: { nested: "hi" } }), {
                hello: 5,
                something: { nested: "hi" },
            });
        });
        await (0, node_test_1.it)("throws for array arguments", () => {
            node_assert_1.default.throws(() => (0, parsing_1.asObject)([5, false, 6, "hi"]), {
                message: 'Failed to parse as object: [5,false,6,"hi"]',
            });
        });
        await (0, node_test_1.describe)("throws for primitive arguments", async () => {
            for (const value of ["hi", false, 15, Symbol("good"), BigInt(12345)]) {
                await (0, node_test_1.it)(`type: ${typeof value}`, () => {
                    node_assert_1.default.throws(() => (0, parsing_1.asObject)(value), {
                        message: `Failed to parse as object: ${value.toString()}`,
                    });
                });
            }
        });
        await (0, node_test_1.it)("throws for null elements", () => {
            node_assert_1.default.throws(() => (0, parsing_1.asObject)(null), { message: "Failed to parse as object: null" });
        });
        await (0, node_test_1.it)("throws for undefined elements", () => {
            node_assert_1.default.throws(() => (0, parsing_1.asObject)(undefined), {
                message: "Failed to parse as object: undefined",
            });
        });
    });
});
