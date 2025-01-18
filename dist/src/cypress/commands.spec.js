"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = __importDefault(require("node:path"));
const node_process_1 = __importDefault(require("node:process"));
const node_test_1 = require("node:test");
const mocks_1 = require("../../test/mocks");
(0, node_test_1.describe)(node_path_1.default.relative(node_process_1.default.cwd(), __filename), () => {
    (0, node_test_1.beforeEach)(() => {
        const resolved = require.resolve(`${__dirname}/commands`);
        if (resolved in require.cache) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete require.cache[resolved];
        }
    });
    (0, node_test_1.it)("overwrites the cy.request command on import", async (context) => {
        const overwriteSpy = context.mock.fn((name) => {
            node_assert_1.default.strictEqual(name, "request");
        });
        (0, mocks_1.getMockedCypress)().cypress.Commands.overwrite = overwriteSpy;
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        await require("./commands");
        node_assert_1.default.strictEqual(overwriteSpy.mock.callCount(), 1);
    });
});
