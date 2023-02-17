"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentsAlessandro = void 0;
const Alexa = require("ask-sdk-core");
const AWS = require("aws-sdk");
var IntentsAlessandro;
(function (IntentsAlessandro) {
    IntentsAlessandro.HelloWorldIntentHandler = {
        canHandle(handlerInput) {
            return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "NextClassIntent");
        },
        handle(handlerInput) {
            const speakOutput = "Hello World!";
            const region = process.env.DYNAMODB_PERSISTENCE_REGION || "eu-west-1";
            const client = new AWS.DynamoDB({ region });
            console.warn("AJEJEJ");
            client.listTables({}, (err, data) => {
                if (err)
                    console.warn(err, err.stack);
                else
                    console.warn(data);
            });
            console.warn("BJEJEJ");
            return (handlerInput.responseBuilder.speak(speakOutput)
                //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse());
        }
    };
})(IntentsAlessandro = exports.IntentsAlessandro || (exports.IntentsAlessandro = {}));
