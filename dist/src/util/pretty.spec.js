"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = require("node:path");
const node_process_1 = require("node:process");
const node_test_1 = require("node:test");
const pretty_1 = require("./pretty");
(0, node_test_1.describe)((0, node_path_1.relative)((0, node_process_1.cwd)(), __filename), async () => {
    await (0, node_test_1.describe)(pretty_1.prettyPadObjects.name, async () => {
        await (0, node_test_1.it)("pretty pad object arrays", () => {
            const array = [
                {
                    clauseNames: ["summary"],
                    custom: false,
                    id: "summary",
                    name: "Summary",
                    navigable: true,
                    orderable: true,
                    schema: {
                        system: "summary",
                        type: "string",
                    },
                    searchable: true,
                },
                {
                    custom: false,
                    id: "description",
                    individualProperty: "I'm a space traveller",
                    name: "Description",
                    orderable: true,
                    schema: {
                        system: "description",
                        type: "string",
                    },
                },
            ];
            node_assert_1.default.deepStrictEqual((0, pretty_1.prettyPadObjects)(array), [
                {
                    clauseNames: '["summary"]',
                    custom: "false",
                    id: '"summary"    ',
                    name: '"Summary"    ',
                    navigable: "true",
                    orderable: "true",
                    schema: '{"system":"summary","type":"string"}    ',
                    searchable: "true",
                },
                {
                    custom: "false",
                    id: '"description"',
                    individualProperty: '"I\'m a space traveller"',
                    name: '"Description"',
                    orderable: "true",
                    schema: '{"system":"description","type":"string"}',
                },
            ]);
        });
        await (0, node_test_1.it)("pretty pad object values", () => {
            node_assert_1.default.deepStrictEqual((0, pretty_1.prettyPadValues)({
                a: [1, 2, false, true, "george"],
                somethingLong: {
                    i: 1,
                    j: 2,
                    k: "snake",
                },
                x: 12345,
                y: "hello gooood Morning",
            }), {
                a: '[1,2,false,true,"george"]',
                somethingLong: '{"i":1,"j":2,"k":"snake"}',
                x: "12345                    ",
                y: '"hello gooood Morning"   ',
            });
        });
    });
});
