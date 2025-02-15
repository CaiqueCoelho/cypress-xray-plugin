"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const graph_1 = require("../graph");
const sort_1 = require("./sort");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(sort_1.computeTopologicalOrder.name, async () => {
        await (0, node_test_1.it)("computes the order for directed graphs", () => {
            const graph = new graph_1.SimpleDirectedGraph();
            graph.place(0);
            graph.place(1);
            graph.place(2);
            graph.place(3);
            graph.place(4);
            graph.place(5);
            graph.place(6);
            graph.place(7);
            graph.place(8);
            graph.place(9);
            graph.connect(1, 2);
            graph.connect(1, 5);
            graph.connect(1, 7);
            graph.connect(2, 5);
            graph.connect(3, 8);
            graph.connect(4, 5);
            graph.connect(4, 8);
            graph.connect(5, 6);
            graph.connect(8, 0);
            graph.connect(8, 6);
            graph.connect(8, 7);
            graph.connect(6, 9);
            graph.connect(9, 7);
            node_assert_1.default.deepStrictEqual((0, sort_1.computeTopologicalOrder)(graph), new Map([
                [0, 2],
                [1, 0],
                [2, 1],
                [3, 0],
                [4, 0],
                [5, 2],
                [6, 3],
                [7, 5],
                [8, 1],
                [9, 4],
            ]));
        });
    });
    await (0, node_test_1.describe)(sort_1.traverse.name, async () => {
        await (0, node_test_1.it)("traverses forests top-down", () => {
            const graph = new graph_1.SimpleDirectedGraph();
            graph.place("A");
            graph.place("B");
            graph.place("C");
            graph.place("D");
            graph.place("E");
            graph.place("F");
            graph.place("P");
            graph.place("Q");
            graph.place("X");
            graph.place("Y");
            graph.place("Z");
            graph.connect("A", "B");
            graph.connect("A", "D");
            graph.connect("B", "C");
            graph.connect("D", "E");
            graph.connect("D", "F");
            graph.connect("P", "Q");
            graph.connect("X", "Y");
            graph.connect("X", "Z");
            node_assert_1.default.deepStrictEqual([...(0, sort_1.traverse)(graph, "top-down")], ["A", "P", "X", "B", "D", "Q", "Y", "Z", "C", "E", "F"]);
        });
        await (0, node_test_1.it)("traverses forests bottom-up", () => {
            const graph = new graph_1.SimpleDirectedGraph();
            graph.place("A");
            graph.place("B");
            graph.place("C");
            graph.place("D");
            graph.place("E");
            graph.place("F");
            graph.place("P");
            graph.place("Q");
            graph.place("X");
            graph.place("Y");
            graph.place("Z");
            graph.connect("A", "B");
            graph.connect("A", "D");
            graph.connect("B", "C");
            graph.connect("D", "E");
            graph.connect("D", "F");
            graph.connect("P", "Q");
            graph.connect("X", "Y");
            graph.connect("X", "Z");
            node_assert_1.default.deepStrictEqual([...(0, sort_1.traverse)(graph, "bottom-up")], ["C", "E", "F", "Q", "Y", "Z", "B", "D", "D", "P", "X", "X", "A", "A", "A"]);
        });
    });
});
