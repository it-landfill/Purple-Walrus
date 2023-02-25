"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadDataInterceptor = void 0;
const dbUtils_1 = require("../utilities/dbUtils");
exports.LoadDataInterceptor = {
    async process(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        // get persistent attributes, using await to ensure the data has been returned before continuing execution
        var persistent = await handlerInput.attributesManager.getPersistentAttributes();
        if (!persistent)
            persistent = {};
        for (let key in dbUtils_1.dbUtils.getPersistenceDataTemplate()) {
            if (persistent.hasOwnProperty(key)) {
                sessionAttributes[key] = persistent[key];
            }
            else {
                sessionAttributes[key] = undefined;
            }
        }
        //set the session attributes so they're available to your handlers
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }
};
