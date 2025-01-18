"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const set_1 = require("./set");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)("computeOverlap", async () => {
        await (0, node_test_1.it)("computes the overlap of arrays", () => {
            node_assert_1.default.deepStrictEqual((0, set_1.computeOverlap)([1, 2, 3], [2, 5, 9, 1]), {
                intersection: [1, 2],
                leftOnly: [3],
                rightOnly: [5, 9],
            });
        });
        await (0, node_test_1.it)("computes the overlap of identical iterables", () => {
            node_assert_1.default.deepStrictEqual((0, set_1.computeOverlap)([4, 1, 3, 2], new Set([1, 4, 2, 3])), {
                intersection: [4, 1, 3, 2],
                leftOnly: [],
                rightOnly: [],
            });
        });
        await (0, node_test_1.it)("computes the overlap of partly empty iterables", () => {
            node_assert_1.default.deepStrictEqual((0, set_1.computeOverlap)(new Set([3, 2, 1]), []), {
                intersection: [],
                leftOnly: [3, 2, 1],
                rightOnly: [],
            });
        });
        await (0, node_test_1.it)("computes the overlap of empty iterables", () => {
            node_assert_1.default.deepStrictEqual((0, set_1.computeOverlap)(new Set(), []), {
                intersection: [],
                leftOnly: [],
                rightOnly: [],
            });
        });
    });
});
