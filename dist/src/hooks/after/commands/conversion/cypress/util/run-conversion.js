"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTestRuns_V12 = convertTestRuns_V12;
exports.convertTestRuns_V13 = convertTestRuns_V13;
exports.getScreenshotsByIssueKey_V12 = getScreenshotsByIssueKey_V12;
exports.getScreenshotsByIssueKey_V13 = getScreenshotsByIssueKey_V13;
const util_1 = require("../../../../util");
const status_conversion_1 = require("./status-conversion");
/**
 * Converts a Cypress v12 (or before) run result into several {@link SuccessfulConversion} objects.
 *
 * @param runResult - the run result
 * @returns a mapping of test titles to their test data
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function convertTestRuns_V12(runResult) {
    const map = new Map();
    runResult.tests.forEach((test) => {
        const title = test.title.join(" ");
        const runs = test.attempts.map((attempt) => {
            try {
                return {
                    duration: attempt.duration,
                    kind: "success",
                    spec: {
                        filepath: runResult.spec.absolute,
                    },
                    startedAt: new Date(attempt.startedAt),
                    status: (0, status_conversion_1.toCypressStatus)(attempt.state),
                    title: title,
                };
            }
            catch (error) {
                return { error, kind: "error" };
            }
        });
        const testRuns = map.get(title);
        if (testRuns) {
            testRuns.push(...runs);
        }
        else {
            map.set(title, runs);
        }
    });
    return map;
}
/**
 * Converts a Cypress v13 (and above) run result into several {@link SuccessfulConversion | `ITestRunData`}
 * objects.
 *
 * @param runResult - the run result
 * @param options - additional extraction options to consider
 * @returns a mapping of test titles to their test data
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function convertTestRuns_V13(runResult) {
    const map = new Map();
    const testStarts = startTimesByTest(runResult);
    runResult.tests.forEach((test) => {
        const title = test.title.join(" ");
        const runs = test.attempts.map((attempt) => {
            try {
                return {
                    duration: test.duration,
                    kind: "success",
                    spec: {
                        filepath: runResult.spec.absolute,
                    },
                    startedAt: testStarts[title],
                    status: (0, status_conversion_1.toCypressStatus)(attempt.state),
                    title: title,
                };
            }
            catch (error) {
                return {
                    error,
                    kind: "error",
                };
            }
        });
        const testRuns = map.get(title);
        if (testRuns) {
            testRuns.push(...runs);
        }
        else {
            map.set(title, runs);
        }
    });
    return map;
}
function startTimesByTest(run) {
    const map = {};
    const testStarts = [];
    for (let i = 0; i < run.tests.length; i++) {
        let date;
        if (i === 0) {
            date = new Date(run.stats.startedAt);
        }
        else {
            date = new Date(testStarts[i - 1].getTime() + run.tests[i - 1].duration);
        }
        testStarts.push(date);
        map[run.tests[i].title.join(" ")] = date;
    }
    return map;
}
/**
 * Extracts screenshots from test results and maps them to their tests' corresponding issue keys.
 *
 * @param runResult - the run result
 * @param projectKey -  required for mapping screenshots to test cases
 * @returns the mapping of test issues to screenshots
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function getScreenshotsByIssueKey_V12(runResult, projectKey) {
    const map = new Map();
    for (const test of runResult.tests) {
        const title = test.title.join(" ");
        try {
            const testTitleKeys = (0, util_1.getTestIssueKeys)(title, projectKey);
            for (const issueKey of testTitleKeys) {
                for (const attempt of test.attempts) {
                    for (const screenshot of attempt.screenshots) {
                        const screenshots = map.get(issueKey);
                        if (!screenshots) {
                            map.set(issueKey, new Set([screenshot.path]));
                        }
                        else {
                            screenshots.add(screenshot.path);
                        }
                    }
                }
            }
        }
        catch (_a) {
            continue;
        }
    }
    return map;
}
/**
 * Extracts screenshots from test results and maps them to the corresponding issue keys.
 *
 * @param runResult - the run result
 * @param projectKey -  required for mapping screenshots to test cases
 * @returns the mapping of test issues to screenshots
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function getScreenshotsByIssueKey_V13(run, projectKey) {
    const map = new Map();
    for (const test of run.tests) {
        const title = test.title.join(" ");
        try {
            const testTitleKeys = (0, util_1.getTestIssueKeys)(title, projectKey);
            for (const issueKey of testTitleKeys) {
                for (const screenshot of run.screenshots) {
                    if (screenshot.path.includes(issueKey)) {
                        const screenshots = map.get(issueKey);
                        if (!screenshots) {
                            map.set(issueKey, new Set([screenshot.path]));
                        }
                        else {
                            screenshots.add(screenshot.path);
                        }
                    }
                }
            }
        }
        catch (_a) {
            continue;
        }
    }
    return map;
}
