"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveSubscribeCourseIntentHandler = void 0;
const Alexa = require("ask-sdk-core");
const slotUtils_1 = require("../utilities/slotUtils");
// Lambda function to handle the intent RemoveSubscribeCourseIntent. This intent is used to unsubscribe a user to a course (e.g. "Togli il corso di
// Internet of Things dai miei corsi.")
exports.RemoveSubscribeCourseIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "RemoveSubscribeCourseIntent");
    },
    handle(handlerInput) {
        // Get the course name from the slot.
        const courses = slotUtils_1.SlotUtils.getSlotValue(handlerInput, "courseName");
        // If the course name is not valid, return an error.
        if (courses === undefined || courses.length === 0)
            return handlerInput.responseBuilder.speak("Non ho capito il nome del corso.").reprompt("Riprova verificando che il corso che cerchi sia valido.").getResponse();
        // Get the first course from the list since this is most likely the correct one.
        const course = courses[0];
        // Set session attributes to store the course name subscribed by the user.
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if (sessionAttributes.materie === undefined)
            return handlerInput.responseBuilder.speak("Non sei iscritto a nessun corso.").reprompt("Prima di disiscriverti devi iscriverti ad un corso.").getResponse();
        // Remove the course from the list of subscribed courses.
        const index = sessionAttributes.materie.indexOf(course.id);
        if (index === -1)
            return handlerInput.responseBuilder.speak(`Non sei iscritto al corso di ${course.name}.`).reprompt("Posso fare altro per te?").getResponse();
        else
            sessionAttributes.materie.splice(index, 1);
        // If the user is not subscribed to any course, remove the attribute.
        if (sessionAttributes.materie.length === 0)
            delete sessionAttributes.materie;
        // Speak output the course name.
        const speakOutput = `Sei stato disiscritto con successo al corso ${course.name}. Posso fare altro per te?`;
        // Return the response.
        return handlerInput.responseBuilder.speak(speakOutput).reprompt("La skill è in ascolto.").getResponse();
    }
};
