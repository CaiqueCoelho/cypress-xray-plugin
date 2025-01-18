"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggedRequest = loggedRequest;
const errors_1 = require("../util/errors");
const logging_1 = require("../util/logging");
/**
 * Decorates the method with an error handler which automatically logs errors and rethrows
 * afterwards.
 *
 * @param parameters - decorator parameters
 * @returns the decorated method
 *
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#writing-well-typed-decorators
 * @see https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories
 */
function loggedRequest(parameters) {
    return function decoratorFunction(target, context) {
        const methodName = String(context.name);
        const decorated = async function (...args) {
            try {
                return await target.call(this, ...args);
            }
            catch (error) {
                logging_1.LOG.message(logging_1.Level.ERROR, `Failed to ${parameters.purpose}: ${(0, errors_1.errorMessage)(error)}`);
                logging_1.LOG.logErrorToFile(error, `${methodName}Error`);
                throw new errors_1.LoggedError(`Failed to ${parameters.purpose}`);
            }
        };
        return decorated;
    };
}
