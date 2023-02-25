"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveDataInterceptor = void 0;
// Response Interceptors run after all skill handlers complete, before the response is
// sent to the Alexa servers.
exports.SaveDataInterceptor = {
    async process(handlerInput) {
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
