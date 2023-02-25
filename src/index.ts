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
import {SetSubscribeCourseIntentHandler} from "./intents/SetSubscribeCourseIntentHandler";
import {GetSubscribeCourseIntentHandler} from "./intents/GetSubscribeCourseIntentHandler";

// Error handlers
import {ErrorHandler} from "./errors/baseErrorHandler";

// Interceptors
import {LoggingRequestInterceptor} from "./interceptors/loggingRequestInterceptor";
import {LoggingResponseInterceptor} from "./interceptors/loggingResponseInterceptor";
import {SaveDataInterceptor} from "./interceptors/saveDataInterceptor";
import {LoadDataInterceptor} from "./interceptors/loadDataInterceptor";

// Utilities
import {dbUtils} from "./utilities/dbUtils";

var local = process.env.DYNAMODB_LOCAL;
let persistenceAdapter: Alexa.PersistenceAdapter;
if (local === "true") {
	let options = {
		port: 8000
	};
	let dynamoDBClient = dbUtils.getLocalDynamoDBClient(options);
	persistenceAdapter = dbUtils.getPersistenceAdapter("PurpleWalrus", true, dynamoDBClient);
} else {
	persistenceAdapter = dbUtils.getPersistenceAdapter("PurpleWalrus", true);
}

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom().addRequestHandlers(
	IntentsAlessandro.HelloWorldIntentHandler,
	IntentsLorenzo.HelloWorldIntentHandler,
	SetSubscribeCourseIntentHandler,
	GetSubscribeCourseIntentHandler,
	LaunchRequestHandler,
	HelpIntentHandler,
	CancelAndStopIntentHandler,
	FallbackIntentHandler,
	SessionEndedRequestHandler,
	IntentReflectorHandler
).addErrorHandlers(ErrorHandler).withPersistenceAdapter(persistenceAdapter).addRequestInterceptors(LoadDataInterceptor, LoggingRequestInterceptor).addResponseInterceptors(
	SaveDataInterceptor,
	LoggingResponseInterceptor
).lambda();
