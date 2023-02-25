import Alexa = require("ask-sdk-core");

// Response Interceptors run after all skill handlers complete, before the response is
// sent to the Alexa servers.
export const SaveDataInterceptor = {
    async process(handlerInput: Alexa.HandlerInput) {
        const persistent = {};
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		//TODO: Save here the data
        // save (or not) the past_celebs & visits
        // persistent.past_celebs = (celeb_tracking) ? sessionAttributes.past_celebs : [];
        // persistent.visits = sessionAttributes.visits;

		
        // set and then save the persistent attributes
        handlerInput.attributesManager.setPersistentAttributes(persistent);
        let waiter = await handlerInput.attributesManager.savePersistentAttributes();
    }
};