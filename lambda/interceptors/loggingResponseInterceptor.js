"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingResponseInterceptor = void 0;
const customLogger_1 = require("../utilities/customLogger");
// This response interceptor will log all outgoing responses of this lambda
exports.LoggingResponseInterceptor = {
    process(handlerInput, response) {
        customLogger_1.CustomLogger.verbose('----- RESPONSE -----\n' + JSON.stringify(response, null, 2));
    }
};
