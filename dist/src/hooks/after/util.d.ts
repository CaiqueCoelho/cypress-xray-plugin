import type { CypressRunResultType } from "../../types/cypress/cypress";
export declare function containsCypressTest(runResult: CypressRunResultType, featureFileExtension?: string): boolean;
export declare function containsCucumberTest(runResult: CypressRunResultType, featureFileExtension?: string): boolean;
/**
 * Extracts Jira issue keys from a Cypress test title, based on the provided project key.
 *
 * @param title - the test title
 * @param projectKey - the Jira projectk key
 * @returns the Jira issue keys
 * @throws if the title contains zero issue keys
 */
export declare function getTestIssueKeys(title: string, projectKey: string): [string, ...string[]];
