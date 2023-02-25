"use strict";
// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log('----- RESPONSE -----');
        console.log(JSON.stringify(response, null, 2));
    }
};
