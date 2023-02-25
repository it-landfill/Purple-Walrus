"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("ask-sdk-core");
const defaultIntents_1 = require("./intents/defaultIntents");
const defaultIntents_2 = require("./intents/defaultIntents");
const defaultIntents_3 = require("./intents/defaultIntents");
const defaultIntents_4 = require("./intents/defaultIntents");
const defaultIntents_5 = require("./intents/defaultIntents");
const defaultIntents_6 = require("./intents/defaultIntents");
const baseErrorHandler_1 = require("./errors/baseErrorHandler");
const IntentsAlessandro_1 = require("./intents/IntentsAlessandro");
const IntentsLorenzo_1 = require("./intents/IntentsLorenzo");
const util_1 = require("./utilities/util");
const localisationRequestInterceptor_1 = require("./interceptors/localisationRequestInterceptor");
const saveAttributesResponseInterceptor_1 = require("./interceptors/saveAttributesResponseInterceptor");
var local = process.env.DYNAMODB_LOCAL;
let persistenceAdapter;
if (local === "true") {
    let options = {
        port: 3001
    };
    let dynamoDBClient = util_1.util.getLocalDynamoDBClient(options);
    persistenceAdapter = util_1.util.getPersistenceAdapter("exampleTable", true, dynamoDBClient);
}
else {
    persistenceAdapter = util_1.util.getPersistenceAdapter("exampleTable", true);
}
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom().addRequestHandlers(IntentsAlessandro_1.IntentsAlessandro.HelloWorldIntentHandler, IntentsLorenzo_1.IntentsLorenzo.SetSubscribeCourseIntentHandler, defaultIntents_1.LaunchRequestHandler, defaultIntents_2.HelpIntentHandler, defaultIntents_3.CancelAndStopIntentHandler, defaultIntents_4.FallbackIntentHandler, defaultIntents_5.SessionEndedRequestHandler, defaultIntents_6.IntentReflectorHandler).addErrorHandlers(baseErrorHandler_1.ErrorHandler).withPersistenceAdapter(persistenceAdapter).addRequestInterceptors(localisationRequestInterceptor_1.LocalisationRequestInterceptor).addResponseInterceptors(saveAttributesResponseInterceptor_1.SaveAttributesResponseInterceptor).lambda();
