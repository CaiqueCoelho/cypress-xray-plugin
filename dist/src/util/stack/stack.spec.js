"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const stack_1 = require("./stack");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    let stack = new stack_1.Stack();
    (0, node_test_1.beforeEach)(() => {
        stack = new stack_1.Stack();
    });
    await (0, node_test_1.describe)(stack.push.name, async () => {
        await (0, node_test_1.it)("pushes elements", () => {
            stack.push(10);
            node_assert_1.default.strictEqual(stack.top(), 10);
            stack.push(15);
            node_assert_1.default.strictEqual(stack.top(), 15);
        });
    });
    await (0, node_test_1.describe)(stack.pop.name, async () => {
        await (0, node_test_1.it)("pops elements", () => {
            stack.push(0).push(1).push(2).push(3).push(4);
            node_assert_1.default.strictEqual(stack.pop(), 4);
            node_assert_1.default.strictEqual(stack.pop(), 3);
            node_assert_1.default.strictEqual(stack.pop(), 2);
            node_assert_1.default.strictEqual(stack.pop(), 1);
            node_assert_1.default.strictEqual(stack.pop(), 0);
        });
        await (0, node_test_1.it)("throws if the stack is empty", () => {
            node_assert_1.default.throws(() => stack.pop(), { message: "Stack is empty" });
        });
    });
    await (0, node_test_1.describe)(stack.top.name, async () => {
        await (0, node_test_1.it)("returns the top element", () => {
            stack.push(0);
            node_assert_1.default.strictEqual(stack.top(), 0);
            stack.push(1);
            node_assert_1.default.strictEqual(stack.top(), 1);
            stack.push(2);
            node_assert_1.default.strictEqual(stack.top(), 2);
        });
        await (0, node_test_1.it)("throws if the stack is empty", () => {
            node_assert_1.default.throws(() => stack.top(), { message: "Stack is empty" });
        });
    });
    await (0, node_test_1.describe)(stack.size.name, async () => {
        await (0, node_test_1.it)("computes the size", () => {
            node_assert_1.default.strictEqual(stack.size(), 0);
            stack.push(0);
            node_assert_1.default.strictEqual(stack.size(), 1);
            stack.push(1);
            node_assert_1.default.strictEqual(stack.size(), 2);
            stack.pop();
            node_assert_1.default.strictEqual(stack.size(), 1);
            stack.pop();
            node_assert_1.default.strictEqual(stack.size(), 0);
        });
    });
    await (0, node_test_1.describe)(stack.has.name, async () => {
        await (0, node_test_1.it)("finds elements", () => {
            stack.push(0).push(1).push(2).push(3).push(4);
            node_assert_1.default.strictEqual(stack.has(0), true);
            node_assert_1.default.strictEqual(stack.has(1), true);
            node_assert_1.default.strictEqual(stack.has(2), true);
            node_assert_1.default.strictEqual(stack.has(3), true);
            node_assert_1.default.strictEqual(stack.has(4), true);
        });
        await (0, node_test_1.it)("does not find nonexistent elements", () => {
            stack.push(0).push(1).push(2);
            node_assert_1.default.strictEqual(stack.has(4), false);
        });
    });
    await (0, node_test_1.describe)(stack.isEmpty.name, async () => {
        await (0, node_test_1.it)("computes the emptiness", () => {
            node_assert_1.default.strictEqual(stack.isEmpty(), true);
            stack.push(0);
            node_assert_1.default.strictEqual(stack.isEmpty(), false);
            stack.push(1);
            node_assert_1.default.strictEqual(stack.isEmpty(), false);
            stack.pop();
            node_assert_1.default.strictEqual(stack.isEmpty(), false);
            stack.pop();
            node_assert_1.default.strictEqual(stack.isEmpty(), true);
        });
    });
});
