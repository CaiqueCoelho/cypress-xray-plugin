"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginTaskListener = exports.PluginTask = void 0;
exports.enqueueTask = enqueueTask;
const util_1 = require("../hooks/after/util");
const base64_1 = require("../util/base64");
const dedent_1 = require("../util/dedent");
const errors_1 = require("../util/errors");
const logging_1 = require("../util/logging");
/**
 * All tasks which are available within the plugin.
 */
var PluginTask;
(function (PluginTask) {
    /**
     * The task which handles incoming responses from requests dispatched through `cy.request`
     * within a test.
     */
    PluginTask["INCOMING_RESPONSE"] = "cypress-xray-plugin:task:response";
    /**
     * The task which handles outgoing requests dispatched through `cy.request` within a test.
     */
    PluginTask["OUTGOING_REQUEST"] = "cypress-xray-plugin:task:request";
})(PluginTask || (exports.PluginTask = PluginTask = {}));
function enqueueTask(task, filename, arg) {
    switch (task) {
        case PluginTask.OUTGOING_REQUEST: {
            const parameters = {
                filename: filename,
                request: arg,
                test: Cypress.currentTest.title,
            };
            return cy.task(task, parameters);
        }
        case PluginTask.INCOMING_RESPONSE: {
            const parameters = {
                filename: filename,
                response: arg,
                test: Cypress.currentTest.title,
            };
            return cy.task(task, parameters);
        }
    }
}
class PluginTaskListener {
    constructor(projectKey, evidenceCollection, logger) {
        this.ignoredTests = new Set();
        this.projectKey = projectKey;
        this.evidenceCollection = evidenceCollection;
        this.logger = logger;
    }
    [PluginTask.OUTGOING_REQUEST](args) {
        try {
            const issueKeys = (0, util_1.getTestIssueKeys)(args.test, this.projectKey);
            for (const issueKey of issueKeys) {
                this.evidenceCollection.addEvidence(issueKey, {
                    contentType: "application/json",
                    data: (0, base64_1.encode)(JSON.stringify(args.request, null, 2)),
                    filename: args.filename,
                });
            }
        }
        catch (error) {
            if (!this.ignoredTests.has(args.test)) {
                this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                        Test: ${args.test}

                          Encountered a cy.request call which will not be included as evidence.

                            Caused by: ${(0, errors_1.errorMessage)(error)}
                    `));
                this.ignoredTests.add(args.test);
            }
        }
        return args.request;
    }
    [PluginTask.INCOMING_RESPONSE](args) {
        try {
            const issueKeys = (0, util_1.getTestIssueKeys)(args.test, this.projectKey);
            for (const issueKey of issueKeys) {
                this.evidenceCollection.addEvidence(issueKey, {
                    contentType: "application/json",
                    data: (0, base64_1.encode)(JSON.stringify(args.response, null, 2)),
                    filename: args.filename,
                });
            }
        }
        catch (error) {
            if (!this.ignoredTests.has(args.test)) {
                this.logger.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                        Test: ${args.test}

                          Encountered a cy.request call which will not be included as evidence.

                            Caused by: ${(0, errors_1.errorMessage)(error)}
                    `));
                this.ignoredTests.add(args.test);
            }
        }
        return args.response;
    }
}
exports.PluginTaskListener = PluginTaskListener;
