/// <reference types="cypress" />

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { readFileSync } from "fs";
import {
    BasicAuthCredentials,
    PATCredentials,
} from "../../src/authentication/credentials";
import { XrayClientCloud } from "../../src/client/xray/xrayClientCloud";
import { XrayClientServer } from "../../src/client/xray/xrayClientServer";
import {
    ENV_JIRA_API_TOKEN,
    ENV_JIRA_PASSWORD,
    ENV_JIRA_PROJECT_KEY,
    ENV_JIRA_USERNAME,
    ENV_XRAY_CLIENT_ID,
    ENV_XRAY_CLIENT_SECRET,
} from "../../src/constants";
import { CONTEXT, initContext } from "../../src/context";
import { beforeRunHook } from "../../src/hooks";
import { stubLogInfo } from "../constants";
import { expectToExist } from "./helpers";

// Enable promise assertions.
chai.use(chaiAsPromised);

describe("the before run hook", () => {
    let details: Cypress.BeforeRunDetails = JSON.parse(
        readFileSync("./test/resources/beforeRun.json", "utf-8")
    );

    beforeEach(() => {
        initContext({
            jira: {
                projectKey: "CYP",
            },
            xray: {
                testType: "Manual",
            },
            cucumber: {
                featureFileExtension: ".feature",
            },
        });
        details = JSON.parse(
            readFileSync("./test/resources/beforeRun.json", "utf-8")
        );
        // Set up cloud credentials for convenience purposes.
        details.config.env = {};
        details.config.env[ENV_XRAY_CLIENT_ID] = "user";
        details.config.env[ENV_XRAY_CLIENT_SECRET] = "xyz";
    });

    it("should be able to detect cloud credentials", async () => {
        const stubbedInfo = stubLogInfo();
        await beforeRunHook(details);
        expect(CONTEXT.xrayClient).to.be.an.instanceof(XrayClientCloud);
        expect(stubbedInfo).to.have.been.calledWith(
            "Xray client ID and client secret found. Setting up Xray cloud credentials."
        );
    });

    it("should be able to detect basic server credentials", async () => {
        details.config.env = {};
        details.config.env[ENV_JIRA_USERNAME] = "user";
        details.config.env[ENV_JIRA_PASSWORD] = "xyz";
        CONTEXT.config.jira.url = "https://example.org";
        const stubbedInfo = stubLogInfo();
        await beforeRunHook(details);
        expect(CONTEXT.xrayClient).to.be.an.instanceof(XrayClientServer);
        expect(stubbedInfo).to.have.been.calledWith(
            "Jira username and password found. Setting up Xray basic auth credentials."
        );
    });

    it("should be able to detect PAT server credentials", async () => {
        details.config.env = {};
        details.config.env[ENV_JIRA_USERNAME] = "user";
        details.config.env[ENV_JIRA_API_TOKEN] = "1337";
        CONTEXT.config.jira.url = "https://example.org";
        const stubbedInfo = stubLogInfo();
        await beforeRunHook(details);
        expect(CONTEXT.xrayClient).to.be.an.instanceof(XrayClientServer);
        expect(stubbedInfo).to.have.been.calledWith(
            "Jira PAT found. Setting up Xray PAT credentials."
        );
    });

    it("should be able to choose cloud credentials over server credentials", async () => {
        details.config.env = {};
        details.config.env[ENV_JIRA_USERNAME] = "user";
        details.config.env[ENV_JIRA_PASSWORD] = "xyz";
        details.config.env[ENV_JIRA_API_TOKEN] = "1337";
        details.config.env[ENV_XRAY_CLIENT_ID] = "user";
        details.config.env[ENV_XRAY_CLIENT_SECRET] = "xyz";
        CONTEXT.config.jira.url = "https://example.org";
        const stubbedInfo = stubLogInfo();
        await beforeRunHook(details);
        expect(CONTEXT.xrayClient).to.be.an.instanceof(XrayClientCloud);
        expect(stubbedInfo).to.have.been.calledWith(
            "Xray client ID and client secret found. Setting up Xray cloud credentials."
        );
    });

    describe("the error handling", () => {
        beforeEach(() => {
            // We're not interested in informative log messages here.
            stubLogInfo();
        });

        it("should be able to detect unset project keys", async () => {
            expectToExist(details.config.env);
            details.config.env[ENV_JIRA_PROJECT_KEY] = undefined;
            await expect(beforeRunHook(details)).to.eventually.be.rejectedWith(
                "Xray plugin misconfiguration: Jira project key was not set"
            );
        });

        it("should be able to detect mismatched test execution issue keys", async () => {
            CONTEXT.config.jira.testExecutionIssueKey = "ABC-123";
            await expect(beforeRunHook(details)).to.eventually.be.rejectedWith(
                "Xray plugin misconfiguration: test execution issue key ABC-123 does not belong to project CYP"
            );
        });

        it("should be able to detect mismatched test plan issue keys", async () => {
            CONTEXT.config.jira.testPlanIssueKey = "ABC-456";
            await expect(beforeRunHook(details)).to.eventually.be.rejectedWith(
                "Xray plugin misconfiguration: test plan issue key ABC-456 does not belong to project CYP"
            );
        });

        it("should not allow step lengths of length zero", async () => {
            expectToExist(CONTEXT.config.xray);
            CONTEXT.config.xray.steps = {
                maxLengthAction: 0,
            };
            await expect(beforeRunHook(details)).to.eventually.be.rejectedWith(
                "Xray plugin misconfiguration: max length of step actions must be a positive number: 0"
            );
        });

        it("should not allow negative step action lengths", async () => {
            expectToExist(CONTEXT.config.xray);
            CONTEXT.config.xray.steps = {
                maxLengthAction: -5,
            };
            await expect(beforeRunHook(details)).to.eventually.be.rejectedWith(
                "Xray plugin misconfiguration: max length of step actions must be a positive number: -5"
            );
        });
    });

    describe("the Jira client instantiation", () => {
        beforeEach(() => {
            expectToExist(details.config.env);
            CONTEXT.config.jira.url = "https://example.org";
            // Make Jira client instantiation mandatory.
            CONTEXT.config.jira.attachVideos = true;
        });

        it("should be able to detect Jira cloud credentials", async () => {
            expectToExist(details.config.env);
            details.config.env[ENV_JIRA_USERNAME] = "user";
            details.config.env[ENV_JIRA_API_TOKEN] = "1337";
            const stubbedInfo = stubLogInfo();
            await beforeRunHook(details);
            expectToExist(CONTEXT.jiraClient);
            const credentials = CONTEXT.jiraClient.getCredentials();
            expect(credentials).to.be.an.instanceof(BasicAuthCredentials);
            expect(stubbedInfo).to.have.been.calledWith(
                "Jira username and API token found. Setting up basic auth credentials for Jira cloud."
            );
        });

        it("should be able to detect Jira server PAT credentials", async () => {
            expectToExist(details.config.env);
            details.config.env[ENV_JIRA_API_TOKEN] = "1337";
            const stubbedInfo = stubLogInfo();
            await beforeRunHook(details);
            expectToExist(CONTEXT.jiraClient);
            const credentials = CONTEXT.jiraClient.getCredentials();
            expect(credentials).to.be.an.instanceof(PATCredentials);
            expect(stubbedInfo).to.have.been.calledWith(
                "Jira PAT found. Setting up PAT credentials for Jira server."
            );
        });

        it("should be able to detect Jira server basic auth credentials", async () => {
            expectToExist(details.config.env);
            details.config.env[ENV_JIRA_USERNAME] = "user";
            details.config.env[ENV_JIRA_PASSWORD] = "1337";
            const stubbedInfo = stubLogInfo();
            await beforeRunHook(details);
            expectToExist(CONTEXT.jiraClient);
            const credentials = CONTEXT.jiraClient.getCredentials();
            expect(credentials).to.be.an.instanceof(BasicAuthCredentials);
            expect(stubbedInfo).to.have.been.calledWith(
                "Jira username and password found. Setting up basic auth credentials for Jira server."
            );
        });

        it("should be able to choose Jira cloud credentials over server credentials", async () => {
            expectToExist(details.config.env);
            details.config.env[ENV_JIRA_USERNAME] = "user";
            details.config.env[ENV_JIRA_API_TOKEN] = "1337";
            details.config.env[ENV_JIRA_PASSWORD] = "xyz";
            const stubbedInfo = stubLogInfo();
            await beforeRunHook(details);
            expectToExist(CONTEXT.jiraClient);
            const credentials = CONTEXT.jiraClient.getCredentials();
            expect(credentials).to.be.an.instanceof(BasicAuthCredentials);
            expect(stubbedInfo).to.have.been.calledWith(
                "Jira username and API token found. Setting up basic auth credentials for Jira cloud."
            );
        });

        describe("the error handling", () => {
            beforeEach(() => {
                // We're not interested in informative log messages here.
                stubLogInfo();
            });

            it("should throw an error for missing Jira URLs", async () => {
                CONTEXT.config.jira.url = undefined;
                await expect(
                    beforeRunHook(details)
                ).to.eventually.be.rejectedWith(
                    "Failed to configure Jira client: no Jira URL was provided. Configured options which necessarily require a configured Jira client:\n[\n\tjira.attachVideos = true\n]"
                );
            });

            it("should throw an error for missing Jira credentials", async () => {
                await expect(
                    beforeRunHook(details)
                ).to.eventually.be.rejectedWith(
                    "Failed to configure Jira client: no viable authentication method was configured.\nYou can find all configurations currently supported at https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/authentication/"
                );
            });
        });
    });
});
