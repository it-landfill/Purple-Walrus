import Alexa = require("ask-sdk-core");
// This response interceptor will log all outgoing responses of this lambda
export const LoggingResponseInterceptor = {
    process(handlerInput: Alexa.HandlerInput, response: any) {
        console.log('----- RESPONSE -----');
        console.log(JSON.stringify(response, null, 2));
    }
};