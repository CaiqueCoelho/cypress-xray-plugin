"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockedCypress = getMockedCypress;
function getMockedCypress() {
    global.Cypress = {
        ["Commands"]: {},
        currentTest: {},
    };
    global.cy = {
        task: () => {
            throw new Error("Mock called unexpectedly");
        },
    };
    return { cy: global.cy, cypress: global.Cypress };
}
