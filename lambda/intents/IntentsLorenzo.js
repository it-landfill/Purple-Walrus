"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentsLorenzo = void 0;
const Alexa = require("ask-sdk-core");
var IntentsLorenzo;
(function (IntentsLorenzo) {
    IntentsLorenzo.HelloWorldIntentHandler = {
        canHandle(handlerInput) {
            return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "GetSubscribeCourseIntent");
        },
        async handle(handlerInput) {
            const attributesManager = handlerInput.attributesManager;
            let attributes = { "counter": 10 };
            attributesManager.setPersistentAttributes(attributes);
            await attributesManager.savePersistentAttributes();
            const speakOutput = "Hello World!";
            return (handlerInput.responseBuilder.speak(speakOutput)
                //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse());
        }
    };
    // Lambda function to handle the intent GetSubscribeCourseIntent.
    // This intent is used to subscribe a user to a course (e.g. "Iscrivimi al corso di Internet of Things.")
    IntentsLorenzo.SetSubscribeCourseIntentHandler = {
        canHandle(handlerInput) {
            return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "SetSubscribeCourseIntent");
        },
        async handle(handlerInput) {
            // Get the course name from the intent slot.
            const courseName = Alexa.getSlotValue(handlerInput.requestEnvelope, "courseName");
            // Get the user id from the request.
            const userId = Alexa.getUserId(handlerInput.requestEnvelope);
            // Speak output the course name and the user id.
            const speakOutput = `L'utente ${userId} è stato registrato con successo al corso ${courseName}.`;
            // Return the response.
            return (handlerInput.responseBuilder.speak(speakOutput).getResponse());
        }
    };
})(IntentsLorenzo = exports.IntentsLorenzo || (exports.IntentsLorenzo = {}));
