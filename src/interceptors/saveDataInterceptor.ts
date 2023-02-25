import Alexa = require("ask-sdk-core");
import {dbUtils} from "../utilities/dbUtils";

// Response Interceptors run after all skill handlers complete, before the response is
// sent to the Alexa servers.
export const SaveDataInterceptor = {
    async process(handlerInput: Alexa.HandlerInput) {
        let persistent = dbUtils.getPersistenceDataTemplate();

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        for (let key in persistent) {
			if (sessionAttributes.hasOwnProperty(key)) {
				persistent[key] = sessionAttributes[key];
			}
		}

		
        // set and then save the persistent attributes
        handlerInput.attributesManager.setPersistentAttributes(persistent);
        let waiter = await handlerInput.attributesManager.savePersistentAttributes();
    }
};