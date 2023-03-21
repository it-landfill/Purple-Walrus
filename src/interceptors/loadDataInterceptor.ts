import Alexa = require("ask-sdk-core");
import {DbUtils} from "../utilities/dbUtils";
import {CustomLogger} from "../utilities/customLogger";

export const LoadDataInterceptor = {
	async process(handlerInput : Alexa.HandlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		// get persistent attributes, using await to ensure the data has been returned before continuing execution
		var persistent = await handlerInput.attributesManager.getPersistentAttributes();
		if (!persistent) 
			persistent = {};
		
		for (let key in DbUtils.getPersistenceDataTemplate()) {
			if (persistent.hasOwnProperty(key)) {
				sessionAttributes[key] = persistent[key];
			} else {
				sessionAttributes[key] = undefined;
				CustomLogger.verbose("Persistent attributes does not contain " + key + ". Setting to undefined");
			}
			CustomLogger.log("Adding " + key + " to session attributes with value " + sessionAttributes[key]);
		}

		//set the session attributes so they're available to your handlers
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
	}
};
