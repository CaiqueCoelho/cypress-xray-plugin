"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const command_1 = require("../../hooks/command");
const errors_1 = require("../errors");
const executable_graph_1 = require("./executable-graph");
class ComputableVertex {
    constructor(message, logger) {
        this.state = command_1.ComputableState.INITIAL;
        this.message = message;
        this.logger = logger;
    }
    compute() {
        this.logger(this.message);
    }
    getState() {
        return this.state;
    }
    setState(state) {
        this.state = state;
    }
    toString() {
        return this.message;
    }
}
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(executable_graph_1.ExecutableGraph.name, async () => {
        await (0, node_test_1.it)("executes vertices in post-order", async () => {
            const messages = [];
            const logger = (message) => messages.push(message);
            const g = new executable_graph_1.ExecutableGraph();
            const v1 = g.place(new ComputableVertex("vertex 1", logger));
            const v2 = g.place(new ComputableVertex("vertex 2", logger));
            const v3 = g.place(new ComputableVertex("vertex 3", logger));
            const v4 = g.place(new ComputableVertex("vertex 4", logger));
            g.connect(v2, v1);
            g.connect(v1, v3);
            g.connect(v2, v4);
            g.connect(v4, v1);
            await g.execute();
            node_assert_1.default.deepStrictEqual(messages, ["vertex 2", "vertex 4", "vertex 1", "vertex 3"]);
        });
        await (0, node_test_1.it)("does not execute successors on partial failure", async () => {
            const messages = [];
            const logger = (message) => {
                if (message === "vertex 1") {
                    throw new Error(`Error in ${message}`);
                }
                messages.push(message);
            };
            const g = new executable_graph_1.ExecutableGraph();
            const v1 = g.place(new ComputableVertex("vertex 1", logger));
            const v2 = g.place(new ComputableVertex("vertex 2", logger));
            const v3 = g.place(new ComputableVertex("vertex 3", logger));
            const v4 = g.place(new ComputableVertex("vertex 4", logger));
            g.connect(v2, v1);
            g.connect(v1, v3);
            g.connect(v2, v4);
            g.connect(v4, v1);
            await g.execute();
            node_assert_1.default.deepStrictEqual(messages, ["vertex 2", "vertex 4"]);
        });
        await (0, node_test_1.it)("does not execute successors on full failure", async () => {
            const messages = [];
            const logger = (message) => {
                if (message === "vertex 1" || message === "vertex 4") {
                    throw new Error(`Error in ${message}`);
                }
                messages.push(message);
            };
            const g = new executable_graph_1.ExecutableGraph();
            const v1 = g.place(new ComputableVertex("vertex 1", logger));
            const v2 = g.place(new ComputableVertex("vertex 2", logger));
            const v3 = g.place(new ComputableVertex("vertex 3", logger));
            const v4 = g.place(new ComputableVertex("vertex 4", logger));
            g.connect(v2, v1);
            g.connect(v1, v3);
            g.connect(v2, v4);
            g.connect(v4, v3);
            await g.execute();
            node_assert_1.default.deepStrictEqual(messages, ["vertex 2"]);
        });
        await (0, node_test_1.it)("does not execute successors on skip", async () => {
            const messages = [];
            const logger = (message) => {
                if (message === "vertex 1") {
                    throw new errors_1.SkippedError(`Error in ${message}`);
                }
                messages.push(message);
            };
            const g = new executable_graph_1.ExecutableGraph();
            const v1 = g.place(new ComputableVertex("vertex 1", logger));
            const v2 = g.place(new ComputableVertex("vertex 2", logger));
            const v3 = g.place(new ComputableVertex("vertex 3", logger));
            const v4 = g.place(new ComputableVertex("vertex 4", logger));
            g.connect(v2, v1);
            g.connect(v1, v3);
            g.connect(v2, v4);
            g.connect(v4, v1);
            await g.execute();
            node_assert_1.default.deepStrictEqual(messages, ["vertex 2", "vertex 4"]);
        });
        await (0, node_test_1.it)("still executes successors on failure if marked as optional", async () => {
            const messages = [];
            const logger = (message) => {
                if (message === "vertex 1") {
                    throw new Error(`Error in ${message}`);
                }
                messages.push(message);
            };
            const g = new executable_graph_1.ExecutableGraph();
            const v1 = g.place(new ComputableVertex("vertex 1", logger));
            const v2 = g.place(new ComputableVertex("vertex 2", logger));
            const v3 = g.place(new ComputableVertex("vertex 3", logger));
            const v4 = g.place(new ComputableVertex("vertex 4", logger));
            g.connect(v2, v1);
            g.connect(v1, v3, true);
            g.connect(v2, v4);
            g.connect(v4, v1);
            g.connect(v4, v3);
            await g.execute();
            node_assert_1.default.deepStrictEqual(messages, ["vertex 2", "vertex 4", "vertex 3"]);
        });
        await (0, node_test_1.it)("still executes successors on skip if marked as optional", async () => {
            const messages = [];
            const logger = (message) => {
                if (message === "vertex 1") {
                    throw new errors_1.SkippedError(`Error in ${message}`);
                }
                messages.push(message);
            };
            const g = new executable_graph_1.ExecutableGraph();
            const v1 = g.place(new ComputableVertex("vertex 1", logger));
            const v2 = g.place(new ComputableVertex("vertex 2", logger));
            const v3 = g.place(new ComputableVertex("vertex 3", logger));
            const v4 = g.place(new ComputableVertex("vertex 4", logger));
            g.connect(v2, v1);
            g.connect(v1, v3, true);
            g.connect(v2, v4);
            g.connect(v4, v1);
            await g.execute();
            node_assert_1.default.deepStrictEqual(messages, ["vertex 2", "vertex 4", "vertex 3"]);
        });
    });
});
