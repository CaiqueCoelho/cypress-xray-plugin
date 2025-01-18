"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_test_1 = require("node:test");
const reporters_1 = require("node:test/reporters");
const server_1 = require("./server");
const util_1 = require("./util");
const SRC_DIR = (0, node_path_1.resolve)("src");
const TEST_STREAM = (0, node_test_1.run)({
    concurrency: true,
    files: (0, util_1.findFiles)(SRC_DIR, (name) => name.endsWith(".spec.ts")),
})
    .once("test:fail", () => {
    process.exitCode = 1;
})
    .once("readable", () => {
    (0, server_1.startServer)();
})
    .once("end", () => {
    (0, server_1.stopServer)();
});
TEST_STREAM.compose(reporters_1.junit).pipe((0, node_fs_1.createWriteStream)("unit.xml", "utf-8"));
TEST_STREAM.pipe((0, reporters_1.spec)()).pipe(process.stdout);
