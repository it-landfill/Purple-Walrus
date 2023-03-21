import Alexa = require("ask-sdk-core");
import {DbUtils} from "../utilities/dbUtils";
import {CustomLogger} from "../utilities/customLogger";

// Response Interceptors run after all skill handlers complete, before the response is
// sent to the Alexa servers.
export const SaveDataInterceptor = {
    async process(handlerInput: Alexa.HandlerInput) {
        let persistent = DbUtils.getPersistenceDataTemplate();

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        for (let key in persistent) {
			if (sessionAttributes.hasOwnProperty(key)) {
				persistent[key] = sessionAttributes[key];
				CustomLogger.log("Saving " + key + " to persistent attributes with value " + persistent[key]);
			} else {
				CustomLogger.verbose("Session attributes does not contain " + key);
			}
		}

		
        // set and then save the persistent attributes
        handlerInput.attributesManager.setPersistentAttributes(persistent);
        let waiter = await handlerInput.attributesManager.savePersistentAttributes();
    }
};