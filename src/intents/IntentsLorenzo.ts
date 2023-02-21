import Alexa = require("ask-sdk-core");

export module IntentsLorenzo {
	export const HelloWorldIntentHandler = {
		canHandle(handlerInput: Alexa.HandlerInput) {
			return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "GetSubscribeCourseIntent");
		},
		async handle(handlerInput: Alexa.HandlerInput) {
			const attributesManager = handlerInput.attributesManager;
			let attributes = { "counter": 10 };

			attributesManager.setPersistentAttributes(attributes);
			await attributesManager.savePersistentAttributes();

			const speakOutput = "Hello World!";

			return (handlerInput.responseBuilder.speak(speakOutput)
				//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
				.getResponse());
		}
	};
}
