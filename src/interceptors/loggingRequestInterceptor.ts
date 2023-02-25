import Alexa = require("ask-sdk-core");
import {CustomLogger} from "../utilities/customLogger";

// This request interceptor will log all incoming requests of this lambda
export const LoggingRequestInterceptor = {
    process(handlerInput: Alexa.HandlerInput) {
        CustomLogger.verbose('----- REQUEST -----\n' + JSON.stringify(handlerInput.requestEnvelope, null, 2));
    }
};