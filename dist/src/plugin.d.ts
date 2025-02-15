import type { CypressXrayPluginOptions } from "./types/plugin";
/**
 * Resets the plugin including its context.
 */
export declare function resetPlugin(): void;
/**
 * Configures the plugin. The plugin will check all environment variables passed in
 * {@link Cypress.PluginConfigOptions.env | `config.env`} and merge them with those specified in
 * `options`. Environment variables always override values specified in `options`.
 *
 * *Note: This method will register upload hooks under the Cypress `before:run`, `after:run` and
 * `task` events. Consider using [`cypress-on-fix`](https://github.com/bahmutov/cypress-on-fix) if
 * you have these hooks registered to prevent the plugin from replacing them.*
 *
 * @param on - the Cypress event registration functon
 * @param config - the Cypress configuration
 * @param options - the plugin options
 *
 * @see https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/uploadTestResults/#setup
 */
export declare function configureXrayPlugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions, options: CypressXrayPluginOptions): Promise<void>;
/**
 * Attempts to synchronize the Cucumber feature file with Xray. If the filename does not end with
 * the configured {@link https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#featurefileextension | feature file extension},
 * this method will not upload anything to Xray.
 *
 * @param file - the Cypress file object
 * @returns the unmodified file's path
 */
export declare function syncFeatureFile(file: Cypress.FileObject): string;
