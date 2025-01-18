"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertCypressTestsCommand = void 0;
const node_path_1 = __importDefault(require("node:path"));
const semver_1 = require("semver");
const status_1 = require("../../../../../types/cypress/status");
const base64_1 = require("../../../../../util/base64");
const dedent_1 = require("../../../../../util/dedent");
const errors_1 = require("../../../../../util/errors");
const files_1 = require("../../../../../util/files");
const logging_1 = require("../../../../../util/logging");
const time_1 = require("../../../../../util/time");
const command_1 = require("../../../../command");
const util_1 = require("../../../util");
const run_conversion_1 = require("./util/run-conversion");
const status_conversion_1 = require("./util/status-conversion");
class ConvertCypressTestsCommand extends command_1.Command {
    constructor(parameters, logger, results) {
        super(parameters, logger);
        this.results = results;
    }
    async computeResult() {
        const results = await this.results.compute();
        const version = (0, semver_1.lt)(results.cypressVersion, "13.0.0") ? "<13" : ">=13";
        const convertedTests = this.convertTestRuns(results, version);
        const runsByKey = new Map();
        for (const convertedTest of convertedTests) {
            try {
                const issueKeys = (0, util_1.getTestIssueKeys)(convertedTest.title, this.parameters.projectKey);
                for (const issueKey of issueKeys) {
                    const runs = runsByKey.get(issueKey);
                    if (runs) {
                        runs.push(convertedTest);
                    }
                    else {
                        runsByKey.set(issueKey, [convertedTest]);
                    }
                }
            }
            catch (error) {
                this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                        ${convertedTest.spec.filepath}

                          Test: ${convertedTest.title}

                            Skipping result upload.

                              Caused by: ${(0, errors_1.errorMessage)(error)}
                    `));
            }
        }
        const xrayTests = [];
        for (const [issueKey, testRuns] of runsByKey) {
            xrayTests.push(this.getTest(testRuns, issueKey, this.getXrayEvidence(issueKey)));
        }
        if (xrayTests.length === 0) {
            throw new Error("Failed to convert Cypress tests into Xray tests: No Cypress tests to upload");
        }
        return [xrayTests[0], ...xrayTests.slice(1)];
    }
    convertTestRuns(runResults, version) {
        const conversions = [];
        const cypressRuns = runResults.runs.filter((run) => {
            return (!this.parameters.featureFileExtension ||
                !run.spec.relative.endsWith(this.parameters.featureFileExtension));
        });
        if (cypressRuns.length === 0) {
            throw new Error("Failed to extract test run data: Only Cucumber tests were executed");
        }
        const extractor = (run) => {
            if (version === "<13") {
                return (0, run_conversion_1.convertTestRuns_V12)(run);
            }
            else {
                return (0, run_conversion_1.convertTestRuns_V13)(run);
            }
        };
        for (const run of cypressRuns) {
            const testRuns = extractor(run);
            for (const [title, runs] of testRuns) {
                for (const conversion of runs) {
                    conversions.push([title, conversion]);
                }
            }
        }
        if (this.parameters.uploadScreenshots) {
            this.addScreenshotEvidence(runResults, version);
        }
        const testRunData = [];
        for (const [title, conversion] of conversions) {
            if (conversion.kind === "error") {
                this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                        Test: ${title}

                          Skipping result upload.

                            Caused by: ${(0, errors_1.errorMessage)(conversion.error)}
                    `));
            }
            else {
                testRunData.push(conversion);
            }
        }
        return testRunData;
    }
    addScreenshotEvidence(runResults, version) {
        const extractor = (run) => {
            if (version === "<13") {
                return (0, run_conversion_1.getScreenshotsByIssueKey_V12)(run, this.parameters.projectKey);
            }
            else {
                return (0, run_conversion_1.getScreenshotsByIssueKey_V13)(run, this.parameters.projectKey);
            }
        };
        const includedScreenshots = [];
        for (const run of runResults.runs) {
            const allScreenshots = extractor(run);
            for (const [issueKey, screenshots] of allScreenshots) {
                for (const screenshot of screenshots) {
                    let filename = node_path_1.default.basename(screenshot);
                    if (this.parameters.normalizeScreenshotNames) {
                        filename = (0, files_1.normalizedFilename)(filename);
                    }
                    this.parameters.evidenceCollection.addEvidence(issueKey, {
                        data: (0, base64_1.encodeFile)(screenshot),
                        filename: filename,
                    });
                    includedScreenshots.push(screenshot);
                }
            }
        }
        if (version === ">=13") {
            for (const run of runResults.runs) {
                if (this.parameters.featureFileExtension &&
                    run.spec.fileExtension.endsWith(this.parameters.featureFileExtension)) {
                    continue;
                }
                for (const screenshot of run.screenshots) {
                    if (!includedScreenshots.includes(screenshot.path)) {
                        const screenshotName = node_path_1.default.parse(screenshot.path).name;
                        this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                                ${screenshot.path}

                                  Screenshot cannot be attributed to a test and will not be uploaded.

                                  To upload screenshots, include test issue keys anywhere in their name:

                                    cy.screenshot("${this.parameters.projectKey}-123 ${screenshotName}")
                            `));
                    }
                }
            }
        }
    }
    getTest(runs, issueKey, evidence) {
        const xrayTest = {
            finish: (0, time_1.truncateIsoTime)((0, time_1.latestDate)(...runs.map((test) => new Date(test.startedAt.getTime() + test.duration))).toISOString()),
            start: (0, time_1.truncateIsoTime)((0, time_1.earliestDate)(...runs.map((test) => test.startedAt)).toISOString()),
            status: this.getXrayStatus(runs),
            testKey: issueKey,
        };
        if (evidence.length > 0) {
            xrayTest.evidence = evidence;
        }
        if (runs.length > 1) {
            const iterations = [];
            for (const iteration of runs) {
                iterations.push({
                    parameters: [{ name: "iteration", value: (iterations.length + 1).toString() }],
                    status: (0, status_conversion_1.getXrayStatus)(iteration.status, this.parameters.useCloudStatusFallback === true, this.parameters.xrayStatus),
                });
            }
            xrayTest.iterations = iterations;
        }
        return xrayTest;
    }
    getXrayStatus(tests) {
        const statuses = tests.map((test) => test.status);
        if (statuses.length > 1) {
            const passed = statuses.filter((s) => s === status_1.CypressStatus.PASSED).length;
            const failed = statuses.filter((s) => s === status_1.CypressStatus.FAILED).length;
            const pending = statuses.filter((s) => s === status_1.CypressStatus.PENDING).length;
            const skipped = statuses.filter((s) => s === status_1.CypressStatus.SKIPPED).length;
            if (this.parameters.xrayStatus.aggregate) {
                return this.parameters.xrayStatus.aggregate({ failed, passed, pending, skipped });
            }
            if (passed > 0 && failed === 0 && skipped === 0) {
                return (0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.PASSED, this.parameters.useCloudStatusFallback === true, this.parameters.xrayStatus);
            }
            if (passed === 0 && failed === 0 && skipped === 0 && pending > 0) {
                return (0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.PENDING, this.parameters.useCloudStatusFallback === true, this.parameters.xrayStatus);
            }
            if (skipped > 0) {
                return (0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.SKIPPED, this.parameters.useCloudStatusFallback === true, this.parameters.xrayStatus);
            }
            return (0, status_conversion_1.getXrayStatus)(status_1.CypressStatus.FAILED, this.parameters.useCloudStatusFallback === true, this.parameters.xrayStatus);
        }
        return (0, status_conversion_1.getXrayStatus)(statuses[0], this.parameters.useCloudStatusFallback === true, this.parameters.xrayStatus);
    }
    getXrayEvidence(issueKey) {
        const evidence = [];
        this.parameters.evidenceCollection
            .getEvidence(issueKey)
            .forEach((item) => evidence.push(item));
        return evidence;
    }
}
exports.ConvertCypressTestsCommand = ConvertCypressTestsCommand;
