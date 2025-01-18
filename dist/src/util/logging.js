"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG = exports.CapturingLogger = exports.PluginLogger = exports.Level = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const axios_1 = require("axios");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const errors_1 = require("./errors");
var Level;
(function (Level) {
    Level["DEBUG"] = "DEBUG";
    Level["ERROR"] = "ERROR";
    Level["INFO"] = "INFO";
    Level["SUCCESS"] = "SUCCESS";
    Level["WARNING"] = "WARNING";
})(Level || (exports.Level = Level = {}));
/**
 * An ANSI-based logger.
 */
class PluginLogger {
    constructor(options = { logDirectory: "." }) {
        this.loggingOptions = options;
        const maxPrefixLength = Math.max(...Object.values(Level).map((s) => s.length));
        this.prefixes = {
            [Level.DEBUG]: this.prefix(Level.DEBUG, maxPrefixLength),
            [Level.ERROR]: this.prefix(Level.ERROR, maxPrefixLength),
            [Level.INFO]: this.prefix(Level.INFO, maxPrefixLength),
            [Level.SUCCESS]: this.prefix(Level.SUCCESS, maxPrefixLength),
            [Level.WARNING]: this.prefix(Level.WARNING, maxPrefixLength),
        };
        this.colorizers = {
            [Level.DEBUG]: ansi_colors_1.default.cyan,
            [Level.ERROR]: ansi_colors_1.default.red,
            [Level.INFO]: ansi_colors_1.default.gray,
            [Level.SUCCESS]: ansi_colors_1.default.green,
            [Level.WARNING]: ansi_colors_1.default.yellow,
        };
        this.logFunctions = {
            [Level.DEBUG]: console.debug,
            [Level.ERROR]: console.error,
            [Level.INFO]: console.info,
            [Level.SUCCESS]: console.log,
            [Level.WARNING]: console.warn,
        };
    }
    message(level, ...text) {
        if (level === Level.DEBUG && !this.loggingOptions.debug) {
            return;
        }
        const colorizer = this.colorizers[level];
        const prefix = this.prefixes[level];
        const logFunction = this.logFunctions[level];
        const lines = text.join(" ").split("\n");
        lines.forEach((line, index) => {
            if (index === 0) {
                logFunction(`${prefix} ${colorizer(line)}`);
            }
            else {
                logFunction(`${prefix}   ${colorizer(line)}`);
            }
            // Pad multiline log messages with an extra new line to cleanly separate them from the
            // following line.
            if (index > 0 && index === lines.length - 1) {
                logFunction(prefix);
            }
        });
    }
    logToFile(data, filename) {
        const logDirectoryPath = path_1.default.resolve(this.loggingOptions.logDirectory);
        fs_1.default.mkdirSync(logDirectoryPath, { recursive: true });
        const filepath = path_1.default.resolve(logDirectoryPath, filename);
        fs_1.default.writeFileSync(filepath, data);
        return filepath;
    }
    logErrorToFile(error, filename) {
        var _a;
        let errorFileName;
        let errorData;
        if ((0, errors_1.isLoggedError)(error)) {
            return;
        }
        if ((0, axios_1.isAxiosError)(error)) {
            errorFileName = `${filename}.json`;
            errorData = {
                error: error.toJSON(),
                response: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data,
            };
        }
        else if (error instanceof Error) {
            errorFileName = `${filename}.json`;
            errorData = {
                error: `${error.name}: ${error.message}`,
                stacktrace: error.stack,
            };
        }
        else {
            errorFileName = `${filename}.log`;
            errorData = error;
        }
        const filepath = this.logToFile(JSON.stringify(errorData, null, 2), errorFileName);
        this.message(Level.ERROR, `Complete error logs have been written to: ${filepath}`);
    }
    configure(options) {
        this.loggingOptions = options;
    }
    prefix(type, maxPrefixLength) {
        return ansi_colors_1.default.white(`│ Cypress Xray Plugin │ ${type.padEnd(maxPrefixLength, " ")} │`);
    }
}
exports.PluginLogger = PluginLogger;
/**
 * A logger which does not print anything itself but rather collects all log messages for later
 * retrieval. Useful for testing purposes.
 */
class CapturingLogger {
    constructor() {
        this.messages = [];
        this.fileLogMessages = [];
        this.fileLogErrorMessages = [];
    }
    message(level, ...text) {
        this.messages.push([level, ...text]);
    }
    /**
     * Returns the captured log messages.
     *
     * @returns the log messages
     */
    getMessages() {
        return this.messages;
    }
    logToFile(data, filename) {
        this.fileLogMessages.push([data, filename]);
        return filename;
    }
    /**
     * Returns the captured _log to file_ messages.
     *
     * @returns the _log to file_ messages
     */
    getFileLogMessages() {
        return this.fileLogMessages;
    }
    logErrorToFile(error, filename) {
        this.fileLogErrorMessages.push([error, filename]);
    }
    /**
     * Returns the captured _log error to file_ messages.
     *
     * @returns the _log error to file_ messages
     */
    getFileLogErrorMessages() {
        return this.fileLogErrorMessages;
    }
    configure() {
        // Do nothing.
    }
}
exports.CapturingLogger = CapturingLogger;
/**
 * The global logger instance.
 */
exports.LOG = new PluginLogger();
