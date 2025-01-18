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
export declare function contains(actual: unknown, expected: unknown): boolean;
