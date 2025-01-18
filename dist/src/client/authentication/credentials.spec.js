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
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const logging_1 = require("../../util/logging");
const requests_1 = require("../https/requests");
const credentials_1 = require("./credentials");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(credentials_1.JwtCredentials.name, async () => {
        let restClient;
        let credentials;
        (0, node_test_1.beforeEach)(() => {
            restClient = new requests_1.AxiosRestClient(axios_1.default);
            credentials = new credentials_1.JwtCredentials("id", "secret", "http://localhost:1234", restClient);
        });
        await (0, node_test_1.describe)(credentials_1.JwtCredentials.prototype.getAuthorizationHeader.name, async () => {
            await (0, node_test_1.it)("returns authorization headers", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                        headers: {},
                        status: axios_1.HttpStatusCode.Found,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Found],
                    };
                });
                node_assert_1.default.deepEqual(await credentials.getAuthorizationHeader(), {
                    ["Authorization"]: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                });
            });
            await (0, node_test_1.it)("authorizes once only", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const post = context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                        headers: {},
                        status: axios_1.HttpStatusCode.Found,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Found],
                    };
                });
                const header1 = credentials.getAuthorizationHeader();
                const header2 = credentials.getAuthorizationHeader();
                const expectedHeader = {
                    ["Authorization"]: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                };
                node_assert_1.default.deepEqual(await Promise.all([header1, header2]), [
                    expectedHeader,
                    expectedHeader,
                ]);
                node_assert_1.default.strictEqual(post.mock.callCount(), 1);
            });
            await (0, node_test_1.it)("handles unparseable tokens", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    return {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: "<div>Demo Page</div>",
                        headers: {},
                        status: axios_1.HttpStatusCode.Found,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.Found],
                    };
                });
                await node_assert_1.default.rejects(credentials.getAuthorizationHeader(), {
                    message: "Failed to authenticate",
                });
            });
            await (0, node_test_1.it)("handles bad responses", async (context) => {
                const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
                context.mock.method(logging_1.LOG, "logErrorToFile", context.mock.fn());
                context.mock.method(restClient, "post", () => {
                    throw new axios_1.AxiosError("Request failed with status code 404", axios_1.HttpStatusCode.BadRequest.toString(), undefined, null, {
                        config: { headers: new axios_1.AxiosHeaders() },
                        data: {
                            errorMessages: ["not found"],
                        },
                        headers: {},
                        status: axios_1.HttpStatusCode.NotFound,
                        statusText: axios_1.HttpStatusCode[axios_1.HttpStatusCode.NotFound],
                    });
                });
                await node_assert_1.default.rejects(credentials.getAuthorizationHeader(), {
                    message: "Failed to authenticate",
                });
                node_assert_1.default.deepEqual(message.mock.calls[1].arguments, [
                    logging_1.Level.ERROR,
                    "Failed to authenticate: Request failed with status code 404",
                ]);
            });
        });
    });
});
