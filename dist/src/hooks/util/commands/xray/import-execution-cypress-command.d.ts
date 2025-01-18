import type { XrayClient } from "../../../../client/xray/xray-client";
import type { Logger } from "../../../../util/logging";
import type { Computable } from "../../../command";
import { Command } from "../../../command";
interface CommandParameters {
    xrayClient: XrayClient;
}
export declare class ImportExecutionCypressCommand extends Command<string, CommandParameters> {
    private readonly execution;
    constructor(parameters: CommandParameters, logger: Logger, execution: Computable<Parameters<XrayClient["importExecutionMultipart"]>>);
    protected computeResult(): Promise<string>;
}
export {};
