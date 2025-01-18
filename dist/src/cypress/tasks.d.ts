import type { EvidenceCollection } from "../context";
import type { Logger } from "../util/logging";
/**
 * All tasks which are available within the plugin.
 */
export declare enum PluginTask {
    /**
     * The task which handles incoming responses from requests dispatched through `cy.request`
     * within a test.
     */
    INCOMING_RESPONSE = "cypress-xray-plugin:task:response",
    /**
     * The task which handles outgoing requests dispatched through `cy.request` within a test.
     */
    OUTGOING_REQUEST = "cypress-xray-plugin:task:request"
}
/**
 * Enqueues the plugin task for processing a dispatched request. The plugin internally keeps track
 * of all requests enqueued in this way and will upload them as test execution evidence if the
 * appropriate options are enabled.
 *
 * @param task - the task name
 * @param filename - the name of the evidence file to save the request data to
 * @param request - the request data
 *
 * @see https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/uploadRequestData/
 */
export declare function enqueueTask(task: PluginTask.OUTGOING_REQUEST, filename: string, request: Partial<Cypress.RequestOptions>): Cypress.Chainable<Partial<Cypress.RequestOptions>>;
/**
 * Enqueues the plugin task for processing a received response. The plugin internally keeps track
 * of all responses enqueued in this way and will upload them as test execution evidence if the
 * appropriate options are enabled.
 *
 * @param task - the task name
 * @param filename - the name of the evidence file to save the response data to
 * @param response - the response data
 *
 * @see https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/uploadRequestData/
 */
export declare function enqueueTask(task: PluginTask.INCOMING_RESPONSE, filename: string, response: Cypress.Response<unknown>): Cypress.Chainable<Cypress.Response<unknown>>;
/**
 * Models the parameters for the different plugin tasks.
 */
export interface PluginTaskParameterType {
    /**
     * The parameters for an incoming response task.
     */
    [PluginTask.INCOMING_RESPONSE]: {
        /**
         * The filename of the file where the response data should be saved to.
         */
        filename: string;
        /**
         * The response data.
         */
        response: Cypress.Response<unknown>;
        /**
         * The test name where `cy.request` was called.
         */
        test: string;
    };
    /**
     * The parameters for an outgoing request task.
     */
    [PluginTask.OUTGOING_REQUEST]: {
        /**
         * The filename of the file where the request data should be saved to.
         */
        filename: string;
        /**
         * The request data.
         */
        request: Partial<Cypress.RequestOptions>;
        /**
         * The test name where `cy.request` was called.
         */
        test: string;
    };
}
interface PluginTaskReturnType {
    /**
     * The result of an incoming response task.
     */
    [PluginTask.INCOMING_RESPONSE]: Cypress.Response<unknown>;
    /**
     * The result of an outgoing request task.
     */
    [PluginTask.OUTGOING_REQUEST]: Partial<Cypress.RequestOptions>;
}
type TaskListener = {
    [K in PluginTask]: (args: PluginTaskParameterType[K]) => PluginTaskReturnType[K];
};
export declare class PluginTaskListener implements TaskListener {
    private readonly projectKey;
    private readonly evidenceCollection;
    private readonly logger;
    private readonly ignoredTests;
    constructor(projectKey: string, evidenceCollection: EvidenceCollection, logger: Logger);
    [PluginTask.OUTGOING_REQUEST](args: PluginTaskParameterType[PluginTask.OUTGOING_REQUEST]): Partial<Cypress.RequestOptions>;
    [PluginTask.INCOMING_RESPONSE](args: PluginTaskParameterType[PluginTask.INCOMING_RESPONSE]): Cypress.Response<unknown>;
}
export {};
