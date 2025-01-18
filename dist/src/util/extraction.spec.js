"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const extraction_1 = require("./extraction");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)("extractString", async () => {
        await (0, node_test_1.it)("extracts string properties", () => {
            const data = {
                x: "nice to meet you",
            };
            node_assert_1.default.strictEqual((0, extraction_1.extractString)(data, "x"), "nice to meet you");
        });
        await (0, node_test_1.it)("throws if data is not an object", () => {
            node_assert_1.default.throws(() => (0, extraction_1.extractString)(5, "x"), {
                message: "Expected an object containing property 'x', but got: 5",
            });
        });
        await (0, node_test_1.it)("throws if data is null", () => {
            node_assert_1.default.throws(() => (0, extraction_1.extractString)(null, "x"), {
                message: "Expected an object containing property 'x', but got: null",
            });
        });
        await (0, node_test_1.it)("throws if data is undefined", () => {
            node_assert_1.default.throws(() => (0, extraction_1.extractString)(undefined, "x"), {
                message: "Expected an object containing property 'x', but got: undefined",
            });
        });
        await (0, node_test_1.it)("throws if data does not contain the property", () => {
            const data = {
                x: "nice to meet you",
            };
            node_assert_1.default.throws(() => (0, extraction_1.extractString)(data, "missing"), {
                message: 'Expected an object containing property \'missing\', but got: {"x":"nice to meet you"}',
            });
        });
        await (0, node_test_1.it)("throws if the property is not a string value", () => {
            const data = {
                x: 5,
            };
            node_assert_1.default.throws(() => (0, extraction_1.extractString)(data, "x"), {
                message: "Value is not of type string: 5",
            });
        });
    });
    await (0, node_test_1.describe)("extractArrayOfStrings", async () => {
        await (0, node_test_1.it)("extracts string array properties", () => {
            const data = {
                x: ["nice", "to", "meet", "you"],
            };
            node_assert_1.default.deepStrictEqual((0, extraction_1.extractArrayOfStrings)(data, "x"), ["nice", "to", "meet", "you"]);
        });
        await (0, node_test_1.it)("throws if data is not an object", () => {
            node_assert_1.default.throws(() => (0, extraction_1.extractArrayOfStrings)(5, "x"), {
                message: "Expected an object containing property 'x', but got: 5",
            });
        });
        await (0, node_test_1.it)("throws if data is null", () => {
            node_assert_1.default.throws(() => (0, extraction_1.extractArrayOfStrings)(null, "x"), {
                message: "Expected an object containing property 'x', but got: null",
            });
        });
        await (0, node_test_1.it)("throws if data is undefined", () => {
            node_assert_1.default.throws(() => (0, extraction_1.extractArrayOfStrings)(undefined, "x"), {
                message: "Expected an object containing property 'x', but got: undefined",
            });
        });
        await (0, node_test_1.it)("throws if data does not contain the property", () => {
            const data = {
                x: ["nice", "to", "meet", "you"],
            };
            node_assert_1.default.throws(() => (0, extraction_1.extractArrayOfStrings)(data, "missing"), {
                message: 'Expected an object containing property \'missing\', but got: {"x":["nice","to","meet","you"]}',
            });
        });
        await (0, node_test_1.it)("throws if the property is not an array value", () => {
            const data = {
                x: "good morning",
            };
            node_assert_1.default.throws(() => (0, extraction_1.extractArrayOfStrings)(data, "x"), {
                message: 'Value is not an array of type string: "good morning"',
            });
        });
        await (0, node_test_1.it)("throws if the property is not a string array value", () => {
            const data = {
                x: ["good", "morning", "my", 42, "friends"],
            };
            node_assert_1.default.throws(() => (0, extraction_1.extractArrayOfStrings)(data, "x"), {
                message: 'Value is not an array of type string: ["good","morning","my",42,"friends"]',
            });
        });
    });
    await (0, node_test_1.describe)("extractNestedString", async () => {
        await (0, node_test_1.it)("extracts nested string properties", () => {
            const data = {
                a: {
                    b: {
                        c: {
                            d: "hello",
                        },
                    },
                },
            };
            node_assert_1.default.strictEqual((0, extraction_1.extractNestedString)(data, ["a", "b", "c", "d"]), "hello");
        });
        await (0, node_test_1.it)("throws if data is not an object", () => {
            node_assert_1.default.throws(() => (0, extraction_1.extractNestedString)(5, ["x"]), {
                message: "Expected an object containing property 'x', but got: 5",
            });
        });
        await (0, node_test_1.it)("throws if data is null", () => {
            node_assert_1.default.throws(() => (0, extraction_1.extractNestedString)(null, ["x"]), {
                message: "Expected an object containing property 'x', but got: null",
            });
        });
        await (0, node_test_1.it)("throws if data is undefined", () => {
            node_assert_1.default.throws(() => (0, extraction_1.extractNestedString)(undefined, ["x"]), {
                message: "Expected an object containing property 'x', but got: undefined",
            });
        });
        await (0, node_test_1.it)("throws if a nested property is not an object value", () => {
            const data = {
                a: {
                    b: {
                        c: "surprise",
                    },
                },
            };
            node_assert_1.default.throws(() => (0, extraction_1.extractNestedString)(data, ["a", "b", "c", "d"]), {
                message: "Expected an object containing property 'd', but got: \"surprise\"",
            });
        });
        await (0, node_test_1.it)("throws if the final property is not a string value", () => {
            const data = {
                a: {
                    b: {
                        c: {
                            d: 42,
                        },
                    },
                },
            };
            node_assert_1.default.throws(() => (0, extraction_1.extractNestedString)(data, ["a", "b", "c", "d"]), {
                message: "Value is not of type string: 42",
            });
        });
    });
});
