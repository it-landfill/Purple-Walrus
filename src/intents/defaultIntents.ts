import Alexa = require("ask-sdk-core");
import {Directive} from "ask-sdk-model";
import {CustomLogger} from "../utilities/customLogger";
import {Timetable} from "../utilities/timetable";

export const LaunchRequestHandler = {
	canHandle(handlerInput : Alexa.HandlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
	},
	async handle(handlerInput : Alexa.HandlerInput) {
		let replaceEntityDirective: Directive = {
			type: "Dialog.UpdateDynamicEntities",
			updateBehavior: "REPLACE",
			types: []
		};

		// Get the dynamic entities
		const vals = await Timetable.generateDynamicClassEntries();
		if (vals) {
			replaceEntityDirective.types = [
				{
					name: "ClassNames",
					values: vals
				}
			];
		}

		const repeat = "Come posso aiutarti?";
		const speech = "Benvenuto in Orari Università. " + repeat;

		CustomLogger.verbose("Loading dynamic entities: " + JSON.stringify(replaceEntityDirective));

		return handlerInput.responseBuilder.speak(speech).reprompt(repeat).addDirective(replaceEntityDirective).getResponse();
	}
};

export const HelpIntentHandler = {
	canHandle(handlerInput : Alexa.HandlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
		);
	},
	handle(handlerInput : Alexa.HandlerInput) {
		const speakOutput = "You can say hello to me! How can I help?";

		return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
	}
};

export const CancelAndStopIntentHandler = {
	canHandle(handlerInput : Alexa.HandlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && (Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.CancelIntent" || Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.StopIntent")
		);
	},
	handle(handlerInput : Alexa.HandlerInput) {
		const speakOutput = "Arrivederci!";

		return handlerInput.responseBuilder.speak(speakOutput).getResponse();
	}
};

/*  * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill It must also be defined in the language mod
 *  el (if the locale supports it) This handler can be safely added but will be ingnored in locales that do not support it yet

 */
export const FallbackIntentHandler = {
	canHandle(handlerInput : Alexa.HandlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.FallbackIntent"
		);
	},
	handle(handlerInput : Alexa.HandlerInput) {
		const speakOutput = "Sorry, I don't know about that. Please try again.";

		return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
	}
};

/*  * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open session is closed for one of the fol
 *  lowing reasons: 1) The user says "exit" or "quit". 2) The user does not respond or says something that does not match an intent defined in your vo
 * i ce model. 3) An error occurs

 */
export const SessionEndedRequestHandler = {
	canHandle(handlerInput : Alexa.HandlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "SessionEndedRequest";
	},
	handle(handlerInput : Alexa.HandlerInput) {
		console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
		// Any cleanup logic goes here. Clear dynamic entities
		const clearEntitiesDirective: Directive = {
			type: "Dialog.UpdateDynamicEntities",
			updateBehavior: "CLEAR"
		};

		return handlerInput.responseBuilder.addDirective(clearEntitiesDirective).getResponse(); // notice we send an empty response
	}
};

/*  * The intent reflector is used for interaction model testing and debugging. It will simply repeat the intent the user said. You can create custom
 * handlers for your intents by defining them above, then also adding them to the request handler chain below

 */
export const IntentReflectorHandler = {
	canHandle(handlerInput : Alexa.HandlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest";
	},
	handle(handlerInput : Alexa.HandlerInput) {
		const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
		const speakOutput = `You just triggered ${intentName}`;

		return (handlerInput.responseBuilder.speak(speakOutput)
		//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
			.getResponse());
	}
};
