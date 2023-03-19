import Alexa = require("ask-sdk-core");

// Lambda function to handle the GetSubscribeCourseIntent.
// This intent is used to get the course that the user subscribed to (e.g. "Che corsi seguo?")
export const GetSubscribeCourseIntentHandler = {
    canHandle(handlerInput : Alexa.HandlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "GetSubscribeCourseIntent"
        );
    },
    handle(handlerInput : Alexa.HandlerInput) {
        // Get the course subscribed by the user from the session attributes
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const materie = sessionAttributes.materie; //TODO: Questi sono ID, devono diventare nomi dei corsi

        // If the user has subscribed to a course, return the course name, otherwise return an error message
        if (materie) {
            // If lenght of materie is 1, use the singular form of the sentence, otherwise use the plural form
            const speakOutput = "Sei iscritto " + ((materie.length === 1) ? `alla seguente materia: ` : `alle seguenti materie: `) + materie + ".";
            return handlerInput.responseBuilder.speak(speakOutput).getResponse();
        } else {
            return handlerInput.responseBuilder.speak("Non segui nessun corso.").getResponse();
        }
    }
};