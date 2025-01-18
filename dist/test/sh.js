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
exports.runCypress = runCypress;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const childProcess = __importStar(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importStar(require("path"));
const dedent_1 = require("../src/util/dedent");
const ENV_BACKUP = { ...process.env };
require("dotenv/config");
const CYPRESS_EXECUTABLE = path_1.default.join(__dirname, "..", "node_modules", ".bin", "cypress");
const ENV_CLOUD = [
    "CYPRESS_JIRA_PROJECT_KEY_CLOUD",
    "CYPRESS_XRAY_CLIENT_SECRET_CLOUD",
    "CYPRESS_XRAY_CLIENT_ID_CLOUD",
    "CYPRESS_JIRA_API_TOKEN_CLOUD",
    "CYPRESS_JIRA_USERNAME_CLOUD",
    "CYPRESS_JIRA_URL_CLOUD",
    "CYPRESS_JIRA_PASSWORD_CLOUD",
];
const ENV_SERVER = [
    "CYPRESS_JIRA_PROJECT_KEY_SERVER",
    "CYPRESS_XRAY_CLIENT_SECRET_SERVER",
    "CYPRESS_XRAY_CLIENT_ID_SERVER",
    "CYPRESS_JIRA_API_TOKEN_SERVER",
    "CYPRESS_JIRA_USERNAME_SERVER",
    "CYPRESS_JIRA_URL_SERVER",
    "CYPRESS_JIRA_PASSWORD_SERVER",
];
function runCypress(cwd, options) {
    var _a;
    let mergedEnv = {
        ...ENV_BACKUP,
    };
    if ((options === null || options === void 0 ? void 0 : options.includeDefaultEnv) === "cloud") {
        mergedEnv = {
            ...mergedEnv,
            ...getEnv(ENV_CLOUD),
        };
    }
    if ((options === null || options === void 0 ? void 0 : options.includeDefaultEnv) === "server") {
        mergedEnv = {
            ...mergedEnv,
            ...getEnv(ENV_SERVER),
        };
    }
    mergedEnv = {
        ...mergedEnv,
        ...options === null || options === void 0 ? void 0 : options.env,
    };
    fs_1.default.writeFileSync(path_1.default.join(cwd, "cypress.env.json"), JSON.stringify(mergedEnv, (...args) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return args[1] ? args[1] : undefined;
    }, 2).replaceAll("CYPRESS_", ""));
    if (!fs_1.default.existsSync((0, path_1.join)(cwd, "node_modules"))) {
        const result = childProcess.spawnSync("npm", ["install"], {
            cwd: cwd,
            shell: true,
        });
        if (result.status !== 0) {
            if (result.error) {
                throw new Error((0, dedent_1.dedent)(`
                        npm installation finished with unexpected non-zero status code ${ansi_colors_1.default.red(String(result.status))}:

                            ${ansi_colors_1.default.red(result.error.toString())}

                            stdout:

                                ${String(result.stdout)}

                            stderr:

                                ${String(result.stderr)}
                    `));
            }
            throw new Error((0, dedent_1.dedent)(`
                    npm installation finished with unexpected non-zero status code ${ansi_colors_1.default.red(String(result.status))}

                        stdout:

                            ${String(result.stdout)}

                        stderr:

                            ${String(result.stderr)}
                `));
        }
    }
    const result = childProcess.spawnSync(CYPRESS_EXECUTABLE, ["run"], {
        cwd: cwd,
        env: mergedEnv,
        shell: true,
    });
    if (result.status !== ((_a = options === null || options === void 0 ? void 0 : options.expectedStatusCode) !== null && _a !== void 0 ? _a : 0)) {
        if (result.error) {
            throw new Error((0, dedent_1.dedent)(`
                    Cypress command finished with unexpected non-zero status code ${ansi_colors_1.default.red(String(result.status))}:

                        ${ansi_colors_1.default.red(result.error.toString())}

                        stdout:

                            ${String(result.stdout)}

                        stderr:

                            ${String(result.stderr)}
                `));
        }
        throw new Error((0, dedent_1.dedent)(`
                Cypress command finished with unexpected non-zero status code ${ansi_colors_1.default.red(String(result.status))}

                    stdout:

                        ${String(result.stdout)}

                    stderr:

                        ${String(result.stderr)}
            `));
    }
    return result.output
        .filter((buffer) => buffer !== null)
        .map((buffer) => buffer.toString("utf8"));
}
function getEnv(names) {
    const env = {};
    for (const name of names) {
        const truncatedName = name.replace(/_CLOUD$/, "").replace(/_SERVER$/, "");
        const value = process.env[name];
        env[truncatedName] = value;
    }
    return env;
}
