"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const files_1 = require("../util/files");
const tasks_1 = require("./tasks");
Cypress.Commands.overwrite("request", (originalFn, request) => {
    var _a, _b;
    const method = (0, files_1.normalizedFilename)(typeof request === "string" ? "GET" : ((_a = request.method) !== null && _a !== void 0 ? _a : "UNKNOWN METHOD"));
    const url = (0, files_1.normalizedFilename)(typeof request === "string" ? request : ((_b = request.url) !== null && _b !== void 0 ? _b : "UNKNOWN URL"));
    const timestamp = (0, files_1.normalizedFilename)(new Date().toLocaleTimeString());
    const basename = `${method} ${url} ${timestamp}`;
    return (0, tasks_1.enqueueTask)(tasks_1.PluginTask.OUTGOING_REQUEST, `${basename} request.json`, request)
        .then(originalFn)
        .then((response) => (0, tasks_1.enqueueTask)(tasks_1.PluginTask.INCOMING_RESPONSE, `${basename} response.json`, response));
});
