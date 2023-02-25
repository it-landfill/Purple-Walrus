"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingRequestInterceptor = void 0;
const customLogger_1 = require("../utilities/customLogger");
// This request interceptor will log all incoming requests of this lambda
exports.LoggingRequestInterceptor = {
    process(handlerInput) {
        customLogger_1.CustomLogger.verbose('----- REQUEST -----\n' + JSON.stringify(handlerInput.requestEnvelope, null, 2));
    }
};
