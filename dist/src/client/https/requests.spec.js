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
const axios_1 = __importStar(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const server_1 = require("../../../test/server");
const logging_1 = require("../../util/logging");
const requests_1 = require("./requests");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    (0, node_test_1.beforeEach)(() => {
        axios_1.default.interceptors.request.clear();
        axios_1.default.interceptors.response.clear();
    });
    await (0, node_test_1.describe)("get", async () => {
        await (0, node_test_1.it)("returns the response", async (context) => {
            const response = {
                config: {
                    headers: new axios_1.AxiosHeaders(),
                },
                data: "Example domain 123",
                headers: {},
                status: axios_1.HttpStatusCode.Ok,
                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
            };
            context.mock.method(axios_1.default, "get", () => response);
            const client = new requests_1.AxiosRestClient(axios_1.default);
            node_assert_1.default.deepStrictEqual(await client.get("http://localhost:1234"), response);
        });
        await (0, node_test_1.it)("writes to a file on encountering axios errors if debug is enabled", async (context) => {
            var _a;
            context.mock.timers.enable({ apis: ["Date"] });
            context.mock.timers.tick(12345);
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            let i = 0;
            const logToFile = context.mock.method(logging_1.LOG, "logToFile", () => {
                if (i++ == 0) {
                    return "request.json";
                }
                return "response.json";
            });
            const client = new requests_1.AxiosRestClient(axios_1.default, { debug: true });
            await node_assert_1.default.rejects(client.get("https://localhost:1234"));
            node_assert_1.default.strictEqual(message.mock.callCount(), 2);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.DEBUG,
                "Request:  request.json",
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                logging_1.Level.DEBUG,
                "Response: response.json",
            ]);
            const requestBody = JSON.parse(logToFile.mock.calls[0].arguments[0]);
            node_assert_1.default.deepStrictEqual(requestBody, {
                headers: {
                    ["Accept"]: "application/json, text/plain, */*",
                },
                url: "https://localhost:1234",
            });
            // Complicated assertion to handle different timezones on local and CI.
            const date = new Date();
            node_assert_1.default.strictEqual(logToFile.mock.calls[0].arguments[1], `0${date.getHours().toString()}_00_12_GET_https_localhost_1234_request.json`);
            const error = JSON.parse(logToFile.mock.calls[1].arguments[0]);
            node_assert_1.default.strictEqual(error.code, "ECONNREFUSED");
            node_assert_1.default.strictEqual((_a = error.config) === null || _a === void 0 ? void 0 : _a.url, "https://localhost:1234");
            node_assert_1.default.strictEqual(error.config.method, "get");
            // Complicated assertion to handle different timezones on local and CI.
            node_assert_1.default.strictEqual(logToFile.mock.calls[1].arguments[1], `0${date.getHours().toString()}_00_12_GET_https_localhost_1234_response.json`);
        });
        await (0, node_test_1.it)("writes to a file on encountering axios errors if debug is disabled", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const logToFile = context.mock.method(logging_1.LOG, "logToFile", context.mock.fn());
            const client = new requests_1.AxiosRestClient(axios_1.default);
            await node_assert_1.default.rejects(client.get("https://localhost:1234"));
            node_assert_1.default.strictEqual(message.mock.callCount(), 1);
            node_assert_1.default.strictEqual(logToFile.mock.callCount(), 1);
        });
        await (0, node_test_1.it)("logs progress", async (context) => {
            context.mock.timers.enable({ apis: ["Date", "setTimeout", "setInterval"] });
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            context.mock.method(axios_1.default, "get", () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        config: { headers: {} },
                        data: "<html>ok</html>",
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Found],
                    });
                }, 23000);
            }));
            const restClient = new requests_1.AxiosRestClient(axios_1.default);
            const promise = restClient.get("http://localhost:1234");
            await Promise.resolve();
            context.mock.timers.tick(27000);
            await promise;
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Waiting for http://localhost:1234 to respond... (10 seconds)",
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                logging_1.Level.INFO,
                "Waiting for http://localhost:1234 to respond... (20 seconds)",
            ]);
        });
    });
    await (0, node_test_1.describe)("post", async () => {
        await (0, node_test_1.it)("returns the response", async (context) => {
            const response = {
                config: {
                    headers: new axios_1.AxiosHeaders(),
                },
                data: "Example domain 123",
                headers: {},
                status: axios_1.HttpStatusCode.Ok,
                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
            };
            context.mock.method(axios_1.default, "post", () => response);
            const client = new requests_1.AxiosRestClient(axios_1.default);
            node_assert_1.default.deepStrictEqual(await client.post("http://localhost:1234"), response);
        });
        await (0, node_test_1.it)("writes to a file on encountering axios errors if debug is enabled", async (context) => {
            var _a;
            context.mock.timers.enable({ apis: ["Date"] });
            context.mock.timers.tick(12345);
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            let i = 0;
            const logToFile = context.mock.method(logging_1.LOG, "logToFile", () => {
                if (i++ == 0) {
                    return "request.json";
                }
                return "response.json";
            });
            const client = new requests_1.AxiosRestClient(axios_1.default, { debug: true });
            await node_assert_1.default.rejects(client.post("https://localhost:1234", {
                five: 6,
                hello: "!",
                seven: [1, 2, 3],
                there: "!",
            }));
            node_assert_1.default.strictEqual(message.mock.callCount(), 2);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.DEBUG,
                "Request:  request.json",
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                logging_1.Level.DEBUG,
                "Response: response.json",
            ]);
            const requestBody = JSON.parse(logToFile.mock.calls[0].arguments[0]);
            node_assert_1.default.deepStrictEqual(requestBody, {
                body: {
                    five: 6,
                    hello: "!",
                    seven: [1, 2, 3],
                    there: "!",
                },
                headers: {
                    ["Accept"]: "application/json, text/plain, */*",
                },
                url: "https://localhost:1234",
            });
            // Complicated assertion to handle different timezones on local and CI.
            const date = new Date();
            node_assert_1.default.strictEqual(logToFile.mock.calls[0].arguments[1], `0${date.getHours().toString()}_00_12_POST_https_localhost_1234_request.json`);
            const error = JSON.parse(logToFile.mock.calls[1].arguments[0]);
            node_assert_1.default.strictEqual(error.code, "ECONNREFUSED");
            node_assert_1.default.strictEqual((_a = error.config) === null || _a === void 0 ? void 0 : _a.url, "https://localhost:1234");
            node_assert_1.default.strictEqual(error.config.method, "post");
            node_assert_1.default.strictEqual(logToFile.mock.calls[1].arguments[1], `0${date.getHours().toString()}_00_12_POST_https_localhost_1234_response.json`);
        });
        await (0, node_test_1.it)("writes to a file on encountering axios errors if debug is disabled", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const logToFile = context.mock.method(logging_1.LOG, "logToFile", context.mock.fn());
            const client = new requests_1.AxiosRestClient(axios_1.default);
            await node_assert_1.default.rejects(client.get("https://localhost:1234"));
            node_assert_1.default.strictEqual(message.mock.callCount(), 1);
            node_assert_1.default.strictEqual(logToFile.mock.callCount(), 1);
        });
        await (0, node_test_1.it)("logs progress", async (context) => {
            context.mock.timers.enable({ apis: ["Date", "setTimeout", "setInterval"] });
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            context.mock.method(axios_1.default, "post", () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        config: { headers: {} },
                        data: "<html>ok</html>",
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Found],
                    });
                }, 23000);
            }));
            const restClient = new requests_1.AxiosRestClient(axios_1.default);
            const promise = restClient.post("http://localhost:1234");
            await Promise.resolve();
            context.mock.timers.tick(27000);
            await promise;
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Waiting for http://localhost:1234 to respond... (10 seconds)",
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                logging_1.Level.INFO,
                "Waiting for http://localhost:1234 to respond... (20 seconds)",
            ]);
        });
    });
    await (0, node_test_1.describe)("put", async () => {
        await (0, node_test_1.it)("returns the response", async (context) => {
            const client = new requests_1.AxiosRestClient(axios_1.default);
            const response = {
                config: {
                    headers: new axios_1.AxiosHeaders(),
                },
                data: "Example domain 123",
                headers: {},
                status: axios_1.HttpStatusCode.Ok,
                statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Ok],
            };
            context.mock.method(axios_1.default, "put", () => response);
            node_assert_1.default.deepStrictEqual(await client.put("http://localhost:1234"), response);
        });
        await (0, node_test_1.it)("writes to a file on encountering axios errors if debug is enabled", async (context) => {
            var _a;
            context.mock.timers.enable({ apis: ["Date"] });
            context.mock.timers.tick(12345);
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            let i = 0;
            const logToFile = context.mock.method(logging_1.LOG, "logToFile", () => {
                if (i++ == 0) {
                    return "request.json";
                }
                return "response.json";
            });
            const client = new requests_1.AxiosRestClient(axios_1.default, { debug: true });
            await node_assert_1.default.rejects(client.put("https://localhost:1234", {
                five: 6,
                hello: "!",
                seven: [1, 2, 3],
                there: "!",
            }));
            node_assert_1.default.strictEqual(message.mock.callCount(), 2);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.DEBUG,
                "Request:  request.json",
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                logging_1.Level.DEBUG,
                "Response: response.json",
            ]);
            const requestBody = JSON.parse(logToFile.mock.calls[0].arguments[0]);
            node_assert_1.default.deepStrictEqual(requestBody, {
                body: {
                    five: 6,
                    hello: "!",
                    seven: [1, 2, 3],
                    there: "!",
                },
                headers: {
                    ["Accept"]: "application/json, text/plain, */*",
                },
                url: "https://localhost:1234",
            });
            // Complicated assertion to handle different timezones on local and CI.
            const date = new Date();
            node_assert_1.default.strictEqual(logToFile.mock.calls[0].arguments[1], `0${date.getHours().toString()}_00_12_PUT_https_localhost_1234_request.json`);
            const error = JSON.parse(logToFile.mock.calls[1].arguments[0]);
            node_assert_1.default.strictEqual(error.code, "ECONNREFUSED");
            node_assert_1.default.strictEqual((_a = error.config) === null || _a === void 0 ? void 0 : _a.url, "https://localhost:1234");
            node_assert_1.default.strictEqual(error.config.method, "put");
            node_assert_1.default.strictEqual(logToFile.mock.calls[1].arguments[1], `0${date.getHours().toString()}_00_12_PUT_https_localhost_1234_response.json`);
        });
        await (0, node_test_1.it)("writes to a file on encountering axios errors if debug is disabled", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const logToFile = context.mock.method(logging_1.LOG, "logToFile", context.mock.fn());
            const client = new requests_1.AxiosRestClient(axios_1.default);
            await node_assert_1.default.rejects(client.get("https://localhost:1234"));
            node_assert_1.default.strictEqual(message.mock.callCount(), 1);
            node_assert_1.default.strictEqual(logToFile.mock.callCount(), 1);
        });
        await (0, node_test_1.it)("logs progress", async (context) => {
            context.mock.timers.enable({ apis: ["Date", "setTimeout", "setInterval"] });
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            context.mock.method(axios_1.default, "put", () => new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        config: { headers: {} },
                        data: "<html>ok</html>",
                        headers: {},
                        status: axios_1.HttpStatusCode.Ok,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Found],
                    });
                }, 23000);
            }));
            const restClient = new requests_1.AxiosRestClient(axios_1.default);
            const promise = restClient.put("http://localhost:1234");
            await Promise.resolve();
            context.mock.timers.tick(27000);
            await promise;
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.INFO,
                "Waiting for http://localhost:1234 to respond... (10 seconds)",
            ]);
            node_assert_1.default.deepStrictEqual(message.mock.calls[1].arguments, [
                logging_1.Level.INFO,
                "Waiting for http://localhost:1234 to respond... (20 seconds)",
            ]);
        });
    });
    await (0, node_test_1.it)("logs form data", async (context) => {
        const logToFile = context.mock.method(logging_1.LOG, "logToFile", context.mock.fn());
        const restClient = new requests_1.AxiosRestClient(axios_1.default, { debug: true });
        const formdata = new form_data_1.default();
        formdata.append("hello.json", JSON.stringify({ hello: "bonjour" }));
        await restClient.post(`http://${server_1.LOCAL_SERVER.url}`, formdata, {
            headers: { ...formdata.getHeaders() },
        });
        node_assert_1.default.match(logToFile.mock.calls[0].arguments[0], /{\\"hello\\":\\"bonjour\\"}/g);
    });
    await (0, node_test_1.it)("logs formdata only up to a certain length", async (context) => {
        const logToFile = context.mock.method(logging_1.LOG, "logToFile", context.mock.fn());
        const restClient = new requests_1.AxiosRestClient(axios_1.default, { debug: true, fileSizeLimit: 0.5 });
        const formdata = new form_data_1.default();
        formdata.append("long.txt", (0, node_fs_1.createReadStream)("./test/resources/big.txt"));
        await restClient.post(`http://${server_1.LOCAL_SERVER.url}`, formdata, {
            headers: { ...formdata.getHeaders() },
        });
        // The 'end' event is emitted after the response has arrived.
        await new Promise((resolve) => setTimeout(resolve, 100));
        node_assert_1.default.match(logToFile.mock.calls[0].arguments[0], /[... omitted due to file size]/g);
    });
    await (0, node_test_1.it)("logs requests happening at the same time", async (context) => {
        const logToFile = context.mock.method(logging_1.LOG, "logToFile", context.mock.fn());
        context.mock.timers.enable({ apis: ["Date"] });
        context.mock.timers.tick(12345);
        const restClient = new requests_1.AxiosRestClient(axios_1.default, { debug: true });
        await Promise.all([
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
        ]);
        // Complicated assertion to handle different timezones on local and CI.
        const date = new Date();
        node_assert_1.default.strictEqual(logToFile.mock.calls[0].arguments[1], `0${date.getHours().toString()}_00_12_GET_http_localhost_8080_request.json`);
        node_assert_1.default.strictEqual(logToFile.mock.calls[1].arguments[1], `0${date.getHours().toString()}_00_12_GET_http_localhost_8080_request_1.json`);
    });
    await (0, node_test_1.it)("does not rate limit requests by default", async () => {
        const restClient = new requests_1.AxiosRestClient(axios_1.default);
        const responses = await Promise.all([
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
        ]);
        /* eslint-disable @typescript-eslint/no-unsafe-argument */
        const dateHeader0 = new Date(Number.parseInt(responses[0].headers["x-response-time"]));
        const dateHeader1 = new Date(Number.parseInt(responses[1].headers["x-response-time"]));
        const dateHeader2 = new Date(Number.parseInt(responses[2].headers["x-response-time"]));
        const dateHeader3 = new Date(Number.parseInt(responses[3].headers["x-response-time"]));
        const dateHeader4 = new Date(Number.parseInt(responses[4].headers["x-response-time"]));
        const dateHeader5 = new Date(Number.parseInt(responses[5].headers["x-response-time"]));
        const dateHeader6 = new Date(Number.parseInt(responses[6].headers["x-response-time"]));
        const dateHeader7 = new Date(Number.parseInt(responses[7].headers["x-response-time"]));
        const dateHeader8 = new Date(Number.parseInt(responses[8].headers["x-response-time"]));
        const dateHeader9 = new Date(Number.parseInt(responses[9].headers["x-response-time"]));
        /* eslint-enable @typescript-eslint/no-unsafe-argument */
        assertApprox(dateHeader1.getTime() - dateHeader0.getTime(), 0, 50);
        assertApprox(dateHeader2.getTime() - dateHeader1.getTime(), 0, 50);
        assertApprox(dateHeader3.getTime() - dateHeader2.getTime(), 0, 50);
        assertApprox(dateHeader4.getTime() - dateHeader3.getTime(), 0, 50);
        assertApprox(dateHeader5.getTime() - dateHeader4.getTime(), 0, 50);
        assertApprox(dateHeader6.getTime() - dateHeader5.getTime(), 0, 50);
        assertApprox(dateHeader7.getTime() - dateHeader6.getTime(), 0, 50);
        assertApprox(dateHeader8.getTime() - dateHeader7.getTime(), 0, 50);
        assertApprox(dateHeader9.getTime() - dateHeader8.getTime(), 0, 50);
    });
    await (0, node_test_1.it)("rate limits requests", async () => {
        const restClient = new requests_1.AxiosRestClient(axios_1.default, { rateLimiting: { requestsPerSecond: 2 } });
        const responses = await Promise.all([
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
            restClient.get(`http://${server_1.LOCAL_SERVER.url}`),
        ]);
        /* eslint-disable @typescript-eslint/no-unsafe-argument */
        const dateHeader0 = new Date(Number.parseInt(responses[0].headers["x-response-time"]));
        const dateHeader1 = new Date(Number.parseInt(responses[1].headers["x-response-time"]));
        const dateHeader2 = new Date(Number.parseInt(responses[2].headers["x-response-time"]));
        const dateHeader3 = new Date(Number.parseInt(responses[3].headers["x-response-time"]));
        const dateHeader4 = new Date(Number.parseInt(responses[4].headers["x-response-time"]));
        /* eslint-enable @typescript-eslint/no-unsafe-argument */
        assertApprox(dateHeader1.getTime() - dateHeader0.getTime(), 500, 50);
        assertApprox(dateHeader2.getTime() - dateHeader1.getTime(), 500, 50);
        assertApprox(dateHeader3.getTime() - dateHeader2.getTime(), 500, 50);
        assertApprox(dateHeader4.getTime() - dateHeader3.getTime(), 500, 50);
    });
});
function assertApprox(actual, expected, delta) {
    node_assert_1.default.ok(actual >= expected - delta, `${actual.toString()} ~/~ ${expected.toString()} - ${delta.toString()}`);
    node_assert_1.default.ok(actual <= expected + delta, `${actual.toString()} ~/~ ${expected.toString()} + ${delta.toString()}`);
}
