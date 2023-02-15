import Alexa = require("ask-sdk-core");

export const LaunchRequestHandler = {
	canHandle(handlerInput : any) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
	},
	handle(handlerInput : any) {
		const speakOutput = "Test skill launch";

		return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
	}
};

export const HelloWorldIntentHandler = {
	canHandle(handlerInput : any) {
		return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "NextClassIntent");
	},
	handle(handlerInput : any) {
		const speakOutput = "Hello World!";

		return (handlerInput.responseBuilder.speak(speakOutput)
		//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
			.getResponse());
	}
};

export const HelpIntentHandler = {
	canHandle(handlerInput : any) {
		return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent");
	},
	handle(handlerInput : any) {
		const speakOutput = "You can say hello to me! How can I help?";

		return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
	}
};

export const CancelAndStopIntentHandler = {
	canHandle(handlerInput : any) {
		return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && (Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.CancelIntent" || Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.StopIntent"));
	},
	handle(handlerInput : any) {
		const speakOutput = "Goodbye!";

		return handlerInput.responseBuilder.speak(speakOutput).getResponse();
	}
};

/* * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill It must also be defined in the language model (if the locale supports it) This handler can be safely added but will be ingnored in locales that do not support it yet */
export const FallbackIntentHandler = {
	canHandle(handlerInput : any) {
		return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.FallbackIntent");
	},
	handle(handlerInput : any) {
		const speakOutput = "Sorry, I don't know about that. Please try again.";

		return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
	}
};

/* * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not respond or says something that does not match an intent defined in your voice model. 3) An error occurs */
export const SessionEndedRequestHandler = {
	canHandle(handlerInput : any) {
		return (Alexa.getRequestType(handlerInput.requestEnvelope) === "SessionEndedRequest");
	},
	handle(handlerInput : any) {
		console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
		// Any cleanup logic goes here.
		return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
	}
};

/* * The intent reflector is used for interaction model testing and debugging. It will simply repeat the intent the user said. You can create custom handlers for your intents by defining them above, then also adding them to the request handler chain below */
export const IntentReflectorHandler = {
	canHandle(handlerInput : any) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest";
	},
	handle(handlerInput : any) {
		const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
		const speakOutput = `You just triggered ${intentName}`;

		return (handlerInput.responseBuilder.speak(speakOutput)
		//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
			.getResponse());
	}
};
