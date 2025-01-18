"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const queue_1 = require("./queue");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    let queue = new queue_1.Queue();
    (0, node_test_1.beforeEach)(() => {
        queue = new queue_1.Queue();
    });
    await (0, node_test_1.describe)(queue.enqueue.name, async () => {
        await (0, node_test_1.it)("enqueues elements", () => {
            queue.enqueue(10);
            node_assert_1.default.strictEqual(queue.peek(), 10);
            queue.enqueue(15);
            node_assert_1.default.strictEqual(queue.peek(), 10);
        });
    });
    await (0, node_test_1.describe)(queue.dequeue.name, async () => {
        await (0, node_test_1.it)("dequeues elements", () => {
            queue
                .enqueue(0)
                .enqueue(1)
                .enqueue(2)
                .enqueue(3)
                .enqueue(4)
                .enqueue(5)
                .enqueue(6)
                .enqueue(7)
                .enqueue(8);
            node_assert_1.default.strictEqual(queue.dequeue(), 0);
            node_assert_1.default.strictEqual(queue.dequeue(), 1);
            node_assert_1.default.strictEqual(queue.dequeue(), 2);
            node_assert_1.default.strictEqual(queue.dequeue(), 3);
            node_assert_1.default.strictEqual(queue.dequeue(), 4);
            node_assert_1.default.strictEqual(queue.dequeue(), 5);
            node_assert_1.default.strictEqual(queue.dequeue(), 6);
            node_assert_1.default.strictEqual(queue.dequeue(), 7);
            node_assert_1.default.strictEqual(queue.dequeue(), 8);
        });
        await (0, node_test_1.it)("throws if the queue is empty", () => {
            node_assert_1.default.throws(() => queue.dequeue(), { message: "Queue is empty" });
        });
    });
    await (0, node_test_1.describe)(queue.peek.name, async () => {
        await (0, node_test_1.it)("peeks elements", () => {
            queue.enqueue(0);
            node_assert_1.default.strictEqual(queue.peek(), 0);
            queue.enqueue(1);
            node_assert_1.default.strictEqual(queue.peek(), 0);
            queue.enqueue(2);
            node_assert_1.default.strictEqual(queue.peek(), 0);
        });
        await (0, node_test_1.it)("throws if the queue is empty", () => {
            node_assert_1.default.throws(() => queue.peek(), { message: "Queue is empty" });
        });
    });
    await (0, node_test_1.describe)(queue.size.name, async () => {
        await (0, node_test_1.it)("computes the size", () => {
            node_assert_1.default.strictEqual(queue.size(), 0);
            queue.enqueue(0);
            node_assert_1.default.strictEqual(queue.size(), 1);
            queue.enqueue(1);
            node_assert_1.default.strictEqual(queue.size(), 2);
            queue.dequeue();
            node_assert_1.default.strictEqual(queue.size(), 1);
            queue.dequeue();
            node_assert_1.default.strictEqual(queue.size(), 0);
        });
    });
    await (0, node_test_1.describe)(queue.has.name, async () => {
        await (0, node_test_1.it)("returns true for known elements", () => {
            queue
                .enqueue(0)
                .enqueue(1)
                .enqueue(2)
                .enqueue(3)
                .enqueue(4)
                .enqueue(5)
                .enqueue(6)
                .enqueue(7)
                .enqueue(8);
            node_assert_1.default.strictEqual(queue.has(0), true);
            node_assert_1.default.strictEqual(queue.has(1), true);
            node_assert_1.default.strictEqual(queue.has(2), true);
            node_assert_1.default.strictEqual(queue.has(3), true);
            node_assert_1.default.strictEqual(queue.has(4), true);
            node_assert_1.default.strictEqual(queue.has(5), true);
            node_assert_1.default.strictEqual(queue.has(6), true);
            node_assert_1.default.strictEqual(queue.has(7), true);
            node_assert_1.default.strictEqual(queue.has(8), true);
        });
        await (0, node_test_1.it)("returns false for unknown elements", () => {
            queue.enqueue(0).enqueue(1).enqueue(2);
            node_assert_1.default.strictEqual(queue.has(4), false);
        });
    });
    await (0, node_test_1.describe)(queue.find.name, async () => {
        await (0, node_test_1.it)("finds elements", () => {
            queue.enqueue(0).enqueue(1).enqueue(2);
            node_assert_1.default.strictEqual(queue.find((e) => e === 0), 0);
            node_assert_1.default.strictEqual(queue.find((e) => e === 1), 1);
            node_assert_1.default.strictEqual(queue.find((e) => e === 2), 2);
        });
        await (0, node_test_1.it)("does not find nonexistent elements", () => {
            queue.enqueue(0).enqueue(1).enqueue(2);
            node_assert_1.default.strictEqual(queue.find((e) => e === 4), undefined);
        });
    });
    await (0, node_test_1.describe)(queue.isEmpty.name, async () => {
        await (0, node_test_1.it)("computes the emptiness", () => {
            node_assert_1.default.strictEqual(queue.isEmpty(), true);
            queue.enqueue(0);
            node_assert_1.default.strictEqual(queue.isEmpty(), false);
            queue.enqueue(1);
            node_assert_1.default.strictEqual(queue.isEmpty(), false);
            queue.dequeue();
            node_assert_1.default.strictEqual(queue.isEmpty(), false);
            queue.dequeue();
            node_assert_1.default.strictEqual(queue.isEmpty(), true);
        });
    });
});
