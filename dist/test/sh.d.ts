import "dotenv/config";
export declare function runCypress(cwd: string, options?: {
    env?: Record<string, string | undefined>;
    expectedStatusCode?: number;
    includeDefaultEnv?: "cloud" | "server";
}): string[];
export interface IntegrationTest {
    commandFileContent?: string;
    env?: Record<string, string | undefined>;
    service: "cloud" | "server";
    testIssueKey: string;
    title: string;
}
