import Alexa = require("ask-sdk-core");
import { CustomLogger } from "../utilities/customLogger";

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
export const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput : Alexa.HandlerInput, error : any) {
		const speakOutput = "Sorry, I had trouble doing what you asked. Please try again.";
		CustomLogger.error(`~~~~ Error handled: ${error}`);
		
		return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
	}
};
