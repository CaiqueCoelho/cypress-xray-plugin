import assert from "node:assert";
import { relative } from "node:path";
import { cwd } from "node:process";
import { describe, it } from "node:test";
import type { RunResult as RunResult_V12 } from "../../../../../../types/cypress/12.0.0/api";
import { CypressStatus } from "../../../../../../types/cypress/status";
import {
    convertTestRuns_V12,
    convertTestRuns_V13,
    getScreenshotsByIssueKey_V12,
    getScreenshotsByIssueKey_V13,
} from "./run-conversion";

describe(relative(cwd(), __filename), async () => {
    await describe(convertTestRuns_V12.name, async () => {
        const passedResult: RunResult_V12 = {
            error: null,
            hooks: [],
            reporter: "repotert",
            reporterStats: {},
            shouldUploadVideo: false,
            skippedSpec: false,
            spec: {
                absolute: "~/repositories/xray/cypress/e2e/demo/example.cy.ts",
                name: "cypress/e2e/demo/example.cy.ts",
                relative: "cypress/e2e/demo/example.cy.ts",
                relativeToCommonRoot: "example.cy.ts",
            },
            stats: {
                duration: 7740,
                endedAt: "2022-11-28T17:41:19.974Z",
                failures: 0,
                passes: 2,
                pending: 0,
                skipped: 0,
                startedAt: "2022-11-28T17:41:12.234Z",
                suites: 1,
                tests: 1,
            },
            tests: [
                {
                    attempts: [
                        {
                            duration: 244,
                            error: null,
                            screenshots: [],
                            startedAt: "2022-11-28T17:41:15.091Z",
                            state: "passed",
                            videoTimestamp: 7910,
                        },
                    ],
                    body: 'function(){cy.get("p").should("exist");}',
                    displayError: null,
                    state: "passed",
                    title: ["xray upload demo", "should look for paragraph elements"],
                },
            ],
            video: "~/repositories/xray/cypress/videos/example.cy.ts.mp4",
        };
        const failedResult: RunResult_V12 = {
            error: null,
            hooks: [],
            reporter: "reporter",
            reporterStats: {},
            shouldUploadVideo: false,
            skippedSpec: false,
            spec: {
                absolute: "~/repositories/xray/cypress/e2e/demo/example.cy.ts",
                name: "cypress/e2e/demo/example.cy.ts",
                relative: "cypress/e2e/demo/example.cy.ts",
                relativeToCommonRoot: "example.cy.ts",
            },
            stats: {
                duration: 7740,
                endedAt: "2022-11-28T17:41:19.974Z",
                failures: 1,
                passes: 0,
                pending: 0,
                skipped: 0,
                startedAt: "2022-11-28T17:41:12.234Z",
                suites: 1,
                tests: 1,
            },
            tests: [
                {
                    attempts: [
                        {
                            duration: 4413,
                            error: {
                                message:
                                    "Timed out retrying after 4000ms: Expected to find element: `span`, but never found it.",
                                name: "AssertionError",
                                stack: "at Context.eval (webpack:///./cypress/e2e/demo/example.cy.ts:15:23)",
                            },
                            screenshots: [
                                {
                                    height: 720,
                                    name: "",
                                    path: "./test/resources/turtle.png",
                                    takenAt: "2022-11-28T17:41:19.702Z",
                                    width: 1280,
                                },
                                {
                                    height: 720,
                                    name: "",
                                    path: "./test/resources/turtle.png",
                                    takenAt: "2022-11-28T17:43:87.626Z",
                                    width: 1280,
                                },
                            ],
                            startedAt: "2022-11-28T17:41:15.526Z",
                            state: "failed",
                            videoTimestamp: 8345,
                        },
                    ],
                    body: 'function(){cy.get("span").should("exist");}',
                    displayError:
                        "AssertionError: Timed out retrying after 4000ms: Expected to find element: `span`, but never found it.\n    at Context.eval (webpack:///./cypress/e2e/demo/example.cy.ts:15:23)",
                    state: "failed",
                    title: ["CYP-123 xray upload demo", "should fail"],
                },
            ],
            video: "~/repositories/xray/cypress/videos/example.cy.ts.mp4",
        };
        const invalidResult: RunResult_V12 = {
            error: null,
            hooks: [],
            reporter: "reporter",
            reporterStats: {},
            shouldUploadVideo: false,
            skippedSpec: false,
            spec: {
                absolute: "~/repositories/xray/cypress/e2e/demo/example.cy.ts",
                name: "cypress/e2e/demo/example.cy.ts",
                relative: "cypress/e2e/demo/example.cy.ts",
                relativeToCommonRoot: "example.cy.ts",
            },
            stats: {
                duration: 7740,
                endedAt: "2022-11-28T17:41:19.974Z",
                failures: 1,
                passes: 0,
                pending: 0,
                skipped: 0,
                startedAt: "2022-11-28T17:41:12.234Z",
                suites: 1,
                tests: 1,
            },
            tests: [
                {
                    attempts: [
                        {
                            duration: 4413,
                            error: {
                                message:
                                    "Timed out retrying after 4000ms: Expected to find element: `span`, but never found it.",
                                name: "AssertionError",
                                stack: "at Context.eval (webpack:///./cypress/e2e/demo/example.cy.ts:15:23)",
                            },
                            screenshots: [
                                {
                                    height: 720,
                                    name: "",
                                    path: "./test/resources/turtle.png",
                                    takenAt: "2022-11-28T17:41:19.702Z",
                                    width: 1280,
                                },
                            ],
                            startedAt: "2022-11-28T17:41:15.526Z",
                            state: "broken",
                            videoTimestamp: 8345,
                        },
                    ],
                    body: 'function(){cy.get("span").should("exist");}',
                    displayError:
                        "AssertionError: Timed out retrying after 4000ms: Expected to find element: `span`, but never found it.\n    at Context.eval (webpack:///./cypress/e2e/demo/example.cy.ts:15:23)",
                    state: "failed",
                    title: ["xray upload demo", "should fail"],
                },
            ],
            video: "~/repositories/xray/cypress/videos/example.cy.ts.mp4",
        };

        await it("returns test data for valid runs", () => {
            const map = convertTestRuns_V12(passedResult);
            assert.strictEqual(map.size, 1);
            const testRuns = map.get("xray upload demo should look for paragraph elements");
            assert.ok(testRuns);
            assert.deepStrictEqual(testRuns[0], {
                duration: 244,
                kind: "success",
                spec: {
                    filepath: "~/repositories/xray/cypress/e2e/demo/example.cy.ts",
                },
                startedAt: new Date("2022-11-28T17:41:15.091Z"),
                status: CypressStatus.PASSED,
                title: "xray upload demo should look for paragraph elements",
            });
        });

        await it("includes screenshots in runs", () => {
            const screenshotMap = getScreenshotsByIssueKey_V12(failedResult, "CYP");
            assert.deepStrictEqual(
                screenshotMap,
                new Map([["CYP-123", new Set(["./test/resources/turtle.png"])]])
            );
        });

        await it("rejects invalid runs", () => {
            const map = convertTestRuns_V12(invalidResult);
            assert.strictEqual(map.size, 1);
            const testRuns = map.get("xray upload demo should fail");
            assert.ok(testRuns);
            assert.strictEqual(testRuns[0].kind, "error");
            const reason = testRuns[0].error as Error;
            assert.strictEqual(reason.message, "Unknown Cypress test status: broken");
        });
    });

    await describe(convertTestRuns_V13.name, async () => {
        const passedResult: CypressCommandLine.RunResult = {
            error: null,
            reporter: "spec",
            reporterStats: {
                duration: 3096,
                end: "2023-09-09T10:59:31.925Z",
                failures: 0,
                passes: 1,
                pending: 0,
                start: "2023-09-09T10:59:28.829Z",
                suites: 1,
                tests: 1,
            },
            screenshots: [],
            spec: {
                absolute: "~/Repositories/cypress/85/cypress/e2e/cyp/cypress.spec.cy.ts",
                fileExtension: ".ts",
                fileName: "cypress.spec",
                name: "cypress.spec.cy.ts",
                relative: "cypress/e2e/cyp/cypress.spec.cy.ts",
            },
            stats: {
                duration: 3100,
                endedAt: "2023-09-09T10:59:31.926Z",
                failures: 0,
                passes: 1,
                pending: 0,
                skipped: 0,
                startedAt: "2023-09-09T10:59:28.826Z",
                suites: 1,
                tests: 1,
            },
            tests: [
                {
                    attempts: [{ state: "passed" }],
                    displayError: null,
                    duration: 638,
                    state: "passed",
                    title: ["something", "CYP-237 happens"],
                },
                {
                    attempts: [{ state: "pending" }],
                    displayError: null,
                    duration: 123,
                    state: "pending",
                    title: ["something", "something"],
                },
            ],
            video: null,
        };
        const failedResult: CypressCommandLine.RunResult = {
            error: null,
            reporter: "spec",
            reporterStats: {
                duration: 3096,
                end: "2023-09-09T10:59:31.925Z",
                failures: 1,
                passes: 0,
                pending: 0,
                start: "2023-09-09T10:59:28.829Z",
                suites: 1,
                tests: 1,
            },
            screenshots: [
                {
                    height: 8,
                    name: "",
                    path: "./test/resources/small CYP-237.png",
                    takenAt: "2023-09-09T10:59:31.366Z",
                    width: 8,
                },
                {
                    height: 16,
                    name: "",
                    path: "./test/resources/manual CYP-237 screenshot.png",
                    takenAt: "2023-09-09T10:59:31.366Z",
                    width: 16,
                },
                {
                    height: 8,
                    name: "",
                    path: "./test/resources/small.png",
                    takenAt: "2023-09-09T10:59:31.366Z",
                    width: 8,
                },
            ],
            spec: {
                absolute: "~/Repositories/cypress/85/cypress/e2e/cyp/cypress.spec.cy.ts",
                fileExtension: ".ts",
                fileName: "cypress.spec",
                name: "cypress.spec.cy.ts",
                relative: "cypress/e2e/cyp/cypress.spec.cy.ts",
            },
            stats: {
                duration: 3100,
                endedAt: "2023-09-09T10:59:31.926Z",
                failures: 0,
                passes: 1,
                pending: 0,
                skipped: 0,
                startedAt: "2023-09-09T10:59:28.826Z",
                suites: 1,
                tests: 1,
            },
            tests: [
                {
                    attempts: [{ state: "failed" }],
                    displayError: null,
                    duration: 638,
                    state: "failed",
                    title: ["something", "CYP-237 happens"],
                },
            ],
            video: null,
        };
        const invalidResult: CypressCommandLine.RunResult = {
            error: null,
            reporter: "spec",
            reporterStats: {
                duration: 3096,
                end: "2023-09-09T10:59:31.925Z",
                failures: 1,
                passes: 0,
                pending: 0,
                start: "2023-09-09T10:59:28.829Z",
                suites: 1,
                tests: 1,
            },
            screenshots: [
                {
                    height: 8,
                    name: "",
                    path: "./test/resources/small CYP-237.png",
                    takenAt: "2023-09-09T10:59:31.366Z",
                    width: 8,
                },
            ],
            spec: {
                absolute: "~/Repositories/cypress/85/cypress/e2e/cyp/cypress.spec.cy.ts",
                fileExtension: ".ts",
                fileName: "cypress.spec",
                name: "cypress.spec.cy.ts",
                relative: "cypress/e2e/cyp/cypress.spec.cy.ts",
            },
            stats: {
                duration: 3100,
                endedAt: "2023-09-09T10:59:31.926Z",
                failures: 0,
                passes: 1,
                pending: 0,
                skipped: 0,
                startedAt: "2023-09-09T10:59:28.826Z",
                suites: 1,
                tests: 1,
            },
            tests: [
                {
                    attempts: [{ state: "broken" }],
                    displayError: null,
                    duration: 638,
                    state: "broken",
                    title: ["something", "CYP-237 happens"],
                },
            ],
            video: null,
        };

        await it("returns test data for valid runs", () => {
            const map = convertTestRuns_V13(passedResult);
            assert.strictEqual(map.size, 2);
            let testRuns = map.get("something CYP-237 happens");
            assert.ok(testRuns);
            assert.deepStrictEqual(testRuns, [
                {
                    duration: 638,
                    kind: "success",
                    spec: {
                        filepath: "~/Repositories/cypress/85/cypress/e2e/cyp/cypress.spec.cy.ts",
                    },
                    startedAt: new Date("2023-09-09T10:59:28.826Z"),
                    status: CypressStatus.PASSED,
                    title: "something CYP-237 happens",
                },
            ]);
            testRuns = map.get("something something");
            assert.ok(testRuns);
            assert.deepStrictEqual(testRuns, [
                {
                    duration: 123,
                    kind: "success",
                    spec: {
                        filepath: "~/Repositories/cypress/85/cypress/e2e/cyp/cypress.spec.cy.ts",
                    },
                    startedAt: new Date("2023-09-09T10:59:29.464Z"),
                    status: CypressStatus.PENDING,
                    title: "something something",
                },
            ]);
        });

        await it("includes relevant screenshots in runs", () => {
            const screenshotMap = getScreenshotsByIssueKey_V13(failedResult, "CYP");
            assert.deepStrictEqual(
                screenshotMap,
                new Map([
                    [
                        "CYP-237",
                        new Set([
                            "./test/resources/small CYP-237.png",
                            "./test/resources/manual CYP-237 screenshot.png",
                        ]),
                    ],
                ])
            );
        });

        await it("rejects invalid runs", () => {
            const map = convertTestRuns_V13(invalidResult);
            assert.strictEqual(map.size, 1);
            const testRuns = map.get("something CYP-237 happens");
            assert.ok(testRuns);
            assert.strictEqual(testRuns[0].kind, "error");
            const reason = testRuns[0].error as Error;
            assert.strictEqual(reason.message, "Unknown Cypress test status: broken");
        });
    });
});
