import Alexa = require("ask-sdk-core");
import {CustomLogger} from "../utilities/customLogger";
import {Timetable} from "../utilities/timetable";
import { SlotUtils } from "../utilities/slotUtils";

// Lambda function to handle the GetSubscribeCourseIntent. This intent is used to get the course that the user subscribed to (e.g. "Che corsi seguo?")
export const GetSubscribeCourseIntentHandler = {
	canHandle(handlerInput : Alexa.HandlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "GetSubscribeCourseIntent"
		);
	},
	async handle(handlerInput : Alexa.HandlerInput) {
		// Get the list of available classes
		const classes = Timetable.getClassesList();

		// Get the course subscribed by the user from the session attributes
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		const materie = sessionAttributes.materie;

		// If the user has subscribed to a course, return the course name, otherwise return an error message
		if (materie === undefined) 
			return handlerInput.responseBuilder.speak("Non segui nessun corso.").getResponse();
		
		// Resolve materie
		const resolvedMaterie = (await SlotUtils.resolveClassIDList(materie)).map((nateria) => nateria.name);
		if (resolvedMaterie.length === 0) {
			CustomLogger.warn("There was an error resolving the materie list. " + JSON.stringify(materie));
			return handlerInput.responseBuilder.speak("Si è verificato un errore, per favore riprova.").getResponse();
		}

		// If lenght of materie is 1, use the singular form of the sentence, otherwise use the plural form
		const speakOutput = "Sei iscritto " + (
		resolvedMaterie.length === 1 ? `alla seguente materia: ` : `alle seguenti materie: `
	) + resolvedMaterie + ".";
		return handlerInput.responseBuilder.speak(speakOutput).reprompt("La skill è in ascolto.").getResponse();
	}
};
