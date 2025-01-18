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
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = __importDefault(require("node:path"));
const node_process_1 = __importDefault(require("node:process"));
const node_test_1 = require("node:test");
const mocks_1 = require("../../test/mocks");
const context_1 = require("../context");
const dedent_1 = require("../util/dedent");
const logging_1 = require("../util/logging");
const tasks = __importStar(require("./tasks"));
(0, node_test_1.describe)(node_path_1.default.relative(node_process_1.default.cwd(), __filename), () => {
    (0, node_test_1.describe)(tasks.enqueueTask.name, () => {
        (0, node_test_1.it)("enqueues tasks for outgoing requests (url only)", (context) => {
            const { cy, cypress } = (0, mocks_1.getMockedCypress)();
            cypress.currentTest.title = "A test title";
            const task = context.mock.method(cy, "task", context.mock.fn());
            tasks.enqueueTask(tasks.PluginTask.OUTGOING_REQUEST, "urlOnly.json", "https://example.org" // https://docs.cypress.io/api/commands/request#Syntax
            );
            node_assert_1.default.deepStrictEqual(task.mock.calls[0].arguments, [
                tasks.PluginTask.OUTGOING_REQUEST,
                {
                    filename: "urlOnly.json",
                    request: "https://example.org",
                    test: "A test title",
                },
            ]);
        });
        (0, node_test_1.it)("enqueues tasks for outgoing requests (object)", (context) => {
            const { cy, cypress } = (0, mocks_1.getMockedCypress)();
            cypress.currentTest.title = "Another test title";
            const task = context.mock.method(cy, "task", context.mock.fn());
            tasks.enqueueTask(tasks.PluginTask.OUTGOING_REQUEST, "requestObject.json", {
                body: { data: "cool data" },
                method: "POST",
                url: "https://example.org",
            });
            node_assert_1.default.deepStrictEqual(task.mock.calls[0].arguments, [
                tasks.PluginTask.OUTGOING_REQUEST,
                {
                    filename: "requestObject.json",
                    request: {
                        body: { data: "cool data" },
                        method: "POST",
                        url: "https://example.org",
                    },
                    test: "Another test title",
                },
            ]);
        });
        (0, node_test_1.it)("enqueues tasks for incoming responses", (context) => {
            const { cy, cypress } = (0, mocks_1.getMockedCypress)();
            cypress.currentTest.title = "Incoming test title";
            const task = context.mock.method(cy, "task", context.mock.fn());
            tasks.enqueueTask(tasks.PluginTask.INCOMING_RESPONSE, "responseObject.json", {
                allRequestResponses: [],
                body: "This is example text",
                duration: 12345,
                headers: {
                    ["Content-Type"]: "text/plain",
                },
                isOkStatusCode: true,
                requestHeaders: { ["Accept"]: "text/plain" },
                status: 200,
                statusText: "Ok",
            });
            node_assert_1.default.deepStrictEqual(task.mock.calls[0].arguments, [
                tasks.PluginTask.INCOMING_RESPONSE,
                {
                    filename: "responseObject.json",
                    response: {
                        allRequestResponses: [],
                        body: "This is example text",
                        duration: 12345,
                        headers: {
                            ["Content-Type"]: "text/plain",
                        },
                        isOkStatusCode: true,
                        requestHeaders: { ["Accept"]: "text/plain" },
                        status: 200,
                        statusText: "Ok",
                    },
                    test: "Incoming test title",
                },
            ]);
        });
    });
    (0, node_test_1.describe)(tasks.PluginTaskListener.name, () => {
        (0, node_test_1.it)("handles single outgoing requests for tests with issue key", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            const addEvidence = context.mock.method(evidenceCollection, "addEvidence", context.mock.fn());
            const listener = new tasks.PluginTaskListener("CYP", evidenceCollection, logging_1.LOG);
            const result = listener[tasks.PluginTask.OUTGOING_REQUEST]({
                filename: "outgoingRequest.json",
                request: {
                    url: "https://example.org",
                },
                test: "This is a test CYP-123",
            });
            node_assert_1.default.deepStrictEqual(addEvidence.mock.calls[0].arguments, [
                "CYP-123",
                {
                    contentType: "application/json",
                    data: "ewogICJ1cmwiOiAiaHR0cHM6Ly9leGFtcGxlLm9yZyIKfQ==",
                    filename: "outgoingRequest.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(result, {
                url: "https://example.org",
            });
        });
        (0, node_test_1.it)("handles single outgoing requests for tests with multiple issue keys", (context) => {
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const listener = new tasks.PluginTaskListener("CYP", evidenceCollection, logging_1.LOG);
            listener[tasks.PluginTask.OUTGOING_REQUEST]({
                filename: "outgoingRequest.json",
                request: {
                    url: "https://example.org",
                },
                test: "This is a test CYP-123 CYP-124 CYP-125",
            });
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-123"), [
                {
                    contentType: "application/json",
                    data: "ewogICJ1cmwiOiAiaHR0cHM6Ly9leGFtcGxlLm9yZyIKfQ==",
                    filename: "outgoingRequest.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-124"), [
                {
                    contentType: "application/json",
                    data: "ewogICJ1cmwiOiAiaHR0cHM6Ly9leGFtcGxlLm9yZyIKfQ==",
                    filename: "outgoingRequest.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-125"), [
                {
                    contentType: "application/json",
                    data: "ewogICJ1cmwiOiAiaHR0cHM6Ly9leGFtcGxlLm9yZyIKfQ==",
                    filename: "outgoingRequest.json",
                },
            ]);
        });
        (0, node_test_1.it)("handles multiple outgoing requests for tests with the same issue key", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            const addEvidence = context.mock.method(evidenceCollection, "addEvidence", context.mock.fn());
            const listener = new tasks.PluginTaskListener("CYP", evidenceCollection, logging_1.LOG);
            const result1 = listener[tasks.PluginTask.OUTGOING_REQUEST]({
                filename: "outgoingRequest1.json",
                request: {
                    method: "GET",
                    url: "https://example.org",
                },
                test: "This is a test CYP-123: GET",
            });
            const result2 = listener[tasks.PluginTask.OUTGOING_REQUEST]({
                filename: "outgoingRequest2.json",
                request: {
                    body: { name: "John Doe" },
                    method: "POST",
                    url: "https://example.org",
                },
                test: "This is a test CYP-123: POST",
            });
            node_assert_1.default.strictEqual(addEvidence.mock.callCount(), 2);
            node_assert_1.default.deepStrictEqual(addEvidence.mock.calls[0].arguments, [
                "CYP-123",
                {
                    contentType: "application/json",
                    data: "ewogICJtZXRob2QiOiAiR0VUIiwKICAidXJsIjogImh0dHBzOi8vZXhhbXBsZS5vcmciCn0=",
                    filename: "outgoingRequest1.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(addEvidence.mock.calls[1].arguments, [
                "CYP-123",
                {
                    contentType: "application/json",
                    data: "ewogICJib2R5IjogewogICAgIm5hbWUiOiAiSm9obiBEb2UiCiAgfSwKICAibWV0aG9kIjogIlBPU1QiLAogICJ1cmwiOiAiaHR0cHM6Ly9leGFtcGxlLm9yZyIKfQ==",
                    filename: "outgoingRequest2.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(result1, {
                method: "GET",
                url: "https://example.org",
            });
            node_assert_1.default.deepStrictEqual(result2, {
                body: { name: "John Doe" },
                method: "POST",
                url: "https://example.org",
            });
        });
        (0, node_test_1.it)("handles single outgoing requests for tests without issue key", (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            const addEvidence = context.mock.method(evidenceCollection, "addEvidence", context.mock.fn());
            const listener = new tasks.PluginTaskListener("CYP", evidenceCollection, logging_1.LOG);
            listener[tasks.PluginTask.OUTGOING_REQUEST]({
                filename: "outgoingRequest.json",
                request: {
                    url: "https://example.org",
                },
                test: "This is a test",
            });
            node_assert_1.default.strictEqual(addEvidence.mock.callCount(), 0);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Test: This is a test

                      Encountered a cy.request call which will not be included as evidence.

                        Caused by: Test: This is a test

                          No test issue keys found in title.

                          You can target existing test issues by adding a corresponding issue key:

                            it("CYP-123 This is a test", () => {
                              // ...
                            });

                          For more information, visit:
                          - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                `),
            ]);
        });
        (0, node_test_1.it)("handles multiple outgoing requests for tests without issue key", (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            const addEvidence = context.mock.method(evidenceCollection, "addEvidence", context.mock.fn());
            const listener = new tasks.PluginTaskListener("CYP", evidenceCollection, logging_1.LOG);
            listener[tasks.PluginTask.OUTGOING_REQUEST]({
                filename: "outgoingRequest1.json",
                request: {
                    method: "GET",
                    url: "https://example.org",
                },
                test: "This is a test",
            });
            listener[tasks.PluginTask.OUTGOING_REQUEST]({
                filename: "outgoingRequest2.json",
                request: {
                    body: { username: "Jane Doe" },
                    method: "POST",
                    url: "https://example.org",
                },
                test: "This is a test",
            });
            node_assert_1.default.strictEqual(addEvidence.mock.callCount(), 0);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Test: This is a test

                      Encountered a cy.request call which will not be included as evidence.

                        Caused by: Test: This is a test

                          No test issue keys found in title.

                          You can target existing test issues by adding a corresponding issue key:

                            it("CYP-123 This is a test", () => {
                              // ...
                            });

                          For more information, visit:
                          - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                `),
            ]);
        });
        (0, node_test_1.it)("handles single incoming responses for tests with issue key", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            const addEvidence = context.mock.method(evidenceCollection, "addEvidence", context.mock.fn());
            const listener = new tasks.PluginTaskListener("CYP", evidenceCollection, logging_1.LOG);
            const result = listener[tasks.PluginTask.INCOMING_RESPONSE]({
                filename: "incomingResponse.json",
                response: {
                    allRequestResponses: [],
                    body: "This is example text",
                    duration: 12345,
                    headers: {
                        ["Content-Type"]: "text/plain",
                    },
                    isOkStatusCode: true,
                    requestHeaders: { ["Accept"]: "text/plain" },
                    status: 200,
                    statusText: "Ok",
                },
                test: "This is a test CYP-123",
            });
            node_assert_1.default.deepStrictEqual(addEvidence.mock.calls[0].arguments, [
                "CYP-123",
                {
                    contentType: "application/json",
                    data: "ewogICJhbGxSZXF1ZXN0UmVzcG9uc2VzIjogW10sCiAgImJvZHkiOiAiVGhpcyBpcyBleGFtcGxlIHRleHQiLAogICJkdXJhdGlvbiI6IDEyMzQ1LAogICJoZWFkZXJzIjogewogICAgIkNvbnRlbnQtVHlwZSI6ICJ0ZXh0L3BsYWluIgogIH0sCiAgImlzT2tTdGF0dXNDb2RlIjogdHJ1ZSwKICAicmVxdWVzdEhlYWRlcnMiOiB7CiAgICAiQWNjZXB0IjogInRleHQvcGxhaW4iCiAgfSwKICAic3RhdHVzIjogMjAwLAogICJzdGF0dXNUZXh0IjogIk9rIgp9",
                    filename: "incomingResponse.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(result, {
                allRequestResponses: [],
                body: "This is example text",
                duration: 12345,
                headers: {
                    ["Content-Type"]: "text/plain",
                },
                isOkStatusCode: true,
                requestHeaders: { ["Accept"]: "text/plain" },
                status: 200,
                statusText: "Ok",
            });
        });
        (0, node_test_1.it)("handles single incoming responses for tests with multiple issue keys", (context) => {
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const listener = new tasks.PluginTaskListener("CYP", evidenceCollection, logging_1.LOG);
            listener[tasks.PluginTask.INCOMING_RESPONSE]({
                filename: "incomingResponse.json",
                response: {
                    allRequestResponses: [],
                    body: "This is example text",
                    duration: 12345,
                    headers: {
                        ["Content-Type"]: "text/plain",
                    },
                    isOkStatusCode: true,
                    requestHeaders: { ["Accept"]: "text/plain" },
                    status: 200,
                    statusText: "Ok",
                },
                test: "This is a test CYP-123 CYP-124 CYP-125",
            });
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-123"), [
                {
                    contentType: "application/json",
                    data: "ewogICJhbGxSZXF1ZXN0UmVzcG9uc2VzIjogW10sCiAgImJvZHkiOiAiVGhpcyBpcyBleGFtcGxlIHRleHQiLAogICJkdXJhdGlvbiI6IDEyMzQ1LAogICJoZWFkZXJzIjogewogICAgIkNvbnRlbnQtVHlwZSI6ICJ0ZXh0L3BsYWluIgogIH0sCiAgImlzT2tTdGF0dXNDb2RlIjogdHJ1ZSwKICAicmVxdWVzdEhlYWRlcnMiOiB7CiAgICAiQWNjZXB0IjogInRleHQvcGxhaW4iCiAgfSwKICAic3RhdHVzIjogMjAwLAogICJzdGF0dXNUZXh0IjogIk9rIgp9",
                    filename: "incomingResponse.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-124"), [
                {
                    contentType: "application/json",
                    data: "ewogICJhbGxSZXF1ZXN0UmVzcG9uc2VzIjogW10sCiAgImJvZHkiOiAiVGhpcyBpcyBleGFtcGxlIHRleHQiLAogICJkdXJhdGlvbiI6IDEyMzQ1LAogICJoZWFkZXJzIjogewogICAgIkNvbnRlbnQtVHlwZSI6ICJ0ZXh0L3BsYWluIgogIH0sCiAgImlzT2tTdGF0dXNDb2RlIjogdHJ1ZSwKICAicmVxdWVzdEhlYWRlcnMiOiB7CiAgICAiQWNjZXB0IjogInRleHQvcGxhaW4iCiAgfSwKICAic3RhdHVzIjogMjAwLAogICJzdGF0dXNUZXh0IjogIk9rIgp9",
                    filename: "incomingResponse.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(evidenceCollection.getEvidence("CYP-125"), [
                {
                    contentType: "application/json",
                    data: "ewogICJhbGxSZXF1ZXN0UmVzcG9uc2VzIjogW10sCiAgImJvZHkiOiAiVGhpcyBpcyBleGFtcGxlIHRleHQiLAogICJkdXJhdGlvbiI6IDEyMzQ1LAogICJoZWFkZXJzIjogewogICAgIkNvbnRlbnQtVHlwZSI6ICJ0ZXh0L3BsYWluIgogIH0sCiAgImlzT2tTdGF0dXNDb2RlIjogdHJ1ZSwKICAicmVxdWVzdEhlYWRlcnMiOiB7CiAgICAiQWNjZXB0IjogInRleHQvcGxhaW4iCiAgfSwKICAic3RhdHVzIjogMjAwLAogICJzdGF0dXNUZXh0IjogIk9rIgp9",
                    filename: "incomingResponse.json",
                },
            ]);
        });
        (0, node_test_1.it)("handles multiple incoming responses for tests with the same issue key", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            const addEvidence = context.mock.method(evidenceCollection, "addEvidence", context.mock.fn());
            const listener = new tasks.PluginTaskListener("CYP", evidenceCollection, logging_1.LOG);
            const result1 = listener[tasks.PluginTask.INCOMING_RESPONSE]({
                filename: "incomingResponse1.json",
                response: {
                    allRequestResponses: [],
                    body: "This is example text",
                    duration: 12345,
                    headers: {
                        ["Content-Type"]: "text/plain",
                    },
                    isOkStatusCode: true,
                    requestHeaders: { ["Accept"]: "text/plain" },
                    status: 200,
                    statusText: "Ok",
                },
                test: "This is a test CYP-123: GET",
            });
            const result2 = listener[tasks.PluginTask.INCOMING_RESPONSE]({
                filename: "incomingResponse2.json",
                response: {
                    allRequestResponses: [],
                    body: "This page does not exist",
                    duration: 12345,
                    headers: {
                        ["Content-Type"]: "text/plain",
                    },
                    isOkStatusCode: false,
                    requestHeaders: { ["Accept"]: "text/plain" },
                    status: 404,
                    statusText: "Not found",
                },
                test: "This is a test CYP-123: POST",
            });
            node_assert_1.default.strictEqual(addEvidence.mock.callCount(), 2);
            node_assert_1.default.deepStrictEqual(addEvidence.mock.calls[0].arguments, [
                "CYP-123",
                {
                    contentType: "application/json",
                    data: "ewogICJhbGxSZXF1ZXN0UmVzcG9uc2VzIjogW10sCiAgImJvZHkiOiAiVGhpcyBpcyBleGFtcGxlIHRleHQiLAogICJkdXJhdGlvbiI6IDEyMzQ1LAogICJoZWFkZXJzIjogewogICAgIkNvbnRlbnQtVHlwZSI6ICJ0ZXh0L3BsYWluIgogIH0sCiAgImlzT2tTdGF0dXNDb2RlIjogdHJ1ZSwKICAicmVxdWVzdEhlYWRlcnMiOiB7CiAgICAiQWNjZXB0IjogInRleHQvcGxhaW4iCiAgfSwKICAic3RhdHVzIjogMjAwLAogICJzdGF0dXNUZXh0IjogIk9rIgp9",
                    filename: "incomingResponse1.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(addEvidence.mock.calls[1].arguments, [
                "CYP-123",
                {
                    contentType: "application/json",
                    data: "ewogICJhbGxSZXF1ZXN0UmVzcG9uc2VzIjogW10sCiAgImJvZHkiOiAiVGhpcyBwYWdlIGRvZXMgbm90IGV4aXN0IiwKICAiZHVyYXRpb24iOiAxMjM0NSwKICAiaGVhZGVycyI6IHsKICAgICJDb250ZW50LVR5cGUiOiAidGV4dC9wbGFpbiIKICB9LAogICJpc09rU3RhdHVzQ29kZSI6IGZhbHNlLAogICJyZXF1ZXN0SGVhZGVycyI6IHsKICAgICJBY2NlcHQiOiAidGV4dC9wbGFpbiIKICB9LAogICJzdGF0dXMiOiA0MDQsCiAgInN0YXR1c1RleHQiOiAiTm90IGZvdW5kIgp9",
                    filename: "incomingResponse2.json",
                },
            ]);
            node_assert_1.default.deepStrictEqual(result1, {
                allRequestResponses: [],
                body: "This is example text",
                duration: 12345,
                headers: {
                    ["Content-Type"]: "text/plain",
                },
                isOkStatusCode: true,
                requestHeaders: { ["Accept"]: "text/plain" },
                status: 200,
                statusText: "Ok",
            });
            node_assert_1.default.deepStrictEqual(result2, {
                allRequestResponses: [],
                body: "This page does not exist",
                duration: 12345,
                headers: {
                    ["Content-Type"]: "text/plain",
                },
                isOkStatusCode: false,
                requestHeaders: { ["Accept"]: "text/plain" },
                status: 404,
                statusText: "Not found",
            });
        });
        (0, node_test_1.it)("handles single incoming responses for tests without issue key", (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            const addEvidence = context.mock.method(evidenceCollection, "addEvidence", context.mock.fn());
            const listener = new tasks.PluginTaskListener("CYP", evidenceCollection, logging_1.LOG);
            listener[tasks.PluginTask.INCOMING_RESPONSE]({
                filename: "incomingResponse.json",
                response: {
                    allRequestResponses: [],
                    body: "This page does not exist",
                    duration: 12345,
                    headers: {
                        ["Content-Type"]: "text/plain",
                    },
                    isOkStatusCode: false,
                    requestHeaders: { ["Accept"]: "text/plain" },
                    status: 404,
                    statusText: "Not found",
                },
                test: "This is a test",
            });
            node_assert_1.default.strictEqual(addEvidence.mock.callCount(), 0);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Test: This is a test

                      Encountered a cy.request call which will not be included as evidence.

                        Caused by: Test: This is a test

                          No test issue keys found in title.

                          You can target existing test issues by adding a corresponding issue key:

                            it("CYP-123 This is a test", () => {
                              // ...
                            });

                          For more information, visit:
                          - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                `),
            ]);
        });
        (0, node_test_1.it)("handles multiple incoming responses for tests without issue key", (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const evidenceCollection = new context_1.SimpleEvidenceCollection();
            const addEvidence = context.mock.method(evidenceCollection, "addEvidence", context.mock.fn());
            const listener = new tasks.PluginTaskListener("CYP", evidenceCollection, logging_1.LOG);
            listener[tasks.PluginTask.INCOMING_RESPONSE]({
                filename: "incomingResponse1.json",
                response: {
                    allRequestResponses: [],
                    body: "This is example text",
                    duration: 12345,
                    headers: {
                        ["Content-Type"]: "text/plain",
                    },
                    isOkStatusCode: true,
                    requestHeaders: { ["Accept"]: "text/plain" },
                    status: 200,
                    statusText: "Ok",
                },
                test: "This is a test",
            });
            listener[tasks.PluginTask.INCOMING_RESPONSE]({
                filename: "incomingResponse2.json",
                response: {
                    allRequestResponses: [],
                    body: "This page does not exist",
                    duration: 12345,
                    headers: {
                        ["Content-Type"]: "text/plain",
                    },
                    isOkStatusCode: false,
                    requestHeaders: { ["Accept"]: "text/plain" },
                    status: 404,
                    statusText: "Not found",
                },
                test: "This is a test",
            });
            node_assert_1.default.strictEqual(addEvidence.mock.callCount(), 0);
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    Test: This is a test

                      Encountered a cy.request call which will not be included as evidence.

                        Caused by: Test: This is a test

                          No test issue keys found in title.

                          You can target existing test issues by adding a corresponding issue key:

                            it("CYP-123 This is a test", () => {
                              // ...
                            });

                          For more information, visit:
                          - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                `),
            ]);
        });
    });
});
