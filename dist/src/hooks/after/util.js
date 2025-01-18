"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsCypressTest = containsCypressTest;
exports.containsCucumberTest = containsCucumberTest;
exports.getTestIssueKeys = getTestIssueKeys;
const dedent_1 = require("../../util/dedent");
const help_1 = require("../../util/help");
function containsCypressTest(runResult, featureFileExtension) {
    return runResult.runs.some((run) => {
        if (featureFileExtension && run.spec.absolute.endsWith(featureFileExtension)) {
            return false;
        }
        return true;
    });
}
function containsCucumberTest(runResult, featureFileExtension) {
    return runResult.runs.some((run) => {
        if (featureFileExtension && run.spec.absolute.endsWith(featureFileExtension)) {
            return true;
        }
        return false;
    });
}
/**
 * Extracts Jira issue keys from a Cypress test title, based on the provided project key.
 *
 * @param title - the test title
 * @param projectKey - the Jira projectk key
 * @returns the Jira issue keys
 * @throws if the title contains zero issue keys
 */
function getTestIssueKeys(title, projectKey) {
    const regex = new RegExp(`(${projectKey}-\\d+)`, "g");
    const matches = title.match(regex);
    if (!matches) {
        throw new Error((0, dedent_1.dedent)(`
                Test: ${title}

                  No test issue keys found in title.

                  You can target existing test issues by adding a corresponding issue key:

                    it("${projectKey}-123 ${title}", () => {
                      // ...
                    });

                  For more information, visit:
                  - ${help_1.HELP.plugin.guides.targetingExistingIssues}
            `));
    }
    const [key, ...keys] = matches;
    return [key, ...keys];
}
