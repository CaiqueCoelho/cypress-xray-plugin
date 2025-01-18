import { BaseJiraClient } from "../../src/client/jira/jira-client";
import { XrayClientCloud } from "../../src/client/xray/xray-client-cloud";
import { ServerClient } from "../../src/client/xray/xray-client-server";
import "dotenv/config";
export declare function getIntegrationClient<T extends "cloud" | "server">(client: "xray", service: T): T extends "cloud" ? XrayClientCloud : ServerClient;
export declare function getIntegrationClient(client: "jira", service: "cloud" | "server"): BaseJiraClient;
