import Alexa = require("ask-sdk-core");
import {slotUtils} from "../utilities/slotUtils";

export module IntentsLorenzo {
	export const HelloWorldIntentHandler = {
		canHandle(handlerInput : Alexa.HandlerInput) {
			return (
				Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "GetSubscribeCourseIntent"
			);
		},

		async handle(handlerInput : Alexa.HandlerInput) {
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

	// Lambda function to handle the intent GetSubscribeCourseIntent. This intent is used to subscribe a user to a course (e.g. "Iscrivimi al corso di
	// Internet of Things.")
	export const SetSubscribeCourseIntentHandler = {
		canHandle(handlerInput : Alexa.HandlerInput) {
			return (
				Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "SetSubscribeCourseIntent"
			);
		},
		handle(handlerInput : Alexa.HandlerInput) {
			// Get the course name from the slot.
			const course = slotUtils.getSlotValue(handlerInput, "courseName");

			if (course === undefined) 
				return handlerInput.responseBuilder.speak("Non ho capito il nome del corso.").getResponse();
			
			const courseName = course.name;

			// Get the user id from the request.
			const userId = Alexa.getUserId(handlerInput.requestEnvelope);
			// Speak output the course name and the user id.
			const speakOutput = `L'utente ${userId} è stato registrato con successo al corso ${courseName}.`;
			// Return the response.
			return handlerInput.responseBuilder.speak(speakOutput).getResponse();
		}
	};
}
