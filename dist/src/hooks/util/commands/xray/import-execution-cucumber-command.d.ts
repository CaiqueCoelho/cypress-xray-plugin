import type { XrayClient } from "../../../../client/xray/xray-client";
import type { CucumberMultipart } from "../../../../types/xray/requests/import-execution-cucumber-multipart";
import type { Logger } from "../../../../util/logging";
import type { Computable } from "../../../command";
import { Command } from "../../../command";
interface Parameters {
    xrayClient: XrayClient;
}
export declare class ImportExecutionCucumberCommand extends Command<string, Parameters> {
    private readonly cucumberMultipart;
    constructor(parameters: Parameters, logger: Logger, cucumberMultipart: Computable<CucumberMultipart>);
    protected computeResult(): Promise<string>;
}
export {};
