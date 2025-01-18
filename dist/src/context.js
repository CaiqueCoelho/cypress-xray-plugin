"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginContext = exports.SimpleEvidenceCollection = void 0;
const axios_1 = __importDefault(require("axios"));
const credentials_1 = require("./client/authentication/credentials");
const requests_1 = require("./client/https/requests");
const jira_client_1 = require("./client/jira/jira-client");
const xray_client_cloud_1 = require("./client/xray/xray-client-cloud");
const xray_client_server_1 = require("./client/xray/xray-client-server");
const env_1 = require("./env");
const dedent_1 = require("./util/dedent");
const dependencies_1 = __importDefault(require("./util/dependencies"));
const errors_1 = require("./util/errors");
const help_1 = require("./util/help");
const logging_1 = require("./util/logging");
const parsing_1 = require("./util/parsing");
class SimpleEvidenceCollection {
    constructor() {
        this.collectedEvidence = new Map();
    }
    addEvidence(issueKey, evidence) {
        const currentEvidence = this.collectedEvidence.get(issueKey);
        if (!currentEvidence) {
            this.collectedEvidence.set(issueKey, [evidence]);
        }
        else {
            currentEvidence.push(evidence);
        }
    }
    getEvidence(issueKey) {
        var _a;
        return (_a = this.collectedEvidence.get(issueKey)) !== null && _a !== void 0 ? _a : [];
    }
}
exports.SimpleEvidenceCollection = SimpleEvidenceCollection;
class PluginContext {
    constructor(clients, internalOptions, cypressOptions, evidenceCollection, graph, logger) {
        this.clients = clients;
        this.internalOptions = internalOptions;
        this.cypressOptions = cypressOptions;
        this.evidenceCollection = evidenceCollection;
        this.graph = graph;
        this.logger = logger;
    }
    getClients() {
        return this.clients;
    }
    getOptions() {
        return this.internalOptions;
    }
    getCypressOptions() {
        return this.cypressOptions;
    }
    getGraph() {
        return this.graph;
    }
    getLogger() {
        return this.logger;
    }
    addEvidence(issueKey, evidence) {
        this.evidenceCollection.addEvidence(issueKey, evidence);
        logging_1.LOG.message(logging_1.Level.DEBUG, `Added evidence for test ${issueKey}: ${evidence.filename}`);
    }
    getEvidence(issueKey) {
        return this.evidenceCollection.getEvidence(issueKey);
    }
}
exports.PluginContext = PluginContext;
let context = undefined;
function getGlobalContext() {
    return context;
}
function setGlobalContext(newContext) {
    context = newContext;
}
/**
 * Returns an {@link InternalJiraOptions | `InternalJiraOptions`} instance based on parsed
 * environment variables and a provided options object. Environment variables will take precedence
 * over the options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing Jira options
 * @returns the constructed internal Jira options
 */
function initJiraOptions(env, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    const projectKey = (_a = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.projectKey, parsing_1.asString)) !== null && _a !== void 0 ? _a : options.projectKey;
    if (!projectKey) {
        throw new Error("Plugin misconfiguration: Jira project key was not set");
    }
    return {
        attachVideos: (_c = (_b = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.attachVideos, parsing_1.asBoolean)) !== null && _b !== void 0 ? _b : options.attachVideos) !== null && _c !== void 0 ? _c : false,
        fields: {
            description: (_d = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.description, parsing_1.asString)) !== null && _d !== void 0 ? _d : (_e = options.fields) === null || _e === void 0 ? void 0 : _e.description,
            labels: (_f = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.labels, parsing_1.asString)) !== null && _f !== void 0 ? _f : (_g = options.fields) === null || _g === void 0 ? void 0 : _g.labels,
            summary: (_h = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.summary, parsing_1.asString)) !== null && _h !== void 0 ? _h : (_j = options.fields) === null || _j === void 0 ? void 0 : _j.summary,
            testEnvironments: (_k = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.testEnvironments, parsing_1.asString)) !== null && _k !== void 0 ? _k : (_l = options.fields) === null || _l === void 0 ? void 0 : _l.testEnvironments,
            testPlan: (_m = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.testPlan, parsing_1.asString)) !== null && _m !== void 0 ? _m : (_o = options.fields) === null || _o === void 0 ? void 0 : _o.testPlan,
        },
        projectKey: projectKey,
        testExecutionIssue: (_p = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testExecutionIssue, parsing_1.asObject)) !== null && _p !== void 0 ? _p : options.testExecutionIssue,
        testExecutionIssueDescription: (_q = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testExecutionIssueDescription, parsing_1.asString)) !== null && _q !== void 0 ? _q : options.testExecutionIssueDescription,
        testExecutionIssueKey: (_r = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testExecutionIssueKey, parsing_1.asString)) !== null && _r !== void 0 ? _r : options.testExecutionIssueKey,
        testExecutionIssueSummary: (_s = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testExecutionIssueSummary, parsing_1.asString)) !== null && _s !== void 0 ? _s : options.testExecutionIssueSummary,
        testExecutionIssueType: (_u = (_t = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testExecutionIssueType, parsing_1.asString)) !== null && _t !== void 0 ? _t : options.testExecutionIssueType) !== null && _u !== void 0 ? _u : "Test Execution",
        testPlanIssueKey: (_v = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testPlanIssueKey, parsing_1.asString)) !== null && _v !== void 0 ? _v : options.testPlanIssueKey,
        testPlanIssueType: (_x = (_w = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testPlanIssueType, parsing_1.asString)) !== null && _w !== void 0 ? _w : options.testPlanIssueType) !== null && _x !== void 0 ? _x : "Test Plan",
        url: (_y = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.url, parsing_1.asString)) !== null && _y !== void 0 ? _y : options.url,
    };
}
/**
 * Returns an {@link InternalPluginOptions | `InternalPluginOptions`} instance based on parsed
 * environment variables and a provided options object. Environment variables will take precedence
 * over the options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing plugin options
 * @returns the constructed internal plugin options
 */
function initPluginOptions(env, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        debug: (_b = (_a = (0, parsing_1.parse)(env, env_1.ENV_NAMES.plugin.debug, parsing_1.asBoolean)) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.debug) !== null && _b !== void 0 ? _b : false,
        enabled: (_d = (_c = (0, parsing_1.parse)(env, env_1.ENV_NAMES.plugin.enabled, parsing_1.asBoolean)) !== null && _c !== void 0 ? _c : options === null || options === void 0 ? void 0 : options.enabled) !== null && _d !== void 0 ? _d : true,
        logDirectory: (_f = (_e = (0, parsing_1.parse)(env, env_1.ENV_NAMES.plugin.logDirectory, parsing_1.asString)) !== null && _e !== void 0 ? _e : options === null || options === void 0 ? void 0 : options.logDirectory) !== null && _f !== void 0 ? _f : "logs",
        normalizeScreenshotNames: (_h = (_g = (0, parsing_1.parse)(env, env_1.ENV_NAMES.plugin.normalizeScreenshotNames, parsing_1.asBoolean)) !== null && _g !== void 0 ? _g : options === null || options === void 0 ? void 0 : options.normalizeScreenshotNames) !== null && _h !== void 0 ? _h : false,
    };
}
/**
 * Returns an {@link InternalXrayOptions | `InternalXrayOptions`} instance based on parsed environment
 * variables and a provided options object. Environment variables will take precedence over the
 * options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing Xray options
 * @returns the constructed internal Xray options
 */
function initXrayOptions(env, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    return {
        status: {
            failed: (_a = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.failed, parsing_1.asString)) !== null && _a !== void 0 ? _a : (_b = options === null || options === void 0 ? void 0 : options.status) === null || _b === void 0 ? void 0 : _b.failed,
            passed: (_c = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.passed, parsing_1.asString)) !== null && _c !== void 0 ? _c : (_d = options === null || options === void 0 ? void 0 : options.status) === null || _d === void 0 ? void 0 : _d.passed,
            pending: (_e = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.pending, parsing_1.asString)) !== null && _e !== void 0 ? _e : (_f = options === null || options === void 0 ? void 0 : options.status) === null || _f === void 0 ? void 0 : _f.pending,
            skipped: (_g = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.skipped, parsing_1.asString)) !== null && _g !== void 0 ? _g : (_h = options === null || options === void 0 ? void 0 : options.status) === null || _h === void 0 ? void 0 : _h.skipped,
            step: {
                failed: (_j = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.step.failed, parsing_1.asString)) !== null && _j !== void 0 ? _j : (_l = (_k = options === null || options === void 0 ? void 0 : options.status) === null || _k === void 0 ? void 0 : _k.step) === null || _l === void 0 ? void 0 : _l.failed,
                passed: (_m = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.step.passed, parsing_1.asString)) !== null && _m !== void 0 ? _m : (_p = (_o = options === null || options === void 0 ? void 0 : options.status) === null || _o === void 0 ? void 0 : _o.step) === null || _p === void 0 ? void 0 : _p.passed,
                pending: (_q = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.step.pending, parsing_1.asString)) !== null && _q !== void 0 ? _q : (_s = (_r = options === null || options === void 0 ? void 0 : options.status) === null || _r === void 0 ? void 0 : _r.step) === null || _s === void 0 ? void 0 : _s.pending,
                skipped: (_t = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.step.skipped, parsing_1.asString)) !== null && _t !== void 0 ? _t : (_v = (_u = options === null || options === void 0 ? void 0 : options.status) === null || _u === void 0 ? void 0 : _u.step) === null || _v === void 0 ? void 0 : _v.skipped,
            },
        },
        testEnvironments: (_w = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.testEnvironments, parsing_1.asArrayOfStrings)) !== null && _w !== void 0 ? _w : options === null || options === void 0 ? void 0 : options.testEnvironments,
        uploadRequests: (_y = (_x = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.uploadRequests, parsing_1.asBoolean)) !== null && _x !== void 0 ? _x : options === null || options === void 0 ? void 0 : options.uploadRequests) !== null && _y !== void 0 ? _y : false,
        uploadResults: (_0 = (_z = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.uploadResults, parsing_1.asBoolean)) !== null && _z !== void 0 ? _z : options === null || options === void 0 ? void 0 : options.uploadResults) !== null && _0 !== void 0 ? _0 : true,
        uploadScreenshots: (_2 = (_1 = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.uploadScreenshots, parsing_1.asBoolean)) !== null && _1 !== void 0 ? _1 : options === null || options === void 0 ? void 0 : options.uploadScreenshots) !== null && _2 !== void 0 ? _2 : true,
    };
}
/**
 * Returns an {@link InternalCucumberOptions | `InternalCucumberOptions`} instance based on parsed
 * environment variables and a provided options object. Environment variables will take precedence
 * over the options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing Cucumber options
 * @returns the constructed internal Cucumber options
 */
async function initCucumberOptions(config, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // Check if the user has chosen to upload Cucumber results, too.
    const featureFileExtension = (_a = (0, parsing_1.parse)(config.env, env_1.ENV_NAMES.cucumber.featureFileExtension, parsing_1.asString)) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.featureFileExtension;
    // If the user has chosen to do so, we need to make sure they configured the Cucumber
    // preprocessor JSON report as well. Otherwise, results upload will not work.
    if (featureFileExtension) {
        let preprocessor;
        try {
            preprocessor = await dependencies_1.default.importOptionalDependency("@badeball/cypress-cucumber-preprocessor");
        }
        catch (error) {
            throw new Error((0, dedent_1.dedent)(`
                    Plugin dependency misconfigured: @badeball/cypress-cucumber-preprocessor

                    ${(0, errors_1.errorMessage)(error)}

                    The plugin depends on the package and should automatically download it during installation, but might have failed to do so because of conflicting Node versions

                    Make sure to install the package manually using: npm install @badeball/cypress-cucumber-preprocessor --save-dev
                `));
        }
        logging_1.LOG.message(logging_1.Level.DEBUG, `Successfully resolved configuration of @badeball/cypress-cucumber-preprocessor package`);
        const preprocessorConfiguration = await preprocessor.resolvePreprocessorConfiguration(config, config.env, "/");
        if (!preprocessorConfiguration.json.enabled) {
            throw new Error((0, dedent_1.dedent)(`
                    Plugin misconfiguration: Cucumber preprocessor JSON report disabled

                    Make sure to enable the JSON report as described in https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/json-report.md
                `));
        }
        if (!preprocessorConfiguration.json.output) {
            throw new Error((0, dedent_1.dedent)(`
                    Plugin misconfiguration: Cucumber preprocessor JSON report path was not set

                    Make sure to configure the JSON report path as described in https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/json-report.md
                `));
        }
        return {
            downloadFeatures: (_c = (_b = (0, parsing_1.parse)(config.env, env_1.ENV_NAMES.cucumber.downloadFeatures, parsing_1.asBoolean)) !== null && _b !== void 0 ? _b : options === null || options === void 0 ? void 0 : options.downloadFeatures) !== null && _c !== void 0 ? _c : false,
            featureFileExtension: featureFileExtension,
            prefixes: {
                precondition: (_d = (0, parsing_1.parse)(config.env, env_1.ENV_NAMES.cucumber.prefixes.precondition, parsing_1.asString)) !== null && _d !== void 0 ? _d : (_e = options === null || options === void 0 ? void 0 : options.prefixes) === null || _e === void 0 ? void 0 : _e.precondition,
                test: (_f = (0, parsing_1.parse)(config.env, env_1.ENV_NAMES.cucumber.prefixes.test, parsing_1.asString)) !== null && _f !== void 0 ? _f : (_g = options === null || options === void 0 ? void 0 : options.prefixes) === null || _g === void 0 ? void 0 : _g.test,
            },
            preprocessor: preprocessorConfiguration,
            uploadFeatures: (_j = (_h = (0, parsing_1.parse)(config.env, env_1.ENV_NAMES.cucumber.uploadFeatures, parsing_1.asBoolean)) !== null && _h !== void 0 ? _h : options === null || options === void 0 ? void 0 : options.uploadFeatures) !== null && _j !== void 0 ? _j : false,
        };
    }
    return undefined;
}
function initHttpClients(pluginOptions, httpOptions) {
    let jiraClient = undefined;
    let xrayClient = undefined;
    if (httpOptions) {
        const { jira, rateLimiting: rateLimitingCommon, xray, ...httpConfigCommon } = httpOptions;
        if (jira) {
            const { rateLimiting: rateLimitingJira, ...httpConfig } = jira;
            jiraClient = new requests_1.AxiosRestClient(axios_1.default, {
                debug: pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.debug,
                http: {
                    ...httpConfigCommon,
                    ...httpConfig,
                },
                rateLimiting: rateLimitingJira !== null && rateLimitingJira !== void 0 ? rateLimitingJira : rateLimitingCommon,
            });
        }
        if (xray) {
            const { rateLimiting: rateLimitingXray, ...httpConfig } = xray;
            xrayClient = new requests_1.AxiosRestClient(axios_1.default, {
                debug: pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.debug,
                http: {
                    ...httpConfigCommon,
                    ...httpConfig,
                },
                rateLimiting: rateLimitingXray !== null && rateLimitingXray !== void 0 ? rateLimitingXray : rateLimitingCommon,
            });
        }
        if (!jiraClient || !xrayClient) {
            const httpClient = new requests_1.AxiosRestClient(axios_1.default, {
                debug: pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.debug,
                http: httpConfigCommon,
                rateLimiting: rateLimitingCommon,
            });
            if (!jiraClient) {
                jiraClient = httpClient;
            }
            if (!xrayClient) {
                xrayClient = httpClient;
            }
        }
    }
    else {
        const httpClient = new requests_1.AxiosRestClient(axios_1.default, {
            debug: pluginOptions === null || pluginOptions === void 0 ? void 0 : pluginOptions.debug,
        });
        jiraClient = httpClient;
        xrayClient = httpClient;
    }
    return {
        jira: jiraClient,
        xray: xrayClient,
    };
}
async function initClients(jiraOptions, env, httpClients) {
    if (env_1.ENV_NAMES.authentication.jira.username in env &&
        env_1.ENV_NAMES.authentication.jira.apiToken in env) {
        logging_1.LOG.message(logging_1.Level.INFO, "Jira username and API token found. Setting up Jira cloud basic auth credentials.");
        const credentials = new credentials_1.BasicAuthCredentials(env[env_1.ENV_NAMES.authentication.jira.username], env[env_1.ENV_NAMES.authentication.jira.apiToken]);
        const jiraClient = await getJiraClient(jiraOptions.url, credentials, httpClients.jira);
        if (env_1.ENV_NAMES.authentication.xray.clientId in env &&
            env_1.ENV_NAMES.authentication.xray.clientSecret in env) {
            logging_1.LOG.message(logging_1.Level.INFO, "Xray client ID and client secret found. Setting up Xray cloud JWT credentials.");
            const xrayCredentials = new credentials_1.JwtCredentials(env[env_1.ENV_NAMES.authentication.xray.clientId], env[env_1.ENV_NAMES.authentication.xray.clientSecret], `${xray_client_cloud_1.XrayClientCloud.URL}/authenticate`, httpClients.xray);
            const xrayClient = await getXrayCloudClient(xrayCredentials, httpClients.xray);
            return {
                jiraClient: jiraClient,
                kind: "cloud",
                xrayClient: xrayClient,
            };
        }
        throw new Error((0, dedent_1.dedent)(`
                Failed to configure Xray client: Jira cloud credentials detected, but the provided Xray credentials are not Xray cloud credentials.

                  You can find all configurations currently supported at: ${help_1.HELP.plugin.configuration.authentication.root}
            `));
    }
    else if (env_1.ENV_NAMES.authentication.jira.apiToken in env) {
        logging_1.LOG.message(logging_1.Level.INFO, "Jira PAT found. Setting up Jira server PAT credentials.");
        const credentials = new credentials_1.PatCredentials(env[env_1.ENV_NAMES.authentication.jira.apiToken]);
        const jiraClient = await getJiraClient(jiraOptions.url, credentials, httpClients.jira);
        logging_1.LOG.message(logging_1.Level.INFO, "Jira PAT found. Setting up Xray server PAT credentials.");
        const xrayClient = await getXrayServerClient(jiraOptions.url, credentials, httpClients.xray);
        return {
            jiraClient: jiraClient,
            kind: "server",
            xrayClient: xrayClient,
        };
    }
    else if (env_1.ENV_NAMES.authentication.jira.username in env &&
        env_1.ENV_NAMES.authentication.jira.password in env) {
        logging_1.LOG.message(logging_1.Level.INFO, "Jira username and password found. Setting up Jira server basic auth credentials.");
        const credentials = new credentials_1.BasicAuthCredentials(env[env_1.ENV_NAMES.authentication.jira.username], env[env_1.ENV_NAMES.authentication.jira.password]);
        const jiraClient = await getJiraClient(jiraOptions.url, credentials, httpClients.jira);
        logging_1.LOG.message(logging_1.Level.INFO, "Jira username and password found. Setting up Xray server basic auth credentials.");
        const xrayClient = await getXrayServerClient(jiraOptions.url, credentials, httpClients.xray);
        return {
            jiraClient: jiraClient,
            kind: "server",
            xrayClient: xrayClient,
        };
    }
    throw new Error((0, dedent_1.dedent)(`
            Failed to configure Jira client: No viable authentication method was configured.

              You can find all configurations currently supported at: ${help_1.HELP.plugin.configuration.authentication.root}
        `));
}
async function getXrayCloudClient(credentials, httpClient) {
    const xrayClient = new xray_client_cloud_1.XrayClientCloud(credentials, httpClient);
    try {
        await credentials.getAuthorizationHeader();
        logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                Successfully established communication with: ${credentials.getAuthenticationUrl()}

                  The provided credentials belong to a user with a valid Xray license.
            `));
    }
    catch (error) {
        throw new Error((0, dedent_1.dedent)(`
                Failed to establish communication with Xray: ${credentials.getAuthenticationUrl()}

                  ${(0, errors_1.errorMessage)(error)}

                Make sure you have correctly set up:
                - Xray cloud authentication: ${help_1.HELP.plugin.configuration.authentication.xray.cloud}
                - Xray itself: ${help_1.HELP.xray.installation.cloud}

                For more information, set the plugin to debug mode: ${help_1.HELP.plugin.configuration.plugin.debug}
            `));
    }
    return xrayClient;
}
async function getXrayServerClient(url, credentials, httpClient) {
    const xrayClient = new xray_client_server_1.ServerClient(url, credentials, httpClient);
    try {
        const license = await xrayClient.getXrayLicense();
        if (typeof license === "object" && "active" in license) {
            if (license.active) {
                logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                        Successfully established communication with: ${url}

                          Xray license is active: ${license.licenseType}
                    `));
                return xrayClient;
            }
            else {
                throw new Error("The Xray license is not active");
            }
        }
        throw new Error((0, dedent_1.dedent)(`
                Xray did not return a valid response: JSON containing basic Xray license information was expected, but not received.
            `));
    }
    catch (error) {
        throw new Error((0, dedent_1.dedent)(`
                Failed to establish communication with Xray: ${url}

                  ${(0, errors_1.errorMessage)(error)}

                Make sure you have correctly set up:
                - Jira base URL: ${help_1.HELP.plugin.configuration.jira.url}
                - Xray server authentication: ${help_1.HELP.plugin.configuration.authentication.xray.server}
                - Xray itself: ${help_1.HELP.xray.installation.server}

                For more information, set the plugin to debug mode: ${help_1.HELP.plugin.configuration.plugin.debug}
            `));
    }
}
async function getJiraClient(url, credentials, httpClient) {
    var _a, _b;
    const jiraClient = new jira_client_1.BaseJiraClient(url, credentials, httpClient);
    try {
        const userDetails = await jiraClient.getMyself();
        const username = (_b = (_a = userDetails.displayName) !== null && _a !== void 0 ? _a : userDetails.emailAddress) !== null && _b !== void 0 ? _b : userDetails.name;
        if (username) {
            logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)(`
                    Successfully established communication with: ${url}

                      The provided Jira credentials belong to: ${username}
               `));
            return jiraClient;
        }
        else {
            throw new Error((0, dedent_1.dedent)(`
                Jira did not return a valid response: JSON containing a username was expected, but not received.
            `));
        }
    }
    catch (error) {
        throw new Error((0, dedent_1.dedent)(`
                Failed to establish communication with Jira: ${url}

                  ${(0, errors_1.errorMessage)(error)}

                Make sure you have correctly set up:
                - Jira base URL: ${help_1.HELP.plugin.configuration.jira.url}
                - Jira authentication: ${help_1.HELP.plugin.configuration.authentication.jira.root}

                For more information, set the plugin to debug mode: ${help_1.HELP.plugin.configuration.plugin.debug}
            `));
    }
}
/**
 * Workaround until module mocking becomes a stable feature. The current approach allows replacing
 * the functions with a mocked one.
 *
 * @see https://nodejs.org/docs/latest-v23.x/api/test.html#mockmodulespecifier-options
 */
exports.default = {
    getGlobalContext,
    initClients,
    initCucumberOptions,
    initHttpClients,
    initJiraOptions,
    initPluginOptions,
    initXrayOptions,
    setGlobalContext,
};
