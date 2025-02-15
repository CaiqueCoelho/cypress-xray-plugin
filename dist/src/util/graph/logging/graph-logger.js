"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainingCommandGraphLogger = exports.ChainingGraphLogger = void 0;
const command_1 = require("../../../hooks/command");
const import_execution_cucumber_command_1 = require("../../../hooks/util/commands/xray/import-execution-cucumber-command");
const import_execution_cypress_command_1 = require("../../../hooks/util/commands/xray/import-execution-cypress-command");
const import_feature_command_1 = require("../../../hooks/util/commands/xray/import-feature-command");
const dedent_1 = require("../../dedent");
const errors_1 = require("../../errors");
const logging_1 = require("../../logging");
const queue_1 = require("../../queue/queue");
const sort_1 = require("../algorithms/sort");
class ChainingGraphLogger {
    constructor(logger, hasPriority = () => false) {
        this.logger = logger;
        this.hasPriority = hasPriority;
    }
    logGraph(graph) {
        const loggedVertices = new Set();
        const prioritizedVertices = [];
        for (const vertex of graph.getVertices()) {
            if (this.hasPriority(vertex)) {
                prioritizedVertices.push(vertex);
            }
        }
        prioritizedVertices.sort((a, b) => a.constructor.name.localeCompare(b.constructor.name));
        for (const vertex of prioritizedVertices) {
            const messageChain = this.computeLogMessageChain(vertex, graph);
            this.logMessageChain(messageChain).forEach((loggedVertex) => loggedVertices.add(loggedVertex));
        }
        for (const vertex of (0, sort_1.traverse)(graph, "bottom-up")) {
            if (loggedVertices.has(vertex)) {
                continue;
            }
            const messageChain = this.computeLogMessageChain(vertex, graph);
            this.logMessageChain(messageChain).forEach((loggedVertex) => loggedVertices.add(loggedVertex));
        }
    }
    getLogMessage(vertex) {
        const error = vertex.getFailure();
        if (error) {
            return {
                includePredecessors: false,
                level: (0, errors_1.isSkippedError)(error) ? logging_1.Level.WARNING : logging_1.Level.ERROR,
                text: error.message,
            };
        }
    }
    computeLogMessageChain(vertex, graph) {
        const chain = [];
        const queue = new queue_1.Queue();
        queue.enqueue([vertex, 0, false]);
        while (!queue.isEmpty()) {
            const [currentVertex, indent, includePredecessors] = queue.dequeue();
            const message = this.getLogMessage(currentVertex);
            if (message) {
                chain.push({
                    ...message,
                    indent: indent,
                    vertex: currentVertex,
                });
                for (const predecessor of graph.getPredecessors(currentVertex)) {
                    if (!queue.find(([v]) => v === predecessor)) {
                        queue.enqueue([predecessor, indent + 1, message.includePredecessors]);
                    }
                }
            }
            else if (includePredecessors) {
                for (const predecessor of graph.getPredecessors(currentVertex)) {
                    if (!queue.find(([v]) => v === predecessor) &&
                        chain.every((entry) => entry.vertex !== predecessor)) {
                        queue.enqueue([predecessor, indent, true]);
                    }
                }
            }
        }
        return chain;
    }
    logMessageChain(chain) {
        const loggedVertices = new Set();
        if (chain.length === 0) {
            return loggedVertices;
        }
        chain.sort((a, b) => a.indent - b.indent);
        let logMessage = "";
        for (let i = chain.length - 1; i >= 0; i--) {
            if (i === chain.length - 1) {
                logMessage = chain[i].text;
            }
            else {
                if (chain[i + 1].indent > chain[i].indent) {
                    logMessage = (0, dedent_1.dedent)(`
                        ${chain[i].text}

                          Caused by: ${logMessage}
                    `);
                }
                else {
                    logMessage = (0, dedent_1.dedent)(`
                        ${chain[i].text}

                        Caused by: ${logMessage}
                    `);
                }
            }
        }
        for (const message of chain) {
            loggedVertices.add(message.vertex);
        }
        const level = chain
            .map((message) => message.level)
            .reduce((previous, current) => {
            if (previous === logging_1.Level.ERROR || current === logging_1.Level.ERROR) {
                return logging_1.Level.ERROR;
            }
            return previous;
        }, chain[0].level);
        this.logger.message(level, logMessage);
        return loggedVertices;
    }
}
exports.ChainingGraphLogger = ChainingGraphLogger;
class ChainingCommandGraphLogger extends ChainingGraphLogger {
    constructor(logger) {
        super(logger, (command) => {
            return (command instanceof import_execution_cypress_command_1.ImportExecutionCypressCommand ||
                command instanceof import_execution_cucumber_command_1.ImportExecutionCucumberCommand ||
                command instanceof import_feature_command_1.ImportFeatureCommand);
        });
    }
    getLogMessage(vertex) {
        const message = super.getLogMessage(vertex);
        if (message) {
            return message;
        }
        if (vertex.getState() === command_1.ComputableState.SKIPPED) {
            if (vertex instanceof import_execution_cypress_command_1.ImportExecutionCypressCommand) {
                return {
                    includePredecessors: true,
                    level: logging_1.Level.ERROR,
                    text: "Failed to upload Cypress execution results.",
                };
            }
            if (vertex instanceof import_execution_cucumber_command_1.ImportExecutionCucumberCommand) {
                return {
                    includePredecessors: true,
                    level: logging_1.Level.ERROR,
                    text: "Failed to upload Cucumber execution results.",
                };
            }
            if (vertex instanceof import_feature_command_1.ImportFeatureCommand) {
                return {
                    includePredecessors: true,
                    level: logging_1.Level.ERROR,
                    text: (0, dedent_1.dedent)(`
                        ${vertex.getParameters().filePath}

                          Failed to import feature file.
                    `),
                };
            }
        }
    }
}
exports.ChainingCommandGraphLogger = ChainingCommandGraphLogger;
