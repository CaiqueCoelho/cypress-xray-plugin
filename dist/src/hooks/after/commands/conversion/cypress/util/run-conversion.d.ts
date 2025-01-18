import type { RunResult as RunResult_V12 } from "../../../../../../types/cypress/12.0.0/api";
import type { CypressStatus } from "../../../../../../types/cypress/status";
/**
 * Test data extracted from Cypress tests, ready to be converted into an Xray JSON test.
 */
export interface SuccessfulConversion {
    /**
     * The duration of the test in milliseconds.
     */
    duration: number;
    /**
     * Denotes a successful test run conversion.
     */
    kind: "success";
    /**
     * Information about the spec the test was run in.
     */
    spec: {
        /**
         * The spec's file path.
         */
        filepath: string;
    };
    /**
     * When the test was started.
     */
    startedAt: Date;
    /**
     * The test's status.
     */
    status: CypressStatus;
    /**
     * The test's title.
     */
    title: string;
}
/**
 * Models a failed test run conversion.
 */
export interface FailedConversion {
    /**
     * The conversion failure.
     */
    error: unknown;
    /**
     * Denotes a failed test run conversion.
     */
    kind: "error";
}
/**
 * Converts a Cypress v12 (or before) run result into several {@link SuccessfulConversion} objects.
 *
 * @param runResult - the run result
 * @returns a mapping of test titles to their test data
 */
export declare function convertTestRuns_V12(runResult: RunResult_V12): Map<string, (FailedConversion | SuccessfulConversion)[]>;
/**
 * Converts a Cypress v13 (and above) run result into several {@link SuccessfulConversion | `ITestRunData`}
 * objects.
 *
 * @param runResult - the run result
 * @param options - additional extraction options to consider
 * @returns a mapping of test titles to their test data
 */
export declare function convertTestRuns_V13(runResult: CypressCommandLine.RunResult): Map<string, (FailedConversion | SuccessfulConversion)[]>;
/**
 * Extracts screenshots from test results and maps them to their tests' corresponding issue keys.
 *
 * @param runResult - the run result
 * @param projectKey -  required for mapping screenshots to test cases
 * @returns the mapping of test issues to screenshots
 */
export declare function getScreenshotsByIssueKey_V12(runResult: RunResult_V12, projectKey: string): Map<string, Set<string>>;
/**
 * Extracts screenshots from test results and maps them to the corresponding issue keys.
 *
 * @param runResult - the run result
 * @param projectKey -  required for mapping screenshots to test cases
 * @returns the mapping of test issues to screenshots
 */
export declare function getScreenshotsByIssueKey_V13(run: CypressCommandLine.RunResult, projectKey: string): Map<string, Set<string>>;
