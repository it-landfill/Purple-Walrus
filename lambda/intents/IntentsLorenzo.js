"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentsLorenzo = void 0;
const Alexa = require("ask-sdk-core");
const slotUtils_1 = require("../utilities/slotUtils");
var IntentsLorenzo;
(function (IntentsLorenzo) {
    IntentsLorenzo.HelloWorldIntentHandler = {
        canHandle(handlerInput) {
            return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "Adefgh";
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
                // .reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse());
        }
    };
    IntentsLorenzo.RemoveSubscribeCourseIntentHandler = {
        canHandle(handlerInput) {
            return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "RemoveSubscribeCourseIntent");
        },
        handle(handlerInput) {
            // Get the course name from the slot.
            const course = slotUtils_1.slotUtils.getSlotValue(handlerInput, "courseName");
            // If the course name is not valid, return an error.
            if (course === undefined)
                return handlerInput.responseBuilder.speak("Non ho capito il nome del corso.").reprompt("Riprova verificando che il corso che cerchi sia valido.").getResponse();
            // Set session attributes to store the course name subscribed by the user.
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            if (sessionAttributes.materie === undefined)
                return handlerInput.responseBuilder.speak("Non sei iscritto a nessun corso.").reprompt("Prima di disiscriverti devi iscriverti ad un corso.").getResponse();
            // Remove the course from the list of subscribed courses.
            const index = sessionAttributes.materie.indexOf(course.name);
            if (index === -1)
                return handlerInput.responseBuilder.speak(`Non sei iscritto al corso di ${course.name}.`).reprompt("Posso fare altro per te?").getResponse();
            else
                sessionAttributes.materie.splice(index, 1);
            // If the user is not subscribed to any course, remove the attribute.
            if (sessionAttributes.materie.length === 0)
                delete sessionAttributes.materie;
            // Speak output the course name.
            const speakOutput = `Sei stato disiscritto con successo al corso ${course.name}.`;
            // Return the response.
            return handlerInput.responseBuilder.speak(speakOutput).reprompt("La skill è in ascolto.").getResponse();
        }
    };
})(IntentsLorenzo = exports.IntentsLorenzo || (exports.IntentsLorenzo = {}));
