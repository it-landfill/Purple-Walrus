"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("ask-sdk-core");
const defaultIntents_1 = require("./intents/defaultIntents");
const defaultIntents_2 = require("./intents/defaultIntents");
const defaultIntents_3 = require("./intents/defaultIntents");
const defaultIntents_4 = require("./intents/defaultIntents");
const defaultIntents_5 = require("./intents/defaultIntents");
const defaultIntents_6 = require("./intents/defaultIntents");
const defaultIntents_7 = require("./intents/defaultIntents");
const baseErrorHandler_1 = require("./errors/baseErrorHandler");
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom().addRequestHandlers(defaultIntents_1.LaunchRequestHandler, defaultIntents_2.HelloWorldIntentHandler, defaultIntents_3.HelpIntentHandler, defaultIntents_4.CancelAndStopIntentHandler, defaultIntents_5.FallbackIntentHandler, defaultIntents_6.SessionEndedRequestHandler, defaultIntents_7.IntentReflectorHandler).addErrorHandlers(baseErrorHandler_1.ErrorHandler).lambda();
