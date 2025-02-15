"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
/**
 * A basic client interface which stores credentials data used for communicating with a server.
 */
class Client {
    /**
     * Construct a new client using the provided credentials.
     *
     * @param apiBaseUrl - the base URL for all HTTP requests
     * @param credentials - the credentials to use during authentication
     * @param httpClient - the HTTP client to use for dispatching requests
     */
    constructor(apiBaseUrl, credentials, httpClient) {
        this.apiBaseUrl = apiBaseUrl;
        this.credentials = credentials;
        this.httpClient = httpClient;
    }
    /**
     * Return the client's credentials;
     *
     * @returns the credentials
     */
    getCredentials() {
        return this.credentials;
    }
}
exports.Client = Client;
