"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubscribeCourseIntentHandler = void 0;
const Alexa = require("ask-sdk-core");
const customLogger_1 = require("../utilities/customLogger");
const timetable_1 = require("../utilities/timetable");
const slotUtils_1 = require("../utilities/slotUtils");
// Lambda function to handle the GetSubscribeCourseIntent. This intent is used to get the course that the user subscribed to (e.g. "Che corsi seguo?")
exports.GetSubscribeCourseIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "GetSubscribeCourseIntent");
    },
    async handle(handlerInput) {
        // Get the list of available classes
        const classes = timetable_1.Timetable.getClassesList();
        // Get the course subscribed by the user from the session attributes
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const materie = sessionAttributes.materie;
        // If the user has subscribed to a course, return the course name, otherwise return an error message
        if (materie === undefined)
            return handlerInput.responseBuilder.speak("Non segui nessun corso.").getResponse();
        // Resolve materie
        const resolvedMaterie = (await slotUtils_1.SlotUtils.resolveClassIDList(materie)).map((nateria) => nateria.name);
        if (resolvedMaterie.length === 0) {
            customLogger_1.CustomLogger.warn("There was an error resolving the materie list. " + JSON.stringify(materie));
            return handlerInput.responseBuilder.speak("Si è verificato un errore, per favore riprova.").getResponse();
        }
        // If lenght of materie is 1, use the singular form of the sentence, otherwise use the plural form
        const speakOutput = "Sei iscritto " + (resolvedMaterie.length === 1 ? `alla seguente materia: ` : `alle seguenti materie: `) + resolvedMaterie + ".";
        return handlerInput.responseBuilder.speak(speakOutput).reprompt("La skill è in ascolto.").getResponse();
    }
};
