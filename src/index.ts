import Alexa = require("ask-sdk-core");

import { LaunchRequestHandler } from "./intents/defaultIntents";
import { HelpIntentHandler } from "./intents/defaultIntents";
import { CancelAndStopIntentHandler } from "./intents/defaultIntents";
import { FallbackIntentHandler } from "./intents/defaultIntents";
import { SessionEndedRequestHandler } from "./intents/defaultIntents";
import { IntentReflectorHandler } from "./intents/defaultIntents";

import { ErrorHandler } from "./errors/baseErrorHandler";

import { IntentsAlessandro } from "./intents/IntentsAlessandro";
import { IntentsLorenzo } from "./intents/IntentsLorenzo";

const AWS = require("aws-sdk");
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        IntentsAlessandro.HelloWorldIntentHandler,
        IntentsLorenzo.HelloWorldIntentHandler,
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler, IntentReflectorHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withPersistenceAdapter(
        new ddbAdapter.DynamoDbPersistenceAdapter({
            tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME,
            createTable: false,
            dynamoDBClient: new AWS.DynamoDB({ apiVersion: 'latest', region: process.env.DYNAMODB_PERSISTENCE_REGION })
        })
    )
    .lambda();