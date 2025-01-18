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
const search_1 = require("./search");
class Vertex {
    constructor(id) {
        this.vertexId = id;
    }
    id() {
        return this.vertexId;
    }
}
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    const graph = new graph_1.SimpleDirectedGraph();
    const v0 = graph.place(new Vertex(0));
    const v1 = graph.place(new Vertex(1));
    const v2 = graph.place(new Vertex(2));
    const v3 = graph.place(new Vertex(3));
    const v4 = graph.place(new Vertex(4));
    const v5 = graph.place(new Vertex(5));
    const v6 = graph.place(new Vertex(6));
    const v7 = graph.place(new Vertex(7));
    const v8 = graph.place(new Vertex(8));
    const v9 = graph.place(new Vertex(9));
    graph.connect(v1, v2);
    graph.connect(v1, v5);
    graph.connect(v1, v7);
    graph.connect(v2, v5);
    graph.connect(v3, v8);
    graph.connect(v4, v5);
    graph.connect(v4, v8);
    graph.connect(v5, v6);
    graph.connect(v8, v0);
    graph.connect(v8, v6);
    graph.connect(v8, v7);
    graph.connect(v6, v9);
    graph.connect(v9, v7);
    await (0, node_test_1.describe)(search_1.bfs.name, async () => {
        await (0, node_test_1.it)("finds vertices by reference", () => {
            node_assert_1.default.strictEqual((0, search_1.bfs)(graph, {
                destination: v9,
                source: v1,
            }), true);
        });
        await (0, node_test_1.it)("does not find nonexistent vertices by reference", () => {
            node_assert_1.default.strictEqual((0, search_1.bfs)(graph, {
                destination: new Vertex(17),
                source: v1,
            }), false);
        });
        await (0, node_test_1.it)("does not find unreachable vertices by reference", () => {
            node_assert_1.default.strictEqual((0, search_1.bfs)(graph, {
                destination: v0,
                source: v1,
            }), false);
        });
        await (0, node_test_1.it)("finds vertices by filtering", () => {
            node_assert_1.default.strictEqual((0, search_1.bfs)(graph, {
                filter: (vertex) => vertex.id() === 6,
                source: v1,
            }), true);
        });
        await (0, node_test_1.it)("does not find nonexistent vertices by filtering", () => {
            node_assert_1.default.strictEqual((0, search_1.bfs)(graph, {
                filter: (vertex) => vertex.id() === 17,
                source: v1,
            }), false);
        });
        await (0, node_test_1.it)("does not find unreachable vertices by filtering", () => {
            node_assert_1.default.strictEqual((0, search_1.bfs)(graph, {
                filter: (vertex) => vertex.id() === 0,
                source: v1,
            }), false);
        });
        await (0, node_test_1.it)("finds vertices anywhere by reference", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                destination: v0,
            }), true);
        });
        await (0, node_test_1.it)("finds vertices anywhere by filtering", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                filter: (vertex) => vertex.id() === 0,
            }), true);
        });
        await (0, node_test_1.it)("finds the starting vertex by reference", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                destination: v0,
                source: v0,
            }), true);
        });
        await (0, node_test_1.it)("finds the starting vertex by filtering", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                filter: (vertex) => vertex.id() === 0,
                source: v0,
            }), true);
        });
    });
    await (0, node_test_1.describe)(search_1.dfs.name, async () => {
        await (0, node_test_1.it)("finds vertices by reference", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                destination: v9,
                source: v1,
            }), true);
        });
        await (0, node_test_1.it)("does not find nonexistent vertices by reference", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                destination: new Vertex(17),
                source: v1,
            }), false);
        });
        await (0, node_test_1.it)("does not find unreachable vertices by reference", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                destination: v0,
                source: v1,
            }), false);
        });
        await (0, node_test_1.it)("finds vertices by filtering", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                filter: (vertex) => vertex.id() === 6,
                source: v1,
            }), true);
        });
        await (0, node_test_1.it)("does not find nonexistent vertices by filtering", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                filter: (vertex) => vertex.id() === 17,
                source: v1,
            }), false);
        });
        await (0, node_test_1.it)("does not find unreachable vertices by filtering", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                filter: (vertex) => vertex.id() === 0,
                source: v1,
            }), false);
        });
        await (0, node_test_1.it)("finds vertices anywhere by reference", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                destination: v0,
            }), true);
        });
        await (0, node_test_1.it)("finds vertices anywhere by filtering", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                filter: (vertex) => vertex.id() === 0,
            }), true);
        });
        await (0, node_test_1.it)("finds the starting vertex by reference", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                destination: v0,
                source: v0,
            }), true);
        });
        await (0, node_test_1.it)("finds the starting vertex by filtering", () => {
            node_assert_1.default.strictEqual((0, search_1.dfs)(graph, {
                filter: (vertex) => vertex.id() === 0,
                source: v0,
            }), true);
        });
    });
});
