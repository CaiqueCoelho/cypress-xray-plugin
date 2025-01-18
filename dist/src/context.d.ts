import type { Command } from "./hooks/command";
import type { ClientCombination, CypressXrayPluginOptions, HttpClientCombination, InternalCucumberOptions, InternalCypressXrayPluginOptions, InternalHttpOptions, InternalJiraOptions, InternalPluginOptions, InternalXrayOptions } from "./types/plugin";
import type { XrayEvidenceItem } from "./types/xray/import-test-execution-results";
import type { CucumberPreprocessorArgs } from "./util/dependencies";
import type { ExecutableGraph } from "./util/graph/executable-graph";
import type { Logger } from "./util/logging";
export interface EvidenceCollection {
    addEvidence(issueKey: string, evidence: XrayEvidenceItem): void;
    getEvidence(issueKey: string): XrayEvidenceItem[];
}
export declare class SimpleEvidenceCollection {
    private readonly collectedEvidence;
    addEvidence(issueKey: string, evidence: XrayEvidenceItem): void;
    getEvidence(issueKey: string): XrayEvidenceItem[];
}
export declare class PluginContext implements EvidenceCollection {
    private readonly clients;
    private readonly internalOptions;
    private readonly cypressOptions;
    private readonly evidenceCollection;
    private readonly graph;
    private readonly logger;
    constructor(clients: ClientCombination, internalOptions: InternalCypressXrayPluginOptions, cypressOptions: Cypress.PluginConfigOptions, evidenceCollection: EvidenceCollection, graph: ExecutableGraph<Command>, logger: Logger);
    getClients(): ClientCombination;
    getOptions(): InternalCypressXrayPluginOptions;
    getCypressOptions(): Cypress.PluginConfigOptions;
    getGraph(): ExecutableGraph<Command>;
    getLogger(): Logger;
    addEvidence(issueKey: string, evidence: XrayEvidenceItem): void;
    getEvidence(issueKey: string): XrayEvidenceItem[];
}
declare function getGlobalContext(): PluginContext | undefined;
declare function setGlobalContext(newContext?: PluginContext): void;
/**
 * Returns an {@link InternalJiraOptions | `InternalJiraOptions`} instance based on parsed
 * environment variables and a provided options object. Environment variables will take precedence
 * over the options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing Jira options
 * @returns the constructed internal Jira options
 */
declare function initJiraOptions(env: Cypress.ObjectLike, options: CypressXrayPluginOptions["jira"]): InternalJiraOptions;
/**
 * Returns an {@link InternalPluginOptions | `InternalPluginOptions`} instance based on parsed
 * environment variables and a provided options object. Environment variables will take precedence
 * over the options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing plugin options
 * @returns the constructed internal plugin options
 */
declare function initPluginOptions(env: Cypress.ObjectLike, options: CypressXrayPluginOptions["plugin"]): InternalPluginOptions;
/**
 * Returns an {@link InternalXrayOptions | `InternalXrayOptions`} instance based on parsed environment
 * variables and a provided options object. Environment variables will take precedence over the
 * options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing Xray options
 * @returns the constructed internal Xray options
 */
declare function initXrayOptions(env: Cypress.ObjectLike, options: CypressXrayPluginOptions["xray"]): InternalXrayOptions;
/**
 * Returns an {@link InternalCucumberOptions | `InternalCucumberOptions`} instance based on parsed
 * environment variables and a provided options object. Environment variables will take precedence
 * over the options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing Cucumber options
 * @returns the constructed internal Cucumber options
 */
declare function initCucumberOptions(config: CucumberPreprocessorArgs[0], options: CypressXrayPluginOptions["cucumber"]): Promise<InternalCucumberOptions | undefined>;
declare function initHttpClients(pluginOptions?: Pick<InternalPluginOptions, "debug">, httpOptions?: InternalHttpOptions): HttpClientCombination;
declare function initClients(jiraOptions: InternalJiraOptions, env: Cypress.ObjectLike, httpClients: HttpClientCombination): Promise<ClientCombination>;
/**
 * Workaround until module mocking becomes a stable feature. The current approach allows replacing
 * the functions with a mocked one.
 *
 * @see https://nodejs.org/docs/latest-v23.x/api/test.html#mockmodulespecifier-options
 */
declare const _default: {
    getGlobalContext: typeof getGlobalContext;
    initClients: typeof initClients;
    initCucumberOptions: typeof initCucumberOptions;
    initHttpClients: typeof initHttpClients;
    initJiraOptions: typeof initJiraOptions;
    initPluginOptions: typeof initPluginOptions;
    initXrayOptions: typeof initXrayOptions;
    setGlobalContext: typeof setGlobalContext;
};
export default _default;
