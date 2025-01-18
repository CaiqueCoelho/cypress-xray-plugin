"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const dependencies_1 = __importDefault(require("./dependencies"));
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.it)("throws if a package is not installed", async () => {
        await node_assert_1.default.rejects(dependencies_1.default.importOptionalDependency("nonexistent"), {
            message: `Cannot find package 'nonexistent' imported from ${(0, node_path_1.resolve)(".", "src", "util", "dependencies.ts")}`,
        });
    });
    await (0, node_test_1.it)("imports @badeball/cypress-cucumber-preprocessor", async () => {
        const members = await dependencies_1.default.importOptionalDependency("@badeball/cypress-cucumber-preprocessor");
        node_assert_1.default.ok(members.resolvePreprocessorConfiguration !== undefined);
    });
});
