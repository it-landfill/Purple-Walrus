"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentsLorenzo = void 0;
const Alexa = require("ask-sdk-core");
const slotUtils_1 = require("../utilities/slotUtils");
var IntentsLorenzo;
(function (IntentsLorenzo) {
    IntentsLorenzo.HelloWorldIntentHandler = {
        canHandle(handlerInput) {
            return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "GetSubscribeCourseIntent");
        },
        async handle(handlerInput) {
            const attributesManager = handlerInput.attributesManager;
            let attributes = {
                counter: 10
            };
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
        handle(handlerInput) {
            // Get the course name from the slot.
            const course = slotUtils_1.slotUtils.getSlotValue(handlerInput, "courseName");
            if (course === undefined)
                return handlerInput.responseBuilder.speak("Non ho capito il nome del corso.").reprompt('Riprova verificando che il corso che cerchi sia valido.').getResponse();
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            if (sessionAttributes.materie === undefined)
                sessionAttributes.materie = [];
            if (sessionAttributes.materie.indexOf(course.name) === -1)
                sessionAttributes.materie.push(course.name);
            else
                return handlerInput.responseBuilder.speak(`Sei già iscritto al corso di ${course.name}.`).reprompt('Posso fare altro per te?').getResponse();
            // Speak output the course name and the user id.
            const speakOutput = `Sei stato registrato con successo al corso ${course.name}.`;
            // Return the response.
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('La skill è in ascolto.')
                .getResponse();
        }
    };
})(IntentsLorenzo = exports.IntentsLorenzo || (exports.IntentsLorenzo = {}));
