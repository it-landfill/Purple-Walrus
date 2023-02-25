"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveDataInterceptor = void 0;
const dbUtils_1 = require("../utilities/dbUtils");
// Response Interceptors run after all skill handlers complete, before the response is
// sent to the Alexa servers.
exports.SaveDataInterceptor = {
    async process(handlerInput) {
        let persistent = dbUtils_1.dbUtils.getPersistenceDataTemplate();
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
