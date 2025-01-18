"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOCAL_SERVER = void 0;
exports.startServer = startServer;
exports.stopServer = stopServer;
const http_1 = __importDefault(require("http"));
const SERVER = http_1.default.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Expose-Headers", "X-Response-Time");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("X-Response-Time", Date.now());
    res.end("<html>Hello World</html>");
});
function startServer() {
    SERVER.listen(exports.LOCAL_SERVER.port, () => {
        console.log(`Local server running at http://localhost:${exports.LOCAL_SERVER.port.toString()}/`);
    });
}
function stopServer() {
    SERVER.close();
}
exports.LOCAL_SERVER = {
    hostname: "localhost",
    port: 8080,
    url: "localhost:8080",
};
