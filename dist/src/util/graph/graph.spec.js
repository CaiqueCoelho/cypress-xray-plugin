"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const graph_1 = require("./graph");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(graph_1.SimpleDirectedGraph.name, async () => {
        let graph = new graph_1.SimpleDirectedGraph();
        (0, node_test_1.beforeEach)(() => {
            graph = new graph_1.SimpleDirectedGraph();
            graph.place(0);
            graph.place(1);
            graph.place(2);
            graph.place(3);
            graph.place(4);
            graph.connect(0, 1);
            graph.connect(0, 2);
            graph.connect(0, 3);
            graph.connect(2, 4);
        });
        await (0, node_test_1.describe)(graph.place.name, async () => {
            await (0, node_test_1.it)("adds vertices", () => {
                graph.place(7);
                node_assert_1.default.deepStrictEqual([...graph.getVertices()], [0, 1, 2, 3, 4, 7]);
            });
            await (0, node_test_1.it)("detects duplicates", () => {
                graph.place(5);
                node_assert_1.default.throws(() => {
                    graph.place(5);
                }, { message: "Duplicate vertex detected: 5" });
            });
        });
        await (0, node_test_1.describe)(graph.connect.name, async () => {
            await (0, node_test_1.it)("connects to existing vertices", () => {
                graph.place(5);
                graph.connect(0, 5);
                node_assert_1.default.deepStrictEqual([...graph.getOutgoing(0)], [
                    new graph_1.SimpleDirectedEdge(0, 1),
                    new graph_1.SimpleDirectedEdge(0, 2),
                    new graph_1.SimpleDirectedEdge(0, 3),
                    new graph_1.SimpleDirectedEdge(0, 5),
                ]);
            });
            await (0, node_test_1.it)("detects unknown source vertices", () => {
                node_assert_1.default.throws(() => {
                    graph.connect(42, 0);
                }, { message: "Failed to connect vertices: the source vertex does not exist" });
            });
            await (0, node_test_1.it)("detects unknown destination vertices", () => {
                node_assert_1.default.throws(() => {
                    graph.connect(0, 42);
                }, { message: "Failed to connect vertices: the destination vertex does not exist" });
            });
            await (0, node_test_1.it)("detects cycles", () => {
                node_assert_1.default.throws(() => {
                    graph.connect(4, 2);
                }, { message: "Failed to connect vertices 4 -> 2: cycle detected" });
            });
            await (0, node_test_1.it)("detects duplicates", () => {
                graph.place(8);
                graph.connect(0, 8);
                node_assert_1.default.throws(() => {
                    graph.connect(0, 8);
                }, { message: "Failed to connect vertices 0 -> 8: duplicate edge detected" });
            });
            await (0, node_test_1.it)("detects self loops", () => {
                node_assert_1.default.throws(() => {
                    graph.connect(0, 0);
                }, { message: "Failed to connect vertices 0 -> 0: cycle detected" });
            });
        });
        await (0, node_test_1.describe)(graph.find.name, async () => {
            await (0, node_test_1.it)("finds vertices", () => {
                node_assert_1.default.strictEqual(graph.find((vertex) => vertex === 3), 3);
            });
            await (0, node_test_1.it)("does not find nonexistent vertices", () => {
                node_assert_1.default.strictEqual(graph.find((vertex) => vertex === 6), undefined);
            });
        });
        await (0, node_test_1.describe)(graph.getVertices.name, async () => {
            await (0, node_test_1.it)("returns all vertices", () => {
                node_assert_1.default.deepStrictEqual([...graph.getVertices()], [0, 1, 2, 3, 4]);
            });
        });
        await (0, node_test_1.describe)(graph.getEdges.name, async () => {
            await (0, node_test_1.it)("returns all edges", () => {
                node_assert_1.default.deepStrictEqual([...graph.getEdges()], [
                    new graph_1.SimpleDirectedEdge(0, 1),
                    new graph_1.SimpleDirectedEdge(0, 2),
                    new graph_1.SimpleDirectedEdge(0, 3),
                    new graph_1.SimpleDirectedEdge(2, 4),
                ]);
            });
        });
        await (0, node_test_1.describe)(graph.size.name, async () => {
            await (0, node_test_1.it)("returns the vertex set cardinality", () => {
                node_assert_1.default.strictEqual(graph.size("vertices"), 5);
            });
            await (0, node_test_1.it)("returns the edge set cardinality", () => {
                node_assert_1.default.strictEqual(graph.size("edges"), 4);
            });
        });
        await (0, node_test_1.describe)(graph.getOutgoing.name, async () => {
            await (0, node_test_1.it)("returns the outgoing edges of a vertex", () => {
                node_assert_1.default.deepStrictEqual([...graph.getOutgoing(0)], [
                    new graph_1.SimpleDirectedEdge(0, 1),
                    new graph_1.SimpleDirectedEdge(0, 2),
                    new graph_1.SimpleDirectedEdge(0, 3),
                ]);
            });
            await (0, node_test_1.it)("returns empty arrays for leaf nodes", () => {
                node_assert_1.default.deepStrictEqual([...graph.getOutgoing(4)], []);
            });
            await (0, node_test_1.it)("throws for nonexistent nodes", () => {
                node_assert_1.default.throws(() => [...graph.getOutgoing(10)], { message: "Unknown vertex: 10" });
            });
        });
        await (0, node_test_1.describe)(graph.getIncoming.name, async () => {
            await (0, node_test_1.it)("returns the incoming edges of a vertex", () => {
                node_assert_1.default.deepStrictEqual([...graph.getIncoming(3)], [new graph_1.SimpleDirectedEdge(0, 3)]);
            });
            await (0, node_test_1.it)("returns empty arrays for root nodes", () => {
                node_assert_1.default.deepStrictEqual([...graph.getIncoming(0)], []);
            });
            await (0, node_test_1.it)("throws for nonexistent nodes", () => {
                node_assert_1.default.throws(() => [...graph.getIncoming(10)], { message: "Unknown vertex: 10" });
            });
        });
        await (0, node_test_1.describe)(graph.hasOutgoing.name, async () => {
            await (0, node_test_1.it)("returns true for vertices with outgoing edges", () => {
                node_assert_1.default.strictEqual(graph.hasOutgoing(0), true);
            });
            await (0, node_test_1.it)("returns false for vertices without outgoing edges", () => {
                node_assert_1.default.strictEqual(graph.hasOutgoing(4), false);
            });
            await (0, node_test_1.it)("throws for nonexistent nodes", () => {
                node_assert_1.default.throws(() => graph.hasOutgoing(10), { message: "Unknown vertex: 10" });
            });
        });
        await (0, node_test_1.describe)(graph.hasIncoming.name, async () => {
            await (0, node_test_1.it)("returns true for vertices with incoming edges", () => {
                node_assert_1.default.strictEqual(graph.hasIncoming(1), true);
            });
            await (0, node_test_1.it)("returns false for vertices without incoming edges", () => {
                node_assert_1.default.strictEqual(graph.hasIncoming(0), false);
            });
            await (0, node_test_1.it)("throws for nonexistent nodes", () => {
                node_assert_1.default.throws(() => graph.hasIncoming(10), { message: "Unknown vertex: 10" });
            });
        });
    });
    await (0, node_test_1.describe)("edge", async () => {
        const edge = new graph_1.SimpleDirectedEdge("abc", "def");
        await (0, node_test_1.describe)(edge.getSource.name, async () => {
            await (0, node_test_1.it)("returns the source vertex", () => {
                node_assert_1.default.strictEqual(edge.getSource(), "abc");
            });
        });
        await (0, node_test_1.describe)(edge.getDestination.name, async () => {
            await (0, node_test_1.it)("returns the destination vertex", () => {
                node_assert_1.default.strictEqual(edge.getDestination(), "def");
            });
        });
    });
});
