import type { ClientCombination, InternalCypressXrayPluginOptions } from "../../types/plugin";
import type { ExecutableGraph } from "../../util/graph/executable-graph";
import type { Logger } from "../../util/logging";
import type { Command } from "../command";
declare function addSynchronizationCommands(file: Cypress.FileObject, options: InternalCypressXrayPluginOptions, clients: ClientCombination, graph: ExecutableGraph<Command>, logger: Logger): void;
/**
 * Workaround until module mocking becomes a stable feature. The current approach allows replacing
 * the function with a mocked one.
 *
 * @see https://nodejs.org/docs/latest-v23.x/api/test.html#mockmodulespecifier-options
 */
declare const _default: {
    addSynchronizationCommands: typeof addSynchronizationCommands;
};
export default _default;
