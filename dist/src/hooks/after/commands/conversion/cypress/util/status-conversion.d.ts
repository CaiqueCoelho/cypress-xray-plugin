import { CypressStatus } from "../../../../../../types/cypress/status";
/**
 * Converts the given status text string to a valid Cypress attempt status.
 *
 * @param statusText - the status text
 * @returns the Cypress attempt status
 * @throws if the status text cannot be mapped to a valid Cypress attempt status
 */
export declare function toCypressStatus(statusText: string): CypressStatus;
/**
 * Converts the given Cypress status to an Xray status. If any of the following are `undefined`,
 * their respective Xray cloud or Xray server status values will be returned instead according to
 * `useCloudStatus`:
 *
 * - `statusOptions.passed`
 * - `statusOptions.failed`
 * - `statusOptions.pending`
 * - `statusOptions.skipped`
 *
 * @param state - the status text
 * @param useCloudStatus - whether to default to Xray cloud test statuses or Xray server ones
 * @param options - optional custom statuses
 * @returns the Xray status
 */
export declare function getXrayStatus(status: CypressStatus, useCloudStatus: boolean, statusOptions?: {
    failed?: string;
    passed?: string;
    pending?: string;
    skipped?: string;
}): string;
