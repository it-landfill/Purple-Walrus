import Alexa = require("ask-sdk-core");

import {LaunchRequestHandler} from "./intents/defaultIntents";
import {HelloWorldIntentHandler} from "./intents/defaultIntents";
import {HelpIntentHandler} from "./intents/defaultIntents";
import {CancelAndStopIntentHandler} from "./intents/defaultIntents";
import {FallbackIntentHandler} from "./intents/defaultIntents";
import {SessionEndedRequestHandler} from "./intents/defaultIntents";
import {IntentReflectorHandler} from "./intents/defaultIntents";

import {ErrorHandler} from "./errors/baseErrorHandler";

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom().addRequestHandlers(LaunchRequestHandler, HelloWorldIntentHandler, HelpIntentHandler, CancelAndStopIntentHandler, FallbackIntentHandler, SessionEndedRequestHandler, IntentReflectorHandler).addErrorHandlers(ErrorHandler).lambda();
