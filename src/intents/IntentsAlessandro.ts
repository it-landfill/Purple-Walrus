import Alexa = require("ask-sdk-core");
import {SlotUtils} from "../utilities/slotUtils";
import {CustomLogger} from "../utilities/customLogger";

import AWS = require("aws-sdk");

export module IntentsAlessandro {
	export const HelloWorldIntentHandler = {
		canHandle(handlerInput : Alexa.HandlerInput) {
			return (
				Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "ResolveClass"
			);
		},
		handle(handlerInput : Alexa.HandlerInput) {
			// Get the course name from the slot.
			CustomLogger.info("Getting course name from slot: " + JSON.stringify(Alexa.getSlot(handlerInput.requestEnvelope, "courseName")));
			const courses = SlotUtils.getSlotValue(handlerInput, "courseName");
			// If the course name is not valid, return an error.
			if (courses === undefined || courses.length === 0) 
				return handlerInput.responseBuilder.speak("Non ho capito il nome del corso.").reprompt("Riprova verificando che il corso che cerchi sia valido.").getResponse();
			
			// Get the first course from the list since this is most likely the correct one.
			const course = courses[0];

			// Speak output the course name.

			const speakOutput = `Hai scelto il corso di ` + course.name + `.`;
			CustomLogger.info("Course data: " + JSON.stringify(course));

			return (handlerInput.responseBuilder.speak(speakOutput)
			//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
				.getResponse());
		}
	};
}
