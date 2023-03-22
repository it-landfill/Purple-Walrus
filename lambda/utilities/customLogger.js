"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
var CustomLogger;
(function (CustomLogger) {
    const localhost = process.env.DYNAMODB_LOCAL === "true";
    function toString(msg) {
        switch (typeof msg) {
            case "string":
                return msg;
            case "number":
            case "boolean":
                return msg.toString();
            case "object":
                return JSON.stringify(msg);
            default:
                console.warn("Unable to convert to string type: " + typeof msg + ". Trying to log " + msg);
                return "?_?";
        }
    }
    function logToFile(msg) {
        const fs = require("fs");
        const path = require("path");
        const logPath = path.join(__dirname, "..", "..", "logs");
        if (!fs.existsSync(logPath)) {
            fs.mkdirSync(logPath);
        }
        fs.appendFileSync(path.join(logPath, new Date().toISOString().split("T")[0] + "_purple-walrus.log"), msg);
    }
    function info(msg) {
        console.log("\x1B[90m[PW]\x1B[1;32m[INFO]\x1B[0m\t" + toString(msg));
        if (localhost) {
            logToFile("[PW][INFO]\t" + toString(msg) + "\n");
        }
    }
    CustomLogger.info = info;
    function error(msg) {
        console.error("\x1B[90m[PW]\x1B[1;31m[ERROR]\x1B[0m\t" + toString(msg));
        if (localhost) {
            logToFile("[PW][ERROR]\t" + toString(msg) + "\n");
        }
    }
    CustomLogger.error = error;
    function warn(msg) {
        ;
        console.warn("\x1B[90m[PW]\x1B[1;33m[WARN]\x1B[0m\t" + toString(msg));
        if (localhost) {
            logToFile("[PW][WARN]\t" + toString(msg) + "\n");
        }
    }
    CustomLogger.warn = warn;
    function log(msg) {
        console.log("\x1B[90m[PW]\x1B[1;36m[DEBUG]\x1B[0m\t" + toString(msg));
        if (localhost) {
            logToFile("[PW][DEBUG]\t" + toString(msg) + "\n");
        }
    }
    CustomLogger.log = log;
    function verbose(msg) {
        console.log("\x1B[90m[PW]\x1B[1;34m[VERBOSE]\t" + toString(msg) + "\x1B[0m");
        if (localhost) {
            logToFile("[PW][VERBOSE]\t" + toString(msg) + "\n");
        }
    }
    CustomLogger.verbose = verbose;
})(CustomLogger = exports.CustomLogger || (exports.CustomLogger = {}));
