/**
 * Contains a mapping of all available options to their respective environment variable names.
 */
export declare const ENV_NAMES: {
    authentication: {
        jira: {
            apiToken: string;
            password: string;
            username: string;
        };
        xray: {
            clientId: string;
            clientSecret: string;
        };
    };
    cucumber: {
        downloadFeatures: string;
        featureFileExtension: string;
        prefixes: {
            precondition: string;
            test: string;
        };
        uploadFeatures: string;
    };
    jira: {
        attachVideos: string;
        fields: {
            description: string;
            labels: string;
            summary: string;
            testEnvironments: string;
            testPlan: string;
        };
        projectKey: string;
        testExecutionIssue: string;
        testExecutionIssueDescription: string;
        testExecutionIssueKey: string;
        testExecutionIssueSummary: string;
        testExecutionIssueType: string;
        testPlanIssueKey: string;
        testPlanIssueType: string;
        url: string;
    };
    plugin: {
        debug: string;
        enabled: string;
        logDirectory: string;
        normalizeScreenshotNames: string;
    };
    xray: {
        status: {
            failed: string;
            passed: string;
            pending: string;
            skipped: string;
            step: {
                failed: string;
                passed: string;
                pending: string;
                skipped: string;
            };
        };
        testEnvironments: string;
        uploadRequests: string;
        uploadResults: string;
        uploadScreenshots: string;
    };
};
