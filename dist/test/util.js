"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_TMP_DIR = void 0;
exports.resolveTestDirPath = resolveTestDirPath;
exports.findFiles = findFiles;
exports.assertIsInstanceOf = assertIsInstanceOf;
exports.mockedCypressEventEmitter = mockedCypressEventEmitter;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const node_fs_1 = require("node:fs");
const node_test_1 = require("node:test");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const string_1 = require("../src/util/string");
exports.TEST_TMP_DIR = path_1.default.join(os_1.default.tmpdir(), "cypress-xray-plugin");
console.log(ansi_colors_1.default.gray(`Temporary directory: ${exports.TEST_TMP_DIR}`));
function resolveTestDirPath(...subPaths) {
    return path_1.default.resolve(exports.TEST_TMP_DIR, ...subPaths);
}
// Clean up temporary directory before all tests.
(0, node_test_1.before)(() => {
    if ((0, node_fs_1.existsSync)(exports.TEST_TMP_DIR)) {
        (0, node_fs_1.rmSync)(exports.TEST_TMP_DIR, { recursive: true });
    }
});
/**
 * Recursively returns all files in the given directory that match the provided filename filter.
 *
 * @param dir - the entry directory
 * @param filter - the filename filter
 * @returns all matching files
 */
function findFiles(dir, filter) {
    const files = (0, node_fs_1.readdirSync)(dir, { withFileTypes: true });
    let testFiles = [];
    for (const file of files) {
        const fullPath = path_1.default.join(dir, file.name);
        if (file.isDirectory()) {
            testFiles = testFiles.concat(findFiles(fullPath, filter));
        }
        else if (file.isFile() && filter(file.name)) {
            testFiles.push(fullPath);
        }
    }
    return testFiles;
}
/**
 * Use in place of `expect(value).to.be.an.instanceOf(class)`.
 *
 * Work-around for Chai assertions not being recognized by TypeScript's control flow analysis.
 *
 * @param value - the value
 * @param className - the instance type
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function assertIsInstanceOf(value, className) {
    if (!(value instanceof className)) {
        if (typeof value === "object" && value) {
            throw new Error(`${value.constructor.name} is not an instance of ${className.name}`);
        }
        throw new Error(`Value is not an instance of ${className.name}: ${(0, string_1.unknownToString)(value)}`);
    }
}
function mockedCypressEventEmitter(expectedAction, ...args) {
    const eventListener = (action, fn) => {
        if (action !== expectedAction) {
            return;
        }
        switch (action) {
            case "after:run": {
                const f = fn;
                const parameters = args;
                f(...parameters).catch((error) => {
                    throw error;
                });
                break;
            }
            default:
        }
    };
    return eventListener;
}
