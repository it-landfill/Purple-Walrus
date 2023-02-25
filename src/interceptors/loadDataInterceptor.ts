import Alexa = require("ask-sdk-core");

export const LoadDataInterceptor = {
    async process(handlerInput: Alexa.HandlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        // get persistent attributes, using await to ensure the data has been returned before
        // continuing execution
        var persistent = await handlerInput.attributesManager.getPersistentAttributes();
        if(!persistent) persistent = {};

		// TODO: Load and initialize here the data
        // ensure important variables are initialized so they're used more easily in handlers.
        // This makes sure they're ready to go and makes the handler code a little more readable
        // if(!sessionAttributes.hasOwnProperty('current_celeb')) sessionAttributes.current_celeb = null;  
        // if(!sessionAttributes.hasOwnProperty('score')) sessionAttributes.score = 0;
        // if(!persistent.hasOwnProperty('past_celebs')) persistent.past_celebs = [];  
        // if(!sessionAttributes.hasOwnProperty('past_celebs')) sessionAttributes.past_celebs = [];  

        // // if you're tracking past_celebs between sessions, use the persistent value
        // // set the visits value (either 0 for new, or the persistent value)
        // sessionAttributes.past_celebs = (celeb_tracking) ? persistent.past_celebs : sessionAttributes.past_celebs;
        // sessionAttributes.visits = (persistent.hasOwnProperty('visits')) ? persistent.visits : 0;

        //set the session attributes so they're available to your handlers
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }
};