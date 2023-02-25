import Alexa = require("ask-sdk-core");
import {slotUtils} from "../utilities/slotUtils";

// Lambda function to handle the intent GetSubscribeCourseIntent. 
// This intent is used to subscribe a user to a course (e.g. "Iscrivimi al corso di Internet of Things.")
export const SetSubscribeCourseIntentHandler = {
	canHandle(handlerInput : Alexa.HandlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "SetSubscribeCourseIntent"
		);
	},
	handle(handlerInput : Alexa.HandlerInput) {
		// Get the course name from the slot.
		const course = slotUtils.getSlotValue(handlerInput, "courseName");
        // If the course name is not valid, return an error.
		if (course === undefined) 
			return handlerInput.responseBuilder.speak("Non ho capito il nome del corso.").reprompt("Riprova verificando che il corso che cerchi sia valido.").getResponse();
		// Set session attributes to store the course name subscribed by the user.
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		if (sessionAttributes.materie === undefined) 
			sessionAttributes.materie = [];
		if (sessionAttributes.materie.indexOf(course.name) === -1) 
			sessionAttributes.materie.push(course.name);
		else 
			return handlerInput.responseBuilder.speak(`Sei già iscritto al corso di ${course.name}.`).reprompt("Posso fare altro per te?").getResponse();
		// Speak output the course name.
		const speakOutput = `Sei stato registrato con successo al corso ${course.name}.`;
		// Return the response.
		return handlerInput.responseBuilder.speak(speakOutput).reprompt("La skill è in ascolto.").getResponse();
	}
};
