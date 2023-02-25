"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingRequestInterceptor = void 0;
// This request interceptor will log all incoming requests of this lambda
exports.LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log('----- REQUEST -----');
        console.log(JSON.stringify(handlerInput.requestEnvelope, null, 2));
    }
};
