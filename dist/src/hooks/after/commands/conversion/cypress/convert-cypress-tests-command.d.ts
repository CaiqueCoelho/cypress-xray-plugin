import type { EvidenceCollection } from "../../../../../context";
import type { CypressRunResultType } from "../../../../../types/cypress/cypress";
import type { InternalXrayOptions } from "../../../../../types/plugin";
import type { XrayTest } from "../../../../../types/xray/import-test-execution-results";
import type { Logger } from "../../../../../util/logging";
import type { Computable } from "../../../../command";
import { Command } from "../../../../command";
interface Parameters {
    evidenceCollection: EvidenceCollection;
    featureFileExtension?: string;
    normalizeScreenshotNames: boolean;
    projectKey: string;
    uploadScreenshots: boolean;
    useCloudStatusFallback?: boolean;
    xrayStatus: InternalXrayOptions["status"];
}
export declare class ConvertCypressTestsCommand extends Command<[XrayTest, ...XrayTest[]], Parameters> {
    private readonly results;
    constructor(parameters: Parameters, logger: Logger, results: Computable<CypressRunResultType>);
    protected computeResult(): Promise<[XrayTest, ...XrayTest[]]>;
    private convertTestRuns;
    private addScreenshotEvidence;
    private getTest;
    private getXrayStatus;
    private getXrayEvidence;
}
export {};
