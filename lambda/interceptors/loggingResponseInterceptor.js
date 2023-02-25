"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingResponseInterceptor = void 0;
// This response interceptor will log all outgoing responses of this lambda
exports.LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log('----- RESPONSE -----');
        console.log(JSON.stringify(response, null, 2));
    }
};
