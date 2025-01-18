import type { CypressRunResultType } from "../../../../../types/cypress/cypress";
import type { IssueUpdate } from "../../../../../types/jira/responses/issue-update";
import type { MultipartInfo, MultipartInfoCloud } from "../../../../../types/xray/requests/import-execution-multipart-info";
/**
 * Interface containing general/minimal Cypress run data.
 */
export type RunData = Pick<CypressRunResultType, "browserName" | "browserVersion" | "cypressVersion" | "endedTestsAt" | "startedTestsAt">;
/**
 * Additional information used by test execution issues when uploading Cucumber results.
 */
export interface TestExecutionIssueData {
    projectKey: string;
    testEnvironments?: {
        value: [string, ...string[]];
    };
    testExecutionIssue: IssueUpdate;
    testPlan?: {
        value: string;
    };
}
/**
 * Additional information used by test execution issues when uploading Cucumber results.
 */
export interface TestExecutionIssueDataServer extends TestExecutionIssueData {
    testEnvironments?: {
        fieldId: string;
        value: [string, ...string[]];
    };
    testPlan?: {
        fieldId: string;
        value: string;
    };
}
/**
 * Converts Cypress run data into Cucumber multipart information, which could be used when creating
 * new test executions on import or when updating existing ones.
 *
 * @param runData - Cypress run data
 * @param testExecutionIssueData - additional information to consider
 * @returns the Cucumber multipart information data for Xray server
 */
export declare function buildMultipartInfoServer(runData: RunData, testExecutionIssueData: TestExecutionIssueDataServer): MultipartInfo;
/**
 * Converts Cypress run data into Cucumber multipart information, which could be used when creating
 * new test executions on import or when updating existing ones.
 *
 * @param runData - Cypress run data
 * @param testExecutionIssueData - additional information to consider
 * @returns the Cucumber multipart information data for Xray cloud
 */
export declare function buildMultipartInfoCloud(runData: RunData, testExecutionIssueData: TestExecutionIssueData): MultipartInfoCloud;
