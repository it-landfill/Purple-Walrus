"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadDataInterceptor = void 0;
const dbUtils_1 = require("../utilities/dbUtils");
const customLogger_1 = require("../utilities/customLogger");
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
                customLogger_1.CustomLogger.verbose("Persistent attributes does not contain " + key + ". Setting to undefined");
            }
            customLogger_1.CustomLogger.log("Adding " + key + " to session attributes with value " + sessionAttributes[key]);
        }
        //set the session attributes so they're available to your handlers
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }
};
