import type { CypressRunResultType } from "../../../types/cypress/cypress";
import type { Logger } from "../../../util/logging";
import type { Computable } from "../../command";
import { Command } from "../../command";
export declare class ExtractVideoFilesCommand extends Command<string[], null> {
    private readonly cypressRunResult;
    constructor(logger: Logger, cypressRunResult: Computable<CypressRunResultType>);
    protected computeResult(): Promise<string[]>;
}
