export declare enum Level {
    DEBUG = "DEBUG",
    ERROR = "ERROR",
    INFO = "INFO",
    SUCCESS = "SUCCESS",
    WARNING = "WARNING"
}
/**
 * A generic logging interface.
 */
export interface Logger {
    /**
     * Configures the logger.
     *
     * @param options - the logging options to use from now on
     */
    configure(options: LoggingOptions): void;
    /**
     * Writes an error to a file under the log path configured in
     * {@link configure | `configure`}.
     *
     * @param error - the error
     * @param filename - the filename to use for the file
     * @returns the file path
     */
    logErrorToFile(error: unknown, filename: string): void;
    /**
     * Writes arbitrary data to a file under the log path configured in
     * {@link configure | `configure`}.
     *
     * @param data - the data to write
     * @param filename - the filename to use for the file
     * @returns the file path
     */
    logToFile(data: string, filename: string): string;
    /**
     * Logs a log message.
     *
     * @param text - the individual messages
     */
    message(level: Level, ...text: string[]): void;
}
interface LoggingOptions {
    debug?: boolean;
    logDirectory: string;
}
/**
 * An ANSI-based logger.
 */
export declare class PluginLogger implements Logger {
    private readonly prefixes;
    private readonly colorizers;
    private readonly logFunctions;
    private loggingOptions;
    constructor(options?: LoggingOptions);
    message(level: Level, ...text: string[]): void;
    logToFile(data: string, filename: string): string;
    logErrorToFile(error: unknown, filename: string): void;
    configure(options: LoggingOptions): void;
    private prefix;
}
/**
 * A logger which does not print anything itself but rather collects all log messages for later
 * retrieval. Useful for testing purposes.
 */
export declare class CapturingLogger implements Logger {
    private readonly messages;
    private readonly fileLogMessages;
    private readonly fileLogErrorMessages;
    message(level: Level, ...text: string[]): void;
    /**
     * Returns the captured log messages.
     *
     * @returns the log messages
     */
    getMessages(): readonly Parameters<Logger["message"]>[];
    logToFile(data: string, filename: string): string;
    /**
     * Returns the captured _log to file_ messages.
     *
     * @returns the _log to file_ messages
     */
    getFileLogMessages(): readonly Parameters<Logger["logToFile"]>[];
    logErrorToFile(error: unknown, filename: string): void;
    /**
     * Returns the captured _log error to file_ messages.
     *
     * @returns the _log error to file_ messages
     */
    getFileLogErrorMessages(): readonly Parameters<Logger["logErrorToFile"]>[];
    configure(): void;
}
/**
 * The global logger instance.
 */
export declare const LOG: Logger;
export {};
