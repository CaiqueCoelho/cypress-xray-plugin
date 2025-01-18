import FormData from "form-data";
import type { StringMap } from "../../types/util";
import type { XrayTestExecutionResults } from "../../types/xray/import-test-execution-results";
import type { CucumberMultipartFeature } from "../../types/xray/requests/import-execution-cucumber-multipart";
import type { MultipartInfo } from "../../types/xray/requests/import-execution-multipart-info";
import type { Test, TestRun } from "../../types/xray/responses/graphql/xray";
import type { ImportExecutionResponseCloud } from "../../types/xray/responses/import-execution";
import type { ImportFeatureResponse, ImportFeatureResponseCloud } from "../../types/xray/responses/import-feature";
import type { JwtCredentials } from "../authentication/credentials";
import type { AxiosRestClient } from "../https/requests";
import { AbstractXrayClient } from "./xray-client";
interface HasTestTypes {
    /**
     * Returns Xray test types for the provided test issues, such as `Manual`, `Cucumber` or
     * `Generic`.
     *
     * @param projectKey - key of the project containing the test issues
     * @param issueKeys - the keys of the test issues to retrieve test types for
     * @returns a promise which will contain the mapping of issues to test types
     */
    getTestTypes(projectKey: string, ...issueKeys: string[]): Promise<StringMap<string>>;
}
interface HasTestResults {
    /**
     * Returns a test execution by issue ID.
     *
     * @param issueId - the id of the test execution issue to be returned
     * @returns the tests contained in the test execution
     * @see https://us.xray.cloud.getxray.app/doc/graphql/gettestexecution.doc.html
     */
    getTestResults(issueId: string): Promise<Test<{
        key: string;
        summary: string;
    }>[]>;
}
interface HasTestRunResults {
    /**
     * Returns a test execution by issue ID.
     *
     * @param options - the GraphQL options
     * @returns the test run results
     * @see https://us.xray.cloud.getxray.app/doc/graphql/gettestruns.doc.html
     */
    getTestRunResults(options: {
        /**
         * The issue ids of the test execution of the test runs.
         */
        testExecIssueIds: [string, ...string[]];
        /**
         * The issue ids of the test of the test runs.
         */
        testIssueIds: [string, ...string[]];
    }): Promise<TestRun<{
        key: string;
    }>[]>;
}
export declare class XrayClientCloud extends AbstractXrayClient<ImportFeatureResponseCloud, ImportExecutionResponseCloud> implements HasTestTypes, HasTestResults, HasTestRunResults {
    /**
     * The URLs of Xray's Cloud API.
     * Note: API v1 would also work, but let's stick to the more recent one.
     */
    static readonly URL = "https://xray.cloud.getxray.app/api/v2";
    private static readonly URL_GRAPHQL;
    private static readonly GRAPHQL_LIMIT;
    /**
     * Construct a new Xray cloud client using the provided credentials.
     *
     * @param credentials - the credentials to use during authentication
     * @param httpClient - the HTTP client to use for dispatching requests
     */
    constructor(credentials: JwtCredentials, httpClient: AxiosRestClient);
    getTestResults(issueId: string): ReturnType<HasTestResults["getTestResults"]>;
    getTestRunResults(options: Parameters<HasTestRunResults["getTestRunResults"]>[0]): Promise<TestRun<{
        key: string;
    }>[]>;
    getTestTypes(projectKey: string, ...issueKeys: string[]): ReturnType<HasTestTypes["getTestTypes"]>;
    protected onRequest(event: "import-execution-cucumber-multipart", cucumberJson: CucumberMultipartFeature[], cucumberInfo: MultipartInfo): FormData;
    protected onRequest(event: "import-execution-multipart", executionResults: XrayTestExecutionResults, info: MultipartInfo): FormData;
    protected onResponse(event: "import-feature", response: ImportFeatureResponseCloud): ImportFeatureResponse;
    protected onResponse(event: "import-execution-cucumber-multipart" | "import-execution-multipart" | "import-execution", response: ImportExecutionResponseCloud): string;
}
export {};
