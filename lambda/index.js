"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("ask-sdk-core");
// Intents
const defaultIntents_1 = require("./intents/defaultIntents");
const defaultIntents_2 = require("./intents/defaultIntents");
const defaultIntents_3 = require("./intents/defaultIntents");
const defaultIntents_4 = require("./intents/defaultIntents");
const defaultIntents_5 = require("./intents/defaultIntents");
const defaultIntents_6 = require("./intents/defaultIntents");
const IntentsAlessandro_1 = require("./intents/IntentsAlessandro");
const IntentsLorenzo_1 = require("./intents/IntentsLorenzo");
const setSubscribeCourseIntentHandler_1 = require("./intents/setSubscribeCourseIntentHandler");
const getSubscribeCourseIntentHandler_1 = require("./intents/getSubscribeCourseIntentHandler");
// Error handlers
const baseErrorHandler_1 = require("./errors/baseErrorHandler");
// Interceptors
const loggingRequestInterceptor_1 = require("./interceptors/loggingRequestInterceptor");
const loggingResponseInterceptor_1 = require("./interceptors/loggingResponseInterceptor");
const saveDataInterceptor_1 = require("./interceptors/saveDataInterceptor");
const loadDataInterceptor_1 = require("./interceptors/loadDataInterceptor");
// Utilities
const dbUtils_1 = require("./utilities/dbUtils");
var local = process.env.DYNAMODB_LOCAL;
let persistenceAdapter;
if (local === "true") {
    let options = {
        port: 8000
    };
    let dynamoDBClient = dbUtils_1.dbUtils.getLocalDynamoDBClient(options);
    persistenceAdapter = dbUtils_1.dbUtils.getPersistenceAdapter("PurpleWalrus", true, dynamoDBClient);
}
else {
    persistenceAdapter = dbUtils_1.dbUtils.getPersistenceAdapter("PurpleWalrus", true);
}
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom().addRequestHandlers(IntentsAlessandro_1.IntentsAlessandro.HelloWorldIntentHandler, IntentsLorenzo_1.IntentsLorenzo.RemoveSubscribeCourseIntentHandler, setSubscribeCourseIntentHandler_1.SetSubscribeCourseIntentHandler, getSubscribeCourseIntentHandler_1.GetSubscribeCourseIntentHandler, defaultIntents_1.LaunchRequestHandler, defaultIntents_2.HelpIntentHandler, defaultIntents_3.CancelAndStopIntentHandler, defaultIntents_4.FallbackIntentHandler, defaultIntents_5.SessionEndedRequestHandler, defaultIntents_6.IntentReflectorHandler).addErrorHandlers(baseErrorHandler_1.ErrorHandler).withPersistenceAdapter(persistenceAdapter).addRequestInterceptors(loadDataInterceptor_1.LoadDataInterceptor, loggingRequestInterceptor_1.LoggingRequestInterceptor).addResponseInterceptors(saveDataInterceptor_1.SaveDataInterceptor, loggingResponseInterceptor_1.LoggingResponseInterceptor).lambda();
