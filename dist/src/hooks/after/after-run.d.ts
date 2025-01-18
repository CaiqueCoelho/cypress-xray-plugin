import type { EvidenceCollection } from "../../context";
import type { CypressRunResultType } from "../../types/cypress/cypress";
import type { ClientCombination, InternalCypressXrayPluginOptions } from "../../types/plugin";
import type { ExecutableGraph } from "../../util/graph/executable-graph";
import type { Logger } from "../../util/logging";
import type { Command } from "../command";
declare function addUploadCommands(results: CypressRunResultType, projectRoot: string, options: InternalCypressXrayPluginOptions, clients: ClientCombination, evidenceCollection: EvidenceCollection, graph: ExecutableGraph<Command>, logger: Logger): Promise<void>;
/**
 * Workaround until module mocking becomes a stable feature. The current approach allows replacing
 * the function with a mocked one.
 *
 * @see https://nodejs.org/docs/latest-v23.x/api/test.html#mockmodulespecifier-options
 */
declare const _default: {
    addUploadCommands: typeof addUploadCommands;
};
export default _default;
