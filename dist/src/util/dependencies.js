"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./logging");
/**
 * Imports and returns an optional dependency.
 *
 * @param packageName - the dependency's package name
 * @returns the dependency
 */
async function importOptionalDependency(packageName) {
    const dependency = await EXPORTS._import(packageName);
    logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully imported optional dependency: ${packageName}`);
    return dependency;
}
/**
 * Workaround until module mocking becomes a stable feature. The current approach allows replacing
 * the `_import` function with a mocked one.
 *
 * @see https://nodejs.org/docs/latest-v23.x/api/test.html#mockmodulespecifier-options
 */
const EXPORTS = {
    /**
     * Dynamically imports a package.
     *
     * *Note: This function is mainly used for stubbing purposes only, since `import` cannot be stubbed
     * as it's not a function. You should probably use safer alternatives like
     * {@link importOptionalDependency | `importOptionalDependency`}.*
     *
     * @param packageName - the name of the package to import
     * @returns the package
     */
    ["_import"]: async (packageName) => (await import(packageName)),
    importOptionalDependency,
};
exports.default = EXPORTS;
