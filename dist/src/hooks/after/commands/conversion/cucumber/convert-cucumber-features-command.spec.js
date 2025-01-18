"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const dedent_1 = require("../../../../../util/dedent");
const logging_1 = require("../../../../../util/logging");
const constant_command_1 = require("../../../../util/commands/constant-command");
const convert_cucumber_features_command_1 = require("./convert-cucumber-features-command");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand.name, async () => {
        await (0, node_test_1.it)("converts cucumber results into cucumber features data", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartServer.json", "utf-8"));
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { precondition: undefined, test: undefined } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, { cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport.slice(0, 1)) });
            const features = await command.compute();
            node_assert_1.default.ok(Array.isArray(features));
            node_assert_1.default.strictEqual(features.length, 1);
        });
        await (0, node_test_1.it)("returns parameters", (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartServer.json", "utf-8"));
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { precondition: undefined, test: undefined } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, { cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport.slice(0, 1)) });
            node_assert_1.default.deepStrictEqual(command.getParameters(), {
                cucumber: {
                    prefixes: {
                        precondition: undefined,
                        test: undefined,
                    },
                },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                xray: { status: {}, uploadScreenshots: false },
            });
        });
        await (0, node_test_1.it)("converts cucumber results into cloud cucumber features data", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8"));
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { test: "TestName:" } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: true,
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, { cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport.slice(0, 1)) });
            const features = await command.compute();
            node_assert_1.default.ok(Array.isArray(features));
            node_assert_1.default.strictEqual(features.length, 1);
        });
        await (0, node_test_1.it)("includes all tagged features and tests", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8"));
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { test: "TestName:" } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: true,
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, { cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport) });
            const features = await command.compute();
            node_assert_1.default.ok(Array.isArray(features));
            node_assert_1.default.strictEqual(features.length, 2);
            node_assert_1.default.ok(Array.isArray(features[0].elements));
            node_assert_1.default.strictEqual(features[0].elements.length, 3);
            node_assert_1.default.ok(Array.isArray(features[1].elements));
            node_assert_1.default.strictEqual(features[1].elements.length, 1);
        });
        await (0, node_test_1.it)("uses the configured test execution issue key", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8"));
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { test: "TestName:" } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: true,
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, {
                cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport),
                testExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-456"),
            });
            const features = await command.compute();
            node_assert_1.default.deepStrictEqual(features[0].tags, [{ name: "@CYP-456" }]);
            node_assert_1.default.deepStrictEqual(features[1].tags, [{ name: "@CYP-456" }]);
        });
        await (0, node_test_1.it)("uses the configured test execution issue key even without existing tags", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8"));
            delete cucumberReport[0].tags;
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { test: "TestName:" } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: true,
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, {
                cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport),
                testExecutionIssueKey: new constant_command_1.ConstantCommand(logging_1.LOG, "CYP-456"),
            });
            const features = await command.compute();
            node_assert_1.default.deepStrictEqual(features[0].tags, [{ name: "@CYP-456" }]);
        });
        await (0, node_test_1.it)("includes screenshots if enabled", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8"));
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { test: "TestName:" } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: true,
                xray: { status: {}, uploadScreenshots: true },
            }, logging_1.LOG, { cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport) });
            const features = await command.compute();
            node_assert_1.default.strictEqual((_a = features[0].elements[2].steps[1].embeddings) === null || _a === void 0 ? void 0 : _a.length, 1);
            node_assert_1.default.deepStrictEqual(typeof features[0].elements[2].steps[1].embeddings[0].data, "string");
            node_assert_1.default.deepStrictEqual(features[0].elements[2].steps[1].embeddings[0].mime_type, "image/png");
        });
        await (0, node_test_1.it)("respects custom statuses", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { test: "TestName:" } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: true,
                xray: {
                    status: {
                        step: {
                            failed: "DID FAIL",
                            passed: "DID PASS",
                            pending: "IS PENDING",
                            skipped: "WAS SKIPPED",
                        },
                    },
                    uploadScreenshots: false,
                },
            }, logging_1.LOG, {
                cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, [
                    {
                        description: "",
                        elements: [
                            {
                                description: "",
                                id: "a-tagged-feature;tc---development",
                                keyword: "Scenario",
                                line: 9,
                                name: "TC - Development",
                                steps: [
                                    {
                                        arguments: [],
                                        embeddings: [],
                                        keyword: "Given ",
                                        line: 5,
                                        name: "abc123",
                                        result: {
                                            duration: 0,
                                            status: "undefined",
                                        },
                                    },
                                    {
                                        arguments: [],
                                        keyword: "Then ",
                                        line: 6,
                                        name: "xyz9871",
                                        result: {
                                            duration: 0,
                                            status: "skipped",
                                        },
                                    },
                                    {
                                        arguments: [],
                                        keyword: "Given ",
                                        line: 10,
                                        name: "an assumption",
                                        result: {
                                            duration: 0,
                                            status: "passed",
                                        },
                                    },
                                    {
                                        arguments: [],
                                        keyword: "When ",
                                        line: 11,
                                        name: "a when",
                                        result: {
                                            duration: 0,
                                            status: "unknown",
                                        },
                                    },
                                    {
                                        arguments: [],
                                        keyword: "And ",
                                        line: 12,
                                        name: "an and",
                                        result: {
                                            duration: 0,
                                            status: "failed",
                                        },
                                    },
                                    {
                                        arguments: [],
                                        keyword: "Then ",
                                        line: 13,
                                        name: "a then",
                                        result: {
                                            duration: 0,
                                            status: "pending",
                                        },
                                    },
                                ],
                                tags: [
                                    {
                                        line: 8,
                                        name: "@ABC-63",
                                    },
                                    {
                                        line: 67,
                                        name: "@TestName:CYP-123",
                                    },
                                ],
                                type: "scenario",
                            },
                        ],
                        id: "a-tagged-feature",
                        keyword: "Feature",
                        line: 1,
                        name: "A tagged feature",
                        tags: [],
                        uri: "cypress/e2e/spec.cy.feature",
                    },
                ]),
            });
            const features = await command.compute();
            node_assert_1.default.strictEqual(features[0].elements[0].steps[0].result.status, "undefined");
            node_assert_1.default.strictEqual(features[0].elements[0].steps[1].result.status, "WAS SKIPPED");
            node_assert_1.default.strictEqual(features[0].elements[0].steps[2].result.status, "DID PASS");
            node_assert_1.default.strictEqual(features[0].elements[0].steps[3].result.status, "unknown");
            node_assert_1.default.strictEqual(features[0].elements[0].steps[4].result.status, "DID FAIL");
            node_assert_1.default.strictEqual(features[0].elements[0].steps[5].result.status, "IS PENDING");
        });
        await (0, node_test_1.it)("skips background elements", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8"));
            cucumberReport[0].elements[0].type = "background";
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { test: "TestName:" } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: true,
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, { cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport) });
            const features = await command.compute();
            node_assert_1.default.strictEqual(features[0].elements.length, 2);
        });
        await (0, node_test_1.it)("skips embeddings if screenshots are disabled", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8"));
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { test: "TestName:" } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: true,
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, { cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport) });
            const features = await command.compute();
            node_assert_1.default.deepStrictEqual(features[0].elements[0].steps[0].embeddings, []);
            node_assert_1.default.deepStrictEqual(features[0].elements[0].steps[1].embeddings, []);
            node_assert_1.default.deepStrictEqual(features[0].elements[1].steps[0].embeddings, []);
            node_assert_1.default.deepStrictEqual(features[0].elements[1].steps[1].embeddings, []);
            node_assert_1.default.deepStrictEqual(features[0].elements[2].steps[0].embeddings, []);
            node_assert_1.default.deepStrictEqual(features[0].elements[2].steps[1].embeddings, []);
        });
        await (0, node_test_1.it)("skips untagged scenarios", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartUntagged.json", "utf-8"));
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { test: "TestName:" } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: false,
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, { cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport) });
            const features = await command.compute();
            node_assert_1.default.deepStrictEqual(message.mock.calls[0].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    ${(0, node_path_1.resolve)(".", "test", "resources", "cypress", "e2e", "features", "example.feature")}

                      Scenario: <no name>

                        Skipping result upload.

                          Caused by: Scenario: <no name>

                            No test issue keys found in tags.

                            You can target existing test issues by adding a corresponding tag:

                              @CYP-123
                              Scenario:
                                When I prepare something
                                ...

                            You can also specify a prefix to match the tagging scheme configured in your Xray instance:

                              Plugin configuration:

                                {
                                  cucumber: {
                                    prefixes: {
                                      test: "TestName:"
                                    }
                                  }
                                }

                              Feature file:

                                @TestName:CYP-123
                                Scenario:
                                  When I prepare something
                                  ...

                            For more information, visit:
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                            - https://docs.getxray.app/display/XRAY/Importing+Cucumber+Tests+-+REST
                `),
            ]);
            node_assert_1.default.deepStrictEqual(features, []);
        });
        await (0, node_test_1.it)("skips scenarios without recognised issue tags", async (context) => {
            const message = context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartCloud.json", "utf-8"));
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: {} },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: false,
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, { cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport) });
            const features = await command.compute();
            node_assert_1.default.deepStrictEqual(message.mock.calls[3].arguments, [
                logging_1.Level.WARNING,
                (0, dedent_1.dedent)(`
                    ${(0, node_path_1.resolve)(".", "test", "resources", "cypress", "e2e", "spec.cy.feature")}

                      Scenario: TC - Development

                        Skipping result upload.

                          Caused by: Scenario: TC - Development

                            No test issue keys found in tags:

                              @ABC-63
                              @TestName:CYP-123

                            If a tag contains the test issue key already, specify a global prefix to align the plugin with Xray.

                              For example, with the following plugin configuration:

                                {
                                  cucumber: {
                                    prefixes: {
                                      test: "TestName:"
                                    }
                                  }
                                }

                              The following tag will be recognized as a test issue tag by the plugin:

                                @TestName:CYP-123
                                Scenario: TC - Development
                                  Given abc123
                                  ...

                            For more information, visit:
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                            - https://docs.getxray.app/display/XRAY/Importing+Cucumber+Tests+-+REST
                `),
            ]);
            node_assert_1.default.deepStrictEqual(features, []);
        });
        await (0, node_test_1.it)("includes scenarios with multiple tags", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const cucumberReport = JSON.parse((0, node_fs_1.readFileSync)("./test/resources/fixtures/xray/requests/importExecutionCucumberMultipartMultipleTags.json", "utf-8"));
            const command = new convert_cucumber_features_command_1.ConvertCucumberFeaturesCommand({
                cucumber: { prefixes: { test: "TestName:" } },
                jira: {
                    projectKey: "CYP",
                },
                projectRoot: "./test/resources",
                useCloudTags: true,
                xray: { status: {}, uploadScreenshots: false },
            }, logging_1.LOG, { cucumberResults: new constant_command_1.ConstantCommand(logging_1.LOG, cucumberReport) });
            const features = await command.compute();
            node_assert_1.default.strictEqual(features.length, 1);
            node_assert_1.default.deepStrictEqual(features[0].elements[0].tags, [
                {
                    line: 4,
                    name: "@TestName:CYP-123",
                },
                {
                    line: 4,
                    name: "@TestName:CYP-456",
                },
            ]);
        });
    });
});
