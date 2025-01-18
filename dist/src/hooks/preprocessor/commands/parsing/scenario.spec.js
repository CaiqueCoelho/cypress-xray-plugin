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
const scenario_1 = require("./scenario");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(scenario_1.getCucumberScenarioIssueTags.name, async () => {
        await (0, node_test_1.it)("extracts scenario tags without prefix", () => {
            const feature = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedNoPrefixMultipleScenario.feature").feature;
            // Cast because we know for certain it exists.
            const scenario = feature === null || feature === void 0 ? void 0 : feature.children[1].scenario;
            node_assert_1.default.deepStrictEqual((0, scenario_1.getCucumberScenarioIssueTags)(scenario, "CYP"), [
                "CYP-123",
                "CYP-456",
            ]);
        });
        await (0, node_test_1.it)("extracts scenario tags with prefix", () => {
            const feature = (0, gherkin_1.parseFeatureFile)("./test/resources/features/taggedPrefixMultipleScenario.feature").feature;
            // Cast because we know for certain it exists.
            const scenario = feature === null || feature === void 0 ? void 0 : feature.children[1].scenario;
            node_assert_1.default.deepStrictEqual((0, scenario_1.getCucumberScenarioIssueTags)(scenario, "CYP", "TestName:"), [
                "CYP-123",
                "CYP-456",
            ]);
        });
    });
});
