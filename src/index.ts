import Alexa = require("ask-sdk-core");

// Intents
import {LaunchRequestHandler} from "./intents/defaultIntents";
import {HelpIntentHandler} from "./intents/defaultIntents";
import {CancelAndStopIntentHandler} from "./intents/defaultIntents";
import {FallbackIntentHandler} from "./intents/defaultIntents";
import {SessionEndedRequestHandler} from "./intents/defaultIntents";
import {IntentReflectorHandler} from "./intents/defaultIntents";
import {IntentsAlessandro} from "./intents/IntentsAlessandro";
import {IntentsLorenzo} from "./intents/IntentsLorenzo";
import {SetSubscribeCourseIntentHandler} from "./intents/setSubscribeCourseIntentHandler";
import {GetSubscribeCourseIntentHandler} from "./intents/getSubscribeCourseIntentHandler";
import {RemoveSubscribeCourseIntentHandler} from "./intents/removeSubscribeCourseIntentHandler";

// Error handlers
import {ErrorHandler} from "./errors/baseErrorHandler";

// Interceptors
import {LoggingRequestInterceptor} from "./interceptors/loggingRequestInterceptor";
import {LoggingResponseInterceptor} from "./interceptors/loggingResponseInterceptor";
import {SaveDataInterceptor} from "./interceptors/saveDataInterceptor";
import {LoadDataInterceptor} from "./interceptors/loadDataInterceptor";

// Utilities
import {DbUtils} from "./utilities/dbUtils";
import {CustomLogger} from "./utilities/customLogger";
CustomLogger.info("Starting Purple Walrus handler");

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom().addRequestHandlers(
	IntentsAlessandro.HelloWorldIntentHandler,
	IntentsLorenzo.GetWeeklyScheduleIntentHander,
	RemoveSubscribeCourseIntentHandler,
	SetSubscribeCourseIntentHandler,
	GetSubscribeCourseIntentHandler,
	LaunchRequestHandler,
	HelpIntentHandler,
	CancelAndStopIntentHandler,
	FallbackIntentHandler,
	SessionEndedRequestHandler,
	IntentReflectorHandler
).addErrorHandlers(ErrorHandler).withPersistenceAdapter(DbUtils.getPersistenceAdapter()).addRequestInterceptors(
	LoadDataInterceptor,
	LoggingRequestInterceptor
).addResponseInterceptors(SaveDataInterceptor, LoggingResponseInterceptor).lambda();
