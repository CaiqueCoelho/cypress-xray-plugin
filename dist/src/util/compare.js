"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contains = contains;
/**
 * Checks whether a value contains another value. If both are arrays, the actual array must deeply
 * contain all elements of the expected array. If both are objects, the actual object must deeply
 * contain all properties of the expected object. Defaults to primitive equality comparison for all
 * other types.
 *
 * @param actual - the actual value
 * @param expected - the expected value
 * @returns `true` if `actual` contains `expected`
 */
function contains(actual, expected) {
    if (typeof actual === "bigint" ||
        typeof actual === "boolean" ||
        typeof actual === "function" ||
        typeof actual === "number" ||
        typeof actual === "string" ||
        typeof actual === "symbol" ||
        typeof actual === "undefined") {
        return actual === expected;
    }
    else if (Array.isArray(expected)) {
        if (Array.isArray(actual)) {
            return containsArray(actual, expected);
        }
    }
    else if (typeof actual === "object") {
        if (typeof expected === "object") {
            if (actual === null || expected === null) {
                return actual === expected;
            }
            return containsObject(actual, expected);
        }
    }
    return false;
}
function containsArray(actual, expected) {
    for (const elementExpected of expected) {
        let containsElement = false;
        for (const elementActual of actual) {
            if (contains(elementActual, elementExpected)) {
                containsElement = true;
                break;
            }
        }
        if (!containsElement) {
            return false;
        }
    }
    return true;
}
function containsObject(actual, expected) {
    const entriesActual = Object.entries(actual);
    const entriesExpected = Object.entries(expected);
    for (const [keyExpected, valueExpected] of entriesExpected) {
        let containsKey = false;
        for (const [keyActual, valueActual] of entriesActual) {
            if (keyActual === keyExpected) {
                containsKey = true;
                if (!contains(valueActual, valueExpected)) {
                    return false;
                }
                break;
            }
        }
        if (!containsKey) {
            return false;
        }
    }
    return true;
}
