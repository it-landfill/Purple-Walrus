import Alexa = require("ask-sdk-core");
import {dbUtils} from "../utilities/dbUtils";

export const LoadDataInterceptor = {
	async process(handlerInput : Alexa.HandlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		// get persistent attributes, using await to ensure the data has been returned before continuing execution
		var persistent = await handlerInput.attributesManager.getPersistentAttributes();
		if (!persistent) 
			persistent = {};
		
		for (let key in dbUtils.getPersistenceDataTemplate()) {
			if (persistent.hasOwnProperty(key)) {
				sessionAttributes[key] = persistent[key];
			} else {
				sessionAttributes[key] = undefined;
			}
		}

		//set the session attributes so they're available to your handlers
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
	}
};
