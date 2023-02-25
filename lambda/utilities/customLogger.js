"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
var CustomLogger;
(function (CustomLogger) {
    function info(msg) {
        console.log("\x1B[90m[PW]\x1B[1;32m[INFO]\x1B[0m\t" + msg);
    }
    CustomLogger.info = info;
    function error(msg) {
        console.error("\x1B[90m[PW]\x1B[1;31m[ERROR]\x1B[0m\t" + msg);
    }
    CustomLogger.error = error;
    function warn(msg) {
        console.warn("\x1B[90m[PW]\x1B[1;33m[WARN]\x1B[0m\t" + msg);
    }
    CustomLogger.warn = warn;
    function log(msg) {
        console.log("\x1B[90m[PW]\x1B[1;36m[DEBUG]\x1B[0m\t" + msg);
    }
    CustomLogger.log = log;
    function verbose(msg) {
        console.log("\x1B[90m[PW]\x1B[1;34m[VERBOSE]\x1B[0m\t" + msg);
    }
    CustomLogger.verbose = verbose;
})(CustomLogger = exports.CustomLogger || (exports.CustomLogger = {}));
