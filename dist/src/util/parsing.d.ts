/**
 * Parses and returns a boolean value from a string.
 *
 * @param value - a string that can be interpreted as a boolean value
 * @returns the corresponding boolean value
 * @see https://www.npmjs.com/package/yn
 */
export declare function asBoolean(value: string): boolean;
/**
 * No-op function for consistency purposes.
 *
 * @param value - the string
 * @returns the string
 */
export declare function asString(value: string): string;
/**
 * Parses and returns a float value from a string.
 *
 * @param value - a string that can be interpreted as a float value
 * @returns the corresponding float value
 */
export declare function asFloat(value: string): number;
/**
 * Parses and returns an integer value from a string.
 *
 * @param value - a string that can be interpreted as an integer value
 * @returns the corresponding integer value
 */
export declare function asInt(value: string): number;
/**
 * Parses and returns an array of strings from an unknown value. If the value is not an array,
 * contains zero elements or non-primitive elements, corresponding errors will be thrown.
 *
 * @param value - a string that can be interpreted as a string array
 * @returns the corresponding string array
 */
export declare function asArrayOfStrings(value: unknown): [string, ...string[]];
/**
 * Parses and returns an object from an unknown value. If the value is not an object, corresponding
 * errors will be thrown.
 *
 * @param value - a string that can be interpreted as an object
 * @returns the corresponding object
 */
export declare function asObject(value: unknown): object;
/**
 * Parses an environment variable to arbitrary data types.
 *
 * @param env - the object holding all environment variables as key-value pairs
 * @param variable - the variable name
 * @param parser - the parsing function
 * @returns the parsed data or undefined if the variable does not exist
 */
export declare function parse<T>(env: Cypress.ObjectLike, variable: string, parser: (parameter: string) => T): T | undefined;
