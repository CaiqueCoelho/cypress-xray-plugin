import type { JiraClient } from "../../../../client/jira/jira-client";
import type { IssueTypeDetails } from "../../../../types/jira/responses/issue-type-details";
import { Command } from "../../../command";
interface Parameters {
    jiraClient: JiraClient;
}
export declare class FetchIssueTypesCommand extends Command<IssueTypeDetails[], Parameters> {
    protected computeResult(): Promise<IssueTypeDetails[]>;
}
export {};
