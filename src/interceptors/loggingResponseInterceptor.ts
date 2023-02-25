import Alexa = require("ask-sdk-core");
import {CustomLogger} from "../utilities/customLogger";

// This response interceptor will log all outgoing responses of this lambda
export const LoggingResponseInterceptor = {
    process(handlerInput: Alexa.HandlerInput, response: any) {
        CustomLogger.verbose('----- RESPONSE -----\n' + JSON.stringify(response, null, 2));
    }
};