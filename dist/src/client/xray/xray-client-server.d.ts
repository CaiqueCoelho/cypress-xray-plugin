import FormData from "form-data";
import type { XrayTestExecutionResults } from "../../types/xray/import-test-execution-results";
import type { CucumberMultipartFeature } from "../../types/xray/requests/import-execution-cucumber-multipart";
import type { MultipartInfo } from "../../types/xray/requests/import-execution-multipart-info";
import type { GetTestExecutionResponseServer } from "../../types/xray/responses/graphql/get-test-execution";
import type { GetTestRunResponseServer } from "../../types/xray/responses/graphql/get-test-runs";
import type { ImportExecutionResponseServer } from "../../types/xray/responses/import-execution";
import type { ImportFeatureResponse, ImportFeatureResponseServer } from "../../types/xray/responses/import-feature";
import type { XrayLicenseStatus } from "../../types/xray/responses/license";
import type { HttpCredentials } from "../authentication/credentials";
import type { AxiosRestClient } from "../https/requests";
import type { XrayClient } from "./xray-client";
import { AbstractXrayClient } from "./xray-client";
export interface XrayClientServer extends XrayClient {
    /**
     * Return a list of the tests associated with the test execution.
     *
     * @param testExecutionIssueKey - the test execution issue key
     * @returns the tests
     */
    getTestExecution(testExecutionIssueKey: string, query?: {
        /**
         * Whether detailed information about the test run should be returned.
         */
        detailed?: boolean;
        /**
         * Limits the number of results per page. Should be greater or equal to 0 and lower or
         * equal to the maximum set in Xray's global configuration.
         */
        limit?: number;
        /**
         * Number of the page to be retuned. Should be greater or equal to 1.
         */
        page?: number;
    }): Promise<GetTestExecutionResponseServer>;
    /**
     * Returns JSON that represents the test run.
     *
     * @param id - id of the test run
     * @returns the test run results
     * @see https://docs.getxray.app/display/XRAY/Test+Runs+-+REST
     */
    getTestRun(id: number): Promise<GetTestRunResponseServer>;
    /**
     * Returns information about the Xray license, including its status and type.
     *
     * @returns the license status
     * @see https://docs.getxray.app/display/XRAY/v2.0#/External%20Apps/get_xraylicense
     */
    getXrayLicense(): Promise<XrayLicenseStatus>;
}
export declare class ServerClient extends AbstractXrayClient<ImportFeatureResponseServer, ImportExecutionResponseServer> implements XrayClientServer {
    /**
     * Construct a new client using the provided credentials.
     *
     * @param apiBaseUrl - the base URL for all HTTP requests
     * @param credentials - the credentials to use during authentication
     * @param httpClient - the HTTP client to use for dispatching requests
     */
    constructor(apiBaseUrl: string, credentials: HttpCredentials, httpClient: AxiosRestClient);
    getTestExecution(testExecutionIssueKey: string, query?: Parameters<XrayClientServer["getTestExecution"]>[1]): Promise<GetTestExecutionResponseServer>;
    getTestRun(id: number): Promise<GetTestRunResponseServer>;
    getXrayLicense(): Promise<XrayLicenseStatus>;
    protected onRequest(event: "import-execution-cucumber-multipart", cucumberJson: CucumberMultipartFeature[], cucumberInfo: MultipartInfo): FormData;
    protected onRequest(event: "import-execution-multipart", executionResults: XrayTestExecutionResults, info: MultipartInfo): FormData;
    protected onResponse(event: "import-feature", response: ImportFeatureResponseServer): ImportFeatureResponse;
    protected onResponse(event: "import-execution-cucumber-multipart" | "import-execution-multipart" | "import-execution", response: ImportExecutionResponseServer): string;
}
