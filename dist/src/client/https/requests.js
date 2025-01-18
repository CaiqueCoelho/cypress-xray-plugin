"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosRestClient = void 0;
const axios_1 = require("axios");
const form_data_1 = __importDefault(require("form-data"));
const files_1 = require("../../util/files");
const logging_1 = require("../../util/logging");
const string_1 = require("../../util/string");
const time_1 = require("../../util/time");
class AxiosRestClient {
    constructor(axios, options) {
        var _a;
        this.axios = axios;
        this.options = options;
        this.createdLogFiles = new Map();
        this.lastRequestTime = undefined;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.debug) {
            this.axios.interceptors.request.use((request) => {
                this.logRequest(request);
                return request;
            });
            this.axios.interceptors.response.use((response) => {
                this.logResponse(response);
                return response;
            });
        }
        this.axios.interceptors.request.use((request) => request, (error) => {
            this.logError("outbound", error);
            return Promise.reject(error instanceof Error ? error : new Error((0, string_1.unknownToString)(error)));
        });
        this.axios.interceptors.response.use((response) => response, (error) => {
            this.logError("inbound", error);
            return Promise.reject(error instanceof Error ? error : new Error((0, string_1.unknownToString)(error)));
        });
    }
    async get(url, config) {
        var _a;
        await this.delayIfNeeded();
        const progressInterval = this.startResponseInterval(url);
        try {
            return await this.axios.get(url, {
                ...(_a = this.options) === null || _a === void 0 ? void 0 : _a.http,
                ...config,
            });
        }
        finally {
            clearInterval(progressInterval);
        }
    }
    async post(url, data, config) {
        var _a;
        await this.delayIfNeeded();
        const progressInterval = this.startResponseInterval(url);
        try {
            return await this.axios.post(url, data, {
                ...(_a = this.options) === null || _a === void 0 ? void 0 : _a.http,
                ...config,
            });
        }
        finally {
            clearInterval(progressInterval);
        }
    }
    async put(url, data, config) {
        var _a;
        await this.delayIfNeeded();
        const progressInterval = this.startResponseInterval(url);
        try {
            return await this.axios.put(url, data, {
                ...(_a = this.options) === null || _a === void 0 ? void 0 : _a.http,
                ...config,
            });
        }
        finally {
            clearInterval(progressInterval);
        }
    }
    logRequest(request) {
        var _a;
        const method = (_a = request.method) === null || _a === void 0 ? void 0 : _a.toUpperCase();
        const url = request.url;
        let prefix = dateToTimestamp(new Date());
        if (method) {
            prefix = `${prefix}_${method}`;
        }
        if (url) {
            prefix = `${prefix}_${url}`;
        }
        const filename = `${this.appendSuffix((0, files_1.normalizedFilename)(`${prefix}_request`))}.json`;
        if (request.data instanceof form_data_1.default) {
            const formData = request.data;
            const chunks = [];
            let bytesRead = 0;
            const listener = (chunk) => {
                var _a, _b;
                bytesRead += chunk.length;
                if (bytesRead > Math.floor(1024 * 1024 * ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.fileSizeLimit) !== null && _b !== void 0 ? _b : 50))) {
                    chunks.push("[... omitted due to file size]");
                    formData.off("data", listener);
                    return;
                }
                chunks.push(chunk);
            };
            formData.on("data", listener);
            formData.on("end", () => {
                const resolvedFilename = logging_1.LOG.logToFile(JSON.stringify({
                    body: chunks.map((chunk) => chunk.toString("utf-8")).join(""),
                    headers: request.headers,
                    params: request.params,
                    url: url,
                }, null, 2), filename);
                logging_1.LOG.message(logging_1.Level.DEBUG, `Request:  ${resolvedFilename}`);
            });
        }
        else {
            const resolvedFilename = logging_1.LOG.logToFile(JSON.stringify({
                body: request.data,
                headers: request.headers,
                params: request.params,
                url: url,
            }, null, 2), filename);
            logging_1.LOG.message(logging_1.Level.DEBUG, `Request:  ${resolvedFilename}`);
        }
    }
    logResponse(response) {
        var _a;
        const request = response.request;
        const method = (_a = request.method) === null || _a === void 0 ? void 0 : _a.toUpperCase();
        const url = response.config.url;
        let prefix = dateToTimestamp(new Date());
        if (method) {
            prefix = `${prefix}_${method}`;
        }
        if (url) {
            prefix = `${prefix}_${url}`;
        }
        const filename = `${this.appendSuffix((0, files_1.normalizedFilename)(`${prefix}_response`))}.json`;
        const resolvedFilename = logging_1.LOG.logToFile(JSON.stringify({
            data: response.data,
            headers: response.headers,
            status: response.status,
            statusText: response.statusText,
        }, null, 2), filename);
        logging_1.LOG.message(logging_1.Level.DEBUG, `Response: ${resolvedFilename}`);
    }
    logError(direction, error) {
        var _a, _b, _c;
        let data;
        let prefix = dateToTimestamp(new Date());
        if ((0, axios_1.isAxiosError)(error)) {
            const method = (_b = (_a = error.config) === null || _a === void 0 ? void 0 : _a.method) === null || _b === void 0 ? void 0 : _b.toUpperCase();
            const url = (_c = error.config) === null || _c === void 0 ? void 0 : _c.url;
            if (method) {
                prefix = `${prefix}_${method}`;
            }
            if (url) {
                prefix = `${prefix}_${url}`;
            }
            data = error.toJSON();
        }
        else {
            data = error;
        }
        const filename = `${this.appendSuffix((0, files_1.normalizedFilename)(`${prefix}_${direction === "inbound" ? "response" : "request"}`))}.json`;
        const resolvedFilename = logging_1.LOG.logToFile(JSON.stringify(data, null, 2), filename);
        logging_1.LOG.message(logging_1.Level.DEBUG, `${direction === "inbound" ? "Response" : "Request"}: ${resolvedFilename}`);
    }
    startResponseInterval(url) {
        return (0, time_1.startInterval)((totalTime) => {
            logging_1.LOG.message(logging_1.Level.INFO, `Waiting for ${url} to respond... (${(totalTime / 1000).toString()} seconds)`);
        });
    }
    appendSuffix(filename) {
        const filenameCount = this.createdLogFiles.get(filename);
        if (filenameCount) {
            this.createdLogFiles.set(filename, filenameCount + 1);
            return `${filename}_${filenameCount.toString()}`;
        }
        else {
            this.createdLogFiles.set(filename, 1);
            return filename;
        }
    }
    async delayIfNeeded() {
        var _a, _b;
        // We specifically do not use axios interceptors here because we would need to handle
        // connection timeouts, ECONNRESET etc. otherwise (I think).
        if ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.rateLimiting) === null || _b === void 0 ? void 0 : _b.requestsPerSecond) {
            const interval = 1000 / this.options.rateLimiting.requestsPerSecond;
            const now = Date.now();
            let nextRequestTime;
            if (this.lastRequestTime) {
                nextRequestTime = Math.max(this.lastRequestTime + interval, now);
            }
            else {
                nextRequestTime = now;
            }
            this.lastRequestTime = nextRequestTime;
            const delay = nextRequestTime - now;
            if (delay > 0) {
                await new Promise((resolve) => {
                    setTimeout(resolve, delay);
                });
            }
        }
    }
}
exports.AxiosRestClient = AxiosRestClient;
function dateToTimestamp(date) {
    return `${date.getHours().toString().padStart(2, "0")}_${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}_${date.getSeconds().toString().padStart(2, "0")}`;
}
