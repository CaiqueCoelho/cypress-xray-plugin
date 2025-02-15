"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const dedent_1 = require("../../../util/dedent");
const logging_1 = require("../../../util/logging");
const constant_command_1 = require("../../util/commands/constant-command");
const extract_feature_file_issues_command_1 = require("./extract-feature-file-issues-command");
const gherkin_1 = require("./parsing/gherkin");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand.name, async () => {
        await (0, node_test_1.it)("extracts cucumber issue data", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixCorrect.feature");
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: true,
                filePath: "./some-file.feature",
                prefixes: { precondition: "Precondition:", test: "TestName:" },
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            node_assert_1.default.deepStrictEqual(await extractIssueKeysCommand.compute(), {
                preconditions: [{ key: "CYP-222", summary: "" }],
                tests: [
                    {
                        key: "CYP-333",
                        summary: "Scenario 1",
                        tags: ["TestName:CYP-333", "TestSet:CYP-444"],
                    },
                    {
                        key: "CYP-555",
                        summary: "Scenario 2",
                        tags: ["TestName:CYP-555", "TestSet:CYP-444"],
                    },
                ],
            });
        });
        await (0, node_test_1.it)("skips empty feature files", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = {
                comments: [],
            };
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: true,
                filePath: "./some-file.feature",
                prefixes: {},
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            node_assert_1.default.deepStrictEqual(await extractIssueKeysCommand.compute(), {
                preconditions: [],
                tests: [],
            });
        });
        await (0, node_test_1.it)("handles rules", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = {
                comments: [{ location: { line: 5 }, text: "@CYP-456" }],
                feature: {
                    children: [
                        {
                            rule: {
                                children: [
                                    {
                                        background: {
                                            description: "",
                                            id: "123242-background",
                                            keyword: "Background",
                                            location: { line: 4 },
                                            name: "A background",
                                            steps: [
                                                {
                                                    id: "123242-background-given",
                                                    keyword: "Given",
                                                    location: { line: 6 },
                                                    text: "Something",
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        scenario: {
                                            description: "",
                                            examples: [],
                                            id: "123242-scenario",
                                            keyword: "Scenario",
                                            location: { line: 8 },
                                            name: "A scenario",
                                            steps: [],
                                            tags: [
                                                {
                                                    id: "123242-scenario-tag",
                                                    location: { line: 7 },
                                                    name: "@CYP-123",
                                                },
                                            ],
                                        },
                                    },
                                ],
                                description: "",
                                id: "123242-rule",
                                keyword: "Rule",
                                location: { line: 3 },
                                name: "A rule",
                                tags: [],
                            },
                        },
                    ],
                    description: "",
                    keyword: "Feature",
                    language: "en",
                    location: { line: 1 },
                    name: "Rule feature",
                    tags: [],
                },
            };
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: true,
                filePath: "./some-file.feature",
                prefixes: {},
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            node_assert_1.default.deepStrictEqual(await extractIssueKeysCommand.compute(), {
                preconditions: [{ key: "CYP-456", summary: "A background" }],
                tests: [{ key: "CYP-123", summary: "A scenario", tags: ["CYP-123"] }],
            });
        });
        await (0, node_test_1.it)("throws for missing scenario tags", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixMissingScenario.feature");
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: true,
                filePath: "./test/resources/features/taggedPrefixMissingScenario.feature",
                prefixes: { precondition: "Precondition:" },
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                message: (0, dedent_1.dedent)(`
                    ./test/resources/features/taggedPrefixMissingScenario.feature

                      Scenario: A scenario

                        No test issue keys found in tags.

                        You can target existing test issues by adding a corresponding tag:

                          @CYP-123
                          Scenario: A scenario
                            Given an assumption
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
                            Scenario: A scenario
                              Given an assumption
                              ...

                        For more information, visit:
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                        - https://docs.getxray.app/display/XRAYCLOUD/Importing+Cucumber+Tests+-+REST+v2
                `),
            });
        });
        await (0, node_test_1.it)("throws for missing scenario tags (no scenario name)", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixMissingScenario.feature");
            // Cast because we know for certain it exists.
            const scenario = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[1].scenario;
            scenario.name = "";
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: true,
                filePath: "./test/resources/features/taggedPrefixMissingScenario.feature",
                prefixes: { precondition: "Precondition:" },
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                message: (0, dedent_1.dedent)(`
                    ./test/resources/features/taggedPrefixMissingScenario.feature

                      Scenario: <no name>

                        No test issue keys found in tags.

                        You can target existing test issues by adding a corresponding tag:

                          @CYP-123
                          Scenario:
                            Given an assumption
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
                              Given an assumption
                              ...

                        For more information, visit:
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                        - https://docs.getxray.app/display/XRAYCLOUD/Importing+Cucumber+Tests+-+REST+v2
                `),
            });
        });
        await (0, node_test_1.it)("throws for wrong scenario tags", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedWrongScenarioTags.feature");
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: false,
                filePath: "./test/resources/features/taggedWrongScenarioTags.feature",
                prefixes: {},
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                message: (0, dedent_1.dedent)(`
                    ./test/resources/features/taggedWrongScenarioTags.feature

                      Scenario: A scenario

                        No test issue keys found in tags:

                          @Test:CYP-123
                          @Cool
                          @Lucky:CYP-415

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
                            Scenario: A scenario
                              Given an assumption
                              ...

                        For more information, visit:
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                        - https://docs.getxray.app/display/XRAY/Importing+Cucumber+Tests+-+REST
                `),
            });
        });
        await (0, node_test_1.it)("throws for wrong scenario tags (no scenario name, no steps)", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedWrongScenarioTags.feature");
            // Cast because we know for certain it exists.
            const scenario = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[1].scenario;
            scenario.name = "";
            scenario.steps = [];
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: true,
                filePath: "./test/resources/features/taggedWrongScenarioTags.feature",
                prefixes: {},
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                message: (0, dedent_1.dedent)(`
                    ./test/resources/features/taggedWrongScenarioTags.feature

                      Scenario: <no name>

                        No test issue keys found in tags:

                          @Test:CYP-123
                          @Cool
                          @Lucky:CYP-415

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
                            Scenario:
                              Given A step
                              ...

                        For more information, visit:
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                        - https://docs.getxray.app/display/XRAYCLOUD/Importing+Cucumber+Tests+-+REST+v2
                `),
            });
        });
        await (0, node_test_1.it)("throws for missing background tags", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixMissingBackground.feature");
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: true,
                filePath: "./test/resources/features/taggedPrefixMissingBackground.feature",
                prefixes: { test: "TestName:" },
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                message: (0, dedent_1.dedent)(`
                    ./test/resources/features/taggedPrefixMissingBackground.feature

                      Background: A background

                        No precondition issue keys found in comments.

                        You can target existing precondition issues by adding a corresponding comment:

                          Background: A background
                            #@CYP-123
                            Given abc123
                            ...

                        You can also specify a prefix to match the tagging scheme configured in your Xray instance:

                          Plugin configuration:

                            {
                              cucumber: {
                                prefixes: {
                                  precondition: "Precondition:"
                                }
                              }
                            }

                          Feature file:

                            Background: A background
                              #@Precondition:CYP-123
                              Given abc123
                              ...

                        For more information, visit:
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                        - https://docs.getxray.app/display/XRAYCLOUD/Importing+Cucumber+Tests+-+REST+v2
                `),
            });
        });
        await (0, node_test_1.it)("throws for missing background tags (no background steps and names)", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixMissingBackground.feature");
            // Cast because we know for certain it exists.
            const background = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[0].background;
            background.steps = [];
            background.name = "";
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: false,
                filePath: "./test/resources/features/taggedPrefixMissingBackground.feature",
                prefixes: { test: "TestName:" },
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                message: (0, dedent_1.dedent)(`
                    ./test/resources/features/taggedPrefixMissingBackground.feature

                      Background: <no name>

                        No precondition issue keys found in comments.

                        You can target existing precondition issues by adding a corresponding comment:

                          Background:
                            #@CYP-123
                            Given A step
                            ...

                        You can also specify a prefix to match the tagging scheme configured in your Xray instance:

                          Plugin configuration:

                            {
                              cucumber: {
                                prefixes: {
                                  precondition: "Precondition:"
                                }
                              }
                            }

                          Feature file:

                            Background:
                              #@Precondition:CYP-123
                              Given A step
                              ...

                        For more information, visit:
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                        - https://docs.getxray.app/display/XRAY/Importing+Cucumber+Tests+-+REST
                `),
            });
        });
        await (0, node_test_1.it)("throws for wrong background tags (no background name)", async (context) => {
            var _a;
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedWrongBackgroundTags.feature");
            // Cast because we know for certain it exists.
            const background = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[0].background;
            background.name = "";
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: true,
                filePath: "./test/resources/features/taggedWrongBackgroundTags.feature",
                prefixes: {},
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                message: (0, dedent_1.dedent)(`
                    ./test/resources/features/taggedWrongBackgroundTags.feature

                      Background: <no name>

                        No precondition issue keys found in comments:

                          #@HairConditioning:CYP-244
                          #@PavlovConditioning:CYP-784

                        If a comment contains the precondition issue key already, specify a global prefix to align the plugin with Xray.

                          For example, with the following plugin configuration:

                            {
                              cucumber: {
                                prefixes: {
                                  precondition: "Precondition:"
                                }
                              }
                            }

                          The following comment will be recognized as a precondition issue tag by the plugin:

                            Background:
                              #@Precondition:CYP-123
                              Given abc123
                              ...

                        For more information, visit:
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                        - https://docs.getxray.app/display/XRAYCLOUD/Importing+Cucumber+Tests+-+REST+v2
                `),
            });
        });
        await (0, node_test_1.it)("throws for wrong background tags", async (context) => {
            context.mock.method(logging_1.LOG, "message", context.mock.fn());
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedWrongBackgroundTags.feature");
            const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                displayCloudHelp: false,
                filePath: "./test/resources/features/taggedWrongBackgroundTags.feature",
                prefixes: {},
                projectKey: "CYP",
            }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
            await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                message: (0, dedent_1.dedent)(`
                    ./test/resources/features/taggedWrongBackgroundTags.feature

                      Background: A background

                        No precondition issue keys found in comments:

                          #@HairConditioning:CYP-244
                          #@PavlovConditioning:CYP-784

                        If a comment contains the precondition issue key already, specify a global prefix to align the plugin with Xray.

                          For example, with the following plugin configuration:

                            {
                              cucumber: {
                                prefixes: {
                                  precondition: "Precondition:"
                                }
                              }
                            }

                          The following comment will be recognized as a precondition issue tag by the plugin:

                            Background: A background
                              #@Precondition:CYP-123
                              Given abc123
                              ...

                        For more information, visit:
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                        - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#prefixes
                        - https://docs.getxray.app/display/XRAY/Importing+Cucumber+Tests+-+REST
                `),
            });
        });
        await (0, node_test_1.describe)("no prefix", async () => {
            await (0, node_test_1.it)("throws for multiple scenario tags (no scenario name, no steps)", async (context) => {
                var _a;
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedNoPrefixMultipleScenario.feature");
                // Cast because we know for certain it exists.
                const scenario = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[1].scenario;
                scenario.name = "";
                scenario.steps = [];
                const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                    displayCloudHelp: false,
                    filePath: "./test/resources/features/taggedNoPrefixMultipleScenario.feature",
                    prefixes: {},
                    projectKey: "CYP",
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
                await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                    message: (0, dedent_1.dedent)(`
                        ./test/resources/features/taggedNoPrefixMultipleScenario.feature

                          Scenario: <no name>

                            Multiple test issue keys found in the scenario's tags. Xray will only take one into account, you have to decide which one to use:

                              @CYP-123 @Some @Other @CYP-456 @Tags
                              ^^^^^^^^              ^^^^^^^^
                              Scenario:
                                Given A step
                                ...

                            For more information, visit:
                            - https://docs.getxray.app/display/XRAY/Importing+Cucumber+Tests+-+REST
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                    `),
                });
            });
            await (0, node_test_1.it)("throws for multiple background tags", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedNoPrefixMultipleBackground.feature");
                const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                    displayCloudHelp: false,
                    filePath: "./test/resources/features/taggedNoPrefixMultipleBackground.feature",
                    prefixes: {},
                    projectKey: "CYP",
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
                await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                    message: (0, dedent_1.dedent)(`
                        ./test/resources/features/taggedNoPrefixMultipleBackground.feature

                          Background: A background

                            Multiple precondition issue keys found in the background's comments. Xray will only take one into account, you have to decide which one to use:

                              Background: A background
                                #@CYP-244
                                ^^^^^^^^^
                                # a random comment
                                #@CYP-262
                                ^^^^^^^^^
                                Given abc123
                                ...

                            For more information, visit:
                            - https://docs.getxray.app/display/XRAY/Importing+Cucumber+Tests+-+REST
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                    `),
                });
            });
            await (0, node_test_1.it)("throws for multiple background tags (no background name)", async (context) => {
                var _a;
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedNoPrefixMultipleBackground.feature");
                // Cast because we know for certain it exists.
                const background = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[0].background;
                background.name = "";
                const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                    displayCloudHelp: false,
                    filePath: "./test/resources/features/taggedNoPrefixMultipleBackground.feature",
                    prefixes: {},
                    projectKey: "CYP",
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
                await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                    message: (0, dedent_1.dedent)(`
                        ./test/resources/features/taggedNoPrefixMultipleBackground.feature

                          Background: <no name>

                            Multiple precondition issue keys found in the background's comments. Xray will only take one into account, you have to decide which one to use:

                              Background:
                                #@CYP-244
                                ^^^^^^^^^
                                # a random comment
                                #@CYP-262
                                ^^^^^^^^^
                                Given abc123
                                ...

                            For more information, visit:
                            - https://docs.getxray.app/display/XRAY/Importing+Cucumber+Tests+-+REST
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                    `),
                });
            });
        });
        await (0, node_test_1.describe)("prefixed", async () => {
            await (0, node_test_1.it)("throws for multiple scenario tags", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixMultipleScenario.feature");
                const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                    displayCloudHelp: true,
                    filePath: "./test/resources/features/taggedPrefixMultipleScenario.feature",
                    prefixes: { precondition: "Precondition:", test: "TestName:" },
                    projectKey: "CYP",
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
                await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                    message: (0, dedent_1.dedent)(`
                        ./test/resources/features/taggedPrefixMultipleScenario.feature

                          Scenario: A scenario

                            Multiple test issue keys found in the scenario's tags. Xray will only take one into account, you have to decide which one to use:

                              @TestName:CYP-123 @Some @Other @TestName:CYP-456 @Tags
                              ^^^^^^^^^^^^^^^^^              ^^^^^^^^^^^^^^^^^
                              Scenario: A scenario
                                Given an assumption
                                ...

                            For more information, visit:
                            - https://docs.getxray.app/display/XRAYCLOUD/Importing+Cucumber+Tests+-+REST+v2
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                    `),
                });
            });
            await (0, node_test_1.it)("throws for multiple background tags", async (context) => {
                context.mock.method(logging_1.LOG, "message", context.mock.fn());
                const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixMultipleBackground.feature");
                const extractIssueKeysCommand = new extract_feature_file_issues_command_1.ExtractFeatureFileIssuesCommand({
                    displayCloudHelp: true,
                    filePath: "./test/resources/features/taggedPrefixMultipleBackground.feature",
                    prefixes: { precondition: "Precondition:" },
                    projectKey: "CYP",
                }, logging_1.LOG, new constant_command_1.ConstantCommand(logging_1.LOG, document));
                await node_assert_1.default.rejects(extractIssueKeysCommand.compute(), {
                    message: (0, dedent_1.dedent)(`
                        ./test/resources/features/taggedPrefixMultipleBackground.feature

                          Background: A background

                            Multiple precondition issue keys found in the background's comments. Xray will only take one into account, you have to decide which one to use:

                              Background: A background
                                #@Precondition:CYP-244
                                ^^^^^^^^^^^^^^^^^^^^^^
                                # a random comment
                                #@Precondition:CYP-262
                                ^^^^^^^^^^^^^^^^^^^^^^
                                Given abc123
                                ...

                            For more information, visit:
                            - https://docs.getxray.app/display/XRAYCLOUD/Importing+Cucumber+Tests+-+REST+v2
                            - https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/targetingExistingIssues/
                    `),
                });
            });
        });
    });
});
