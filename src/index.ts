import Alexa = require("ask-sdk-core");

import {LaunchRequestHandler} from "./intents/defaultIntents";
import {HelpIntentHandler} from "./intents/defaultIntents";
import {CancelAndStopIntentHandler} from "./intents/defaultIntents";
import {FallbackIntentHandler} from "./intents/defaultIntents";
import {SessionEndedRequestHandler} from "./intents/defaultIntents";
import {IntentReflectorHandler} from "./intents/defaultIntents";

import {ErrorHandler} from "./errors/baseErrorHandler";

import {IntentsAlessandro} from "./intents/IntentsAlessandro";
import {IntentsLorenzo} from "./intents/IntentsLorenzo";
import {util} from "./utilities/util";
import {LocalisationRequestInterceptor} from "./interceptors/localisationRequestInterceptor";
import {SaveAttributesResponseInterceptor} from "./interceptors/saveAttributesResponseInterceptor";

var local = process.env.DYNAMODB_LOCAL;
let persistenceAdapter: Alexa.PersistenceAdapter;
if (local === "true") {
	let options = {
		port: 3001
	};
	let dynamoDBClient = util.getLocalDynamoDBClient(options);
	persistenceAdapter = util.getPersistenceAdapter("exampleTable", true, dynamoDBClient);
} else {
	persistenceAdapter = util.getPersistenceAdapter("exampleTable", true);
}

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom().addRequestHandlers(
	IntentsAlessandro.HelloWorldIntentHandler,
	IntentsLorenzo.SetSubscribeCourseIntentHandler,
	LaunchRequestHandler,
	HelpIntentHandler,
	CancelAndStopIntentHandler,
	FallbackIntentHandler,
	SessionEndedRequestHandler,
	IntentReflectorHandler
).addErrorHandlers(ErrorHandler).withPersistenceAdapter(persistenceAdapter).addRequestInterceptors(LocalisationRequestInterceptor).addResponseInterceptors(
	SaveAttributesResponseInterceptor
).lambda();
