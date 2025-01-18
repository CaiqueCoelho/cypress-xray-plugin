import type { CypressFailedRunResultType, CypressRunResultType } from "../src/types/cypress/cypress";
export declare const TEST_TMP_DIR: string;
export declare function resolveTestDirPath(...subPaths: string[]): string;
/**
 * Recursively returns all files in the given directory that match the provided filename filter.
 *
 * @param dir - the entry directory
 * @param filter - the filename filter
 * @returns all matching files
 */
export declare function findFiles(dir: string, filter: (filename: string) => boolean): string[];
/**
 * Use in place of `expect(value).to.be.an.instanceOf(class)`.
 *
 * Work-around for Chai assertions not being recognized by TypeScript's control flow analysis.
 *
 * @param value - the value
 * @param className - the instance type
 */
export declare function assertIsInstanceOf<T, V extends unknown[]>(value: unknown, className: new (...args: V) => T): asserts value is T;
type Action = "after:browser:launch" | "after:run" | "after:screenshot" | "after:spec" | "before:browser:launch" | "before:run" | "before:spec" | "dev-server:start" | "file:preprocessor" | "task";
interface ActionCallbacks {
    ["after:browser:launch"]: (browser: Cypress.Browser, browserLaunchOptions: Cypress.AfterBrowserLaunchDetails) => Promise<Cypress.BeforeBrowserLaunchOptions>;
    ["after:run"]: (results: CypressFailedRunResultType | CypressRunResultType) => Promise<void>;
    ["after:screenshot"]: (details: Cypress.ScreenshotDetails) => Promise<Cypress.AfterScreenshotReturnObject>;
    ["after:spec"]: (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => Promise<void>;
    ["before:browser:launch"]: (browser: Cypress.Browser, browserLaunchOptions: Cypress.BeforeBrowserLaunchOptions) => Promise<Cypress.BeforeBrowserLaunchOptions>;
    ["before:run"]: (runDetails: Cypress.BeforeRunDetails) => Promise<void>;
    ["before:spec"]: (spec: Cypress.Spec) => Promise<void>;
    ["dev-server:start"]: (file: Cypress.DevServerConfig) => Promise<Cypress.ResolvedDevServerConfig>;
    ["file:preprocessor"]: (file: Cypress.FileObject) => Promise<string>;
    ["task"]: (tasks: Cypress.Tasks) => void;
}
export declare function mockedCypressEventEmitter<A extends Action>(expectedAction: A, ...args: Parameters<ActionCallbacks[A]>): Cypress.PluginEvents;
export {};
