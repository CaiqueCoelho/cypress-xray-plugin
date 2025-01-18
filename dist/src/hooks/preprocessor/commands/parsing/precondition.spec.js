"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const gherkin_1 = require("./gherkin");
const precondition_1 = require("./precondition");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(precondition_1.getCucumberPreconditionIssueComments.name, async () => {
        await (0, node_test_1.it)("extracts relevant comments without prefix", () => {
            var _a;
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedNoPrefixMultipleBackground.feature");
            // Cast because we know for certain it exists.
            const background = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[0].background;
            const comments = (0, precondition_1.getCucumberPreconditionIssueComments)(background, document.comments);
            node_assert_1.default.deepStrictEqual(comments, ["#@CYP-244", "# a random comment", "#@CYP-262"]);
        });
        await (0, node_test_1.it)("extracts relevant comments with prefix", () => {
            var _a;
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixMultipleBackground.feature");
            // Cast because we know for certain it exists.
            const background = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[0].background;
            const comments = (0, precondition_1.getCucumberPreconditionIssueComments)(background, document.comments);
            node_assert_1.default.deepStrictEqual(comments, [
                "#@Precondition:CYP-244",
                "# a random comment",
                "#@Precondition:CYP-262",
            ]);
        });
        await (0, node_test_1.it)("handles empty backgrounds", () => {
            var _a;
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedNoPrefixMultipleBackground.feature");
            // Cast because we know for certain it exists.
            const background = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[0].background;
            background.steps = [];
            const comments = (0, precondition_1.getCucumberPreconditionIssueComments)(background, document.comments);
            node_assert_1.default.deepStrictEqual(comments, []);
        });
    });
    await (0, node_test_1.describe)(precondition_1.getCucumberPreconditionIssueTags.name, async () => {
        await (0, node_test_1.it)("extracts background tags without prefix", () => {
            var _a;
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedNoPrefixMultipleBackground.feature");
            // Cast because we know for certain it exists.
            const background = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[0].background;
            const comments = (0, precondition_1.getCucumberPreconditionIssueComments)(background, document.comments);
            const tags = (0, precondition_1.getCucumberPreconditionIssueTags)(background, "CYP", comments);
            node_assert_1.default.deepStrictEqual(tags, ["CYP-244", "CYP-262"]);
        });
        await (0, node_test_1.it)("extracts background tags with prefix", () => {
            var _a;
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixMultipleBackground.feature");
            // Cast because we know for certain it exists.
            const background = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[0].background;
            const comments = (0, precondition_1.getCucumberPreconditionIssueComments)(background, document.comments);
            const tags = (0, precondition_1.getCucumberPreconditionIssueTags)(background, "CYP", comments, "Precondition:");
            node_assert_1.default.deepStrictEqual(tags, ["CYP-244", "CYP-262"]);
        });
        await (0, node_test_1.it)("handles empty backgrounds", () => {
            var _a;
            const document = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixMultipleBackground.feature");
            // Cast because we know for certain it exists.
            const background = (_a = document.feature) === null || _a === void 0 ? void 0 : _a.children[0].background;
            background.steps = [];
            const tags = (0, precondition_1.getCucumberPreconditionIssueTags)(background, "CYP", [], "Precondition:");
            node_assert_1.default.deepStrictEqual(tags, []);
        });
    });
});
