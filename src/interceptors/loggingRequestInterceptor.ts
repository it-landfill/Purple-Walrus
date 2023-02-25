import Alexa = require("ask-sdk-core");

// This request interceptor will log all incoming requests of this lambda
export const LoggingRequestInterceptor = {
    process(handlerInput: Alexa.HandlerInput) {
        console.log('----- REQUEST -----');
        console.log(JSON.stringify(handlerInput.requestEnvelope, null, 2));
    }
};