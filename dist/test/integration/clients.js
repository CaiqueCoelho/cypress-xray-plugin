"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntegrationClient = getIntegrationClient;
const axios_1 = __importDefault(require("axios"));
const credentials_1 = require("../../src/client/authentication/credentials");
const requests_1 = require("../../src/client/https/requests");
const jira_client_1 = require("../../src/client/jira/jira-client");
const xray_client_cloud_1 = require("../../src/client/xray/xray-client-cloud");
const xray_client_server_1 = require("../../src/client/xray/xray-client-server");
const string_1 = require("../../src/util/string");
require("dotenv/config");
const HTTP_CLIENT = new requests_1.AxiosRestClient(axios_1.default);
const XRAY_CLIENT_CLOUD = new xray_client_cloud_1.XrayClientCloud(new credentials_1.JwtCredentials(getEnv("CYPRESS_XRAY_CLIENT_ID_CLOUD", "XRAY_CLIENT_ID"), getEnv("CYPRESS_XRAY_CLIENT_SECRET_CLOUD", "XRAY_CLIENT_SECRET"), `${xray_client_cloud_1.XrayClientCloud.URL}/authenticate`, HTTP_CLIENT), HTTP_CLIENT);
const XRAY_CLIENT_SERVER = new xray_client_server_1.ServerClient(getEnv("CYPRESS_JIRA_URL_SERVER"), new credentials_1.BasicAuthCredentials(getEnv("CYPRESS_JIRA_USERNAME_SERVER"), getEnv("CYPRESS_JIRA_PASSWORD_SERVER")), HTTP_CLIENT);
const JIRA_CLIENT_CLOUD = new jira_client_1.BaseJiraClient(getEnv("CYPRESS_JIRA_URL_CLOUD"), new credentials_1.BasicAuthCredentials(getEnv("CYPRESS_JIRA_USERNAME_CLOUD"), getEnv("CYPRESS_JIRA_API_TOKEN_CLOUD")), HTTP_CLIENT);
const JIRA_CLIENT_SERVER = new jira_client_1.BaseJiraClient(getEnv("CYPRESS_JIRA_URL_SERVER"), new credentials_1.BasicAuthCredentials(getEnv("CYPRESS_JIRA_USERNAME_SERVER"), getEnv("CYPRESS_JIRA_PASSWORD_SERVER")), HTTP_CLIENT);
function getIntegrationClient(client, service) {
    switch (client) {
        case "jira": {
            switch (service) {
                case "cloud":
                    return JIRA_CLIENT_CLOUD;
                case "server":
                    return JIRA_CLIENT_SERVER;
                default:
                    throw new Error(`Unknown service type: ${(0, string_1.unknownToString)(service)}`);
            }
        }
        case "xray": {
            switch (service) {
                case "cloud":
                    return XRAY_CLIENT_CLOUD;
                case "server":
                    return XRAY_CLIENT_SERVER;
                default:
                    throw new Error(`Unknown service type: ${(0, string_1.unknownToString)(service)}`);
            }
        }
        default:
            throw new Error(`Unknown client type: ${(0, string_1.unknownToString)(client)}`);
    }
}
function getEnv(...keys) {
    let value;
    for (const key of keys) {
        if (!process.env[key]) {
            continue;
        }
        value = process.env[key];
    }
    if (!value) {
        throw new Error(`Failed to find environment variable value for keys: ${JSON.stringify(keys)}`);
    }
    return value;
}
