"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const errors_1 = require("../util/errors");
const logging_1 = require("../util/logging");
const command_1 = require("./command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(command_1.Command.name, async () => {
        await (0, node_test_1.it)("computes the result on compute call", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            class ArithmeticCommand extends command_1.Command {
                constructor(x, ...operands) {
                    super(null, logging_1.LOG);
                    this.x = x;
                    this.operands = operands;
                }
                async computeResult() {
                    let result = this.x;
                    for (const operand of this.operands) {
                        result = result + (await operand.compute());
                    }
                    return result;
                }
            }
            const a = new ArithmeticCommand(50);
            const b = new ArithmeticCommand(40);
            const sum = new ArithmeticCommand(10, a, b);
            const resultPromise = sum.compute();
            await Promise.all([sum.compute(), a.compute(), b.compute()]);
            node_assert_1.default.strictEqual(await resultPromise, 100);
        });
        await (0, node_test_1.it)("returns the failure reason", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const error = new Error("Failure 123");
            class FailingCommand extends command_1.Command {
                computeResult() {
                    throw error;
                }
            }
            const command = new FailingCommand(null, logging_1.LOG);
            await node_assert_1.default.rejects(command.compute(), { message: "Failure 123" });
            node_assert_1.default.strictEqual(command.getFailure(), error);
            node_assert_1.default.strictEqual(command.getState(), command_1.ComputableState.FAILED);
        });
        await (0, node_test_1.it)("returns arbitrary failure reasons", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            class FailingCommand extends command_1.Command {
                computeResult() {
                    throw "Oh no someone messed up";
                }
            }
            const command = new FailingCommand(null, logging_1.LOG);
            await node_assert_1.default.rejects(command.compute(), { message: "Oh no someone messed up" });
            node_assert_1.default.deepStrictEqual(command.getFailure(), new Error("Oh no someone messed up"));
            node_assert_1.default.strictEqual(command.getState(), command_1.ComputableState.FAILED);
        });
        await (0, node_test_1.it)("returns the skip reason", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const error = new errors_1.SkippedError("Skip 123");
            class SkippingCommand extends command_1.Command {
                computeResult() {
                    throw error;
                }
            }
            const command = new SkippingCommand(null, logging_1.LOG);
            await node_assert_1.default.rejects(command.compute(), { message: "Skip 123" });
            node_assert_1.default.strictEqual(command.getFailure(), error);
            node_assert_1.default.strictEqual(command.getState(), command_1.ComputableState.SKIPPED);
        });
        await (0, node_test_1.it)("updates its state", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const eventEmitter = new events_1.default();
            class WaitingCommand extends command_1.Command {
                computeResult() {
                    return new Promise((resolve) => {
                        eventEmitter.once("go", () => {
                            resolve(42);
                        });
                    });
                }
            }
            const command = new WaitingCommand(null, logging_1.LOG);
            node_assert_1.default.strictEqual(command.getState(), command_1.ComputableState.INITIAL);
            const computePromise = command.compute();
            node_assert_1.default.strictEqual(command.getState(), command_1.ComputableState.PENDING);
            // Await something to force the event loop to go back to the computeResult() method.
            await new Promise((resolve) => {
                resolve();
            });
            eventEmitter.emit("go");
            node_assert_1.default.strictEqual(await computePromise, 42);
            node_assert_1.default.strictEqual(command.getState(), command_1.ComputableState.SUCCEEDED);
        });
        await (0, node_test_1.it)("computes its result only once", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            class ComputingCommand extends command_1.Command {
                constructor() {
                    super(...arguments);
                    this.hasComputed = false;
                }
                computeResult() {
                    if (!this.hasComputed) {
                        this.hasComputed = true;
                        return new Promise((resolve) => {
                            resolve(42);
                        });
                    }
                    return new Promise((resolve) => {
                        resolve(0);
                    });
                }
            }
            const command = new ComputingCommand(null, logging_1.LOG);
            node_assert_1.default.strictEqual(await command.compute(), 42);
            node_assert_1.default.strictEqual(await command.compute(), 42);
        });
        await (0, node_test_1.it)("returns the LOG", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            class SomeCommand extends command_1.Command {
                computeResult() {
                    return new Promise((resolve) => {
                        resolve("ok");
                    });
                }
            }
            const command = new SomeCommand(null, logging_1.LOG);
            node_assert_1.default.strictEqual(command.getLogger(), logging_1.LOG);
        });
    });
});
