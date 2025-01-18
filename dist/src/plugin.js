"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPlugin = resetPlugin;
exports.configureXrayPlugin = configureXrayPlugin;
exports.syncFeatureFile = syncFeatureFile;
const path_1 = __importDefault(require("path"));
const context_1 = __importStar(require("./context"));
const tasks_1 = require("./cypress/tasks");
const after_run_1 = __importDefault(require("./hooks/after/after-run"));
const file_preprocessor_1 = __importDefault(require("./hooks/preprocessor/file-preprocessor"));
const dedent_1 = require("./util/dedent");
const executable_graph_1 = require("./util/graph/executable-graph");
const graph_logger_1 = require("./util/graph/logging/graph-logger");
const help_1 = require("./util/help");
const logging_1 = require("./util/logging");
let canShowInitializationWarning = true;
/**
 * Resets the plugin including its context.
 */
function resetPlugin() {
    context_1.default.setGlobalContext(undefined);
    canShowInitializationWarning = true;
}
/**
 * Configures the plugin. The plugin will check all environment variables passed in
 * {@link Cypress.PluginConfigOptions.env | `config.env`} and merge them with those specified in
 * `options`. Environment variables always override values specified in `options`.
 *
 * *Note: This method will register upload hooks under the Cypress `before:run`, `after:run` and
 * `task` events. Consider using [`cypress-on-fix`](https://github.com/bahmutov/cypress-on-fix) if
 * you have these hooks registered to prevent the plugin from replacing them.*
 *
 * @param on - the Cypress event registration functon
 * @param config - the Cypress configuration
 * @param options - the plugin options
 *
 * @see https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/uploadTestResults/#setup
 */
async function configureXrayPlugin(on, config, options) {
    canShowInitializationWarning = false;
    // Resolve these before all other options for correct enabledness.
    const pluginOptions = context_1.default.initPluginOptions(config.env, options.plugin);
    if (!pluginOptions.enabled) {
        logging_1.LOG.message(logging_1.Level.INFO, "Plugin disabled. Skipping further configuration.");
        // Tasks must always be registered in case users forget to comment out imported commands.
        registerDefaultTasks(on);
        return;
    }
    // We should be using config.isInteractive here, but cannot currently because of a bug.
    // See: https://github.com/cypress-io/cypress/issues/20789
    if (!config.isTextTerminal) {
        pluginOptions.enabled = false;
        logging_1.LOG.message(logging_1.Level.INFO, "Interactive mode detected, disabling plugin.");
        // Tasks must always be registered in case users forget to comment out imported commands.
        registerDefaultTasks(on);
        return;
    }
    // Init logging before all other configurations because they might require an initialized
    // logging module.
    if (!path_1.default.isAbsolute(pluginOptions.logDirectory)) {
        // Cypress might change process.cwd(), so we need to query the root directory.
        // See: https://github.com/cypress-io/cypress/issues/22689
        pluginOptions.logDirectory = path_1.default.resolve(config.projectRoot, pluginOptions.logDirectory);
    }
    logging_1.LOG.configure({
        debug: pluginOptions.debug,
        logDirectory: pluginOptions.logDirectory,
    });
    const internalOptions = {
        cucumber: await context_1.default.initCucumberOptions(config, options.cucumber),
        http: options.http,
        jira: context_1.default.initJiraOptions(config.env, options.jira),
        plugin: pluginOptions,
        xray: context_1.default.initXrayOptions(config.env, options.xray),
    };
    const httpClients = context_1.default.initHttpClients(internalOptions.plugin, internalOptions.http);
    const logger = new logging_1.CapturingLogger();
    const context = new context_1.PluginContext(await context_1.default.initClients(internalOptions.jira, config.env, httpClients), internalOptions, config, new context_1.SimpleEvidenceCollection(), new executable_graph_1.ExecutableGraph(), logger);
    context_1.default.setGlobalContext(context);
    const listener = new tasks_1.PluginTaskListener(internalOptions.jira.projectKey, context, logger);
    on("task", {
        [tasks_1.PluginTask.INCOMING_RESPONSE]: (args) => {
            if (internalOptions.xray.uploadRequests) {
                return listener[tasks_1.PluginTask.INCOMING_RESPONSE](args);
            }
            return args.response;
        },
        [tasks_1.PluginTask.OUTGOING_REQUEST]: (args) => {
            if (internalOptions.xray.uploadRequests) {
                return listener[tasks_1.PluginTask.OUTGOING_REQUEST](args);
            }
            return args.request;
        },
    });
    on("after:run", async (results) => {
        if (context.getOptions().xray.uploadResults) {
            if ("status" in results && results.status === "failed") {
                const failedResult = results;
                logging_1.LOG.message(logging_1.Level.ERROR, (0, dedent_1.dedent)(`
                        Skipping results upload: Failed to run ${failedResult.failures.toString()} tests.

                          ${failedResult.message}
                    `));
            }
            else {
                await after_run_1.default.addUploadCommands(results, context.getCypressOptions().projectRoot, context.getOptions(), context.getClients(), context, context.getGraph(), logger);
            }
        }
        else {
            logging_1.LOG.message(logging_1.Level.INFO, "Skipping results upload: Plugin is configured to not upload test results.");
        }
        try {
            await context.getGraph().execute();
        }
        finally {
            new graph_logger_1.ChainingCommandGraphLogger(logger).logGraph(context.getGraph());
            const messages = logger.getMessages();
            messages.forEach(([level, text]) => {
                if ([logging_1.Level.DEBUG, logging_1.Level.INFO, logging_1.Level.SUCCESS].includes(level)) {
                    logging_1.LOG.message(level, text);
                }
            });
            if (messages.some(([level]) => level === logging_1.Level.WARNING || level === logging_1.Level.ERROR)) {
                logging_1.LOG.message(logging_1.Level.WARNING, "Encountered problems during plugin execution!");
                messages
                    .filter(([level]) => level === logging_1.Level.WARNING)
                    .forEach(([level, text]) => {
                    logging_1.LOG.message(level, text);
                });
                messages
                    .filter(([level]) => level === logging_1.Level.ERROR)
                    .forEach(([level, text]) => {
                    logging_1.LOG.message(level, text);
                });
            }
            logger.getFileLogErrorMessages().forEach(([error, filename]) => {
                logging_1.LOG.logErrorToFile(error, filename);
            });
            logger.getFileLogMessages().forEach(([data, filename]) => {
                logging_1.LOG.logToFile(data, filename);
            });
        }
    });
}
/**
 * Attempts to synchronize the Cucumber feature file with Xray. If the filename does not end with
 * the configured {@link https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#featurefileextension | feature file extension},
 * this method will not upload anything to Xray.
 *
 * @param file - the Cypress file object
 * @returns the unmodified file's path
 */
function syncFeatureFile(file) {
    const context = context_1.default.getGlobalContext();
    if (!context) {
        if (canShowInitializationWarning) {
            logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)(`
                    ${file.filePath}

                      Skipping file:preprocessor hook: Plugin misconfigured: configureXrayPlugin() was not called.

                      Make sure your project is set up correctly: ${help_1.HELP.plugin.configuration.introduction}
                `));
        }
        return file.filePath;
    }
    if (!context.getOptions().plugin.enabled) {
        logging_1.LOG.message(logging_1.Level.INFO, (0, dedent_1.dedent)(`
                ${file.filePath}

                  Plugin disabled. Skipping feature file synchronization.
            `));
        return file.filePath;
    }
    const cucumberOptions = context.getOptions().cucumber;
    if (cucumberOptions &&
        file.filePath.endsWith(cucumberOptions.featureFileExtension) &&
        cucumberOptions.uploadFeatures) {
        file_preprocessor_1.default.addSynchronizationCommands(file, context.getOptions(), context.getClients(), context.getGraph(), context.getLogger());
    }
    return file.filePath;
}
function registerDefaultTasks(on) {
    on("task", {
        [tasks_1.PluginTask.INCOMING_RESPONSE]: (args) => args.response,
        [tasks_1.PluginTask.OUTGOING_REQUEST]: (args) => args.request,
    });
}
