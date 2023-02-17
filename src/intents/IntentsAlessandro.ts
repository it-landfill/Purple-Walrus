import Alexa = require("ask-sdk-core");

import {DynamoDB} from "@aws-sdk/client-dynamodb";

export module IntentsAlessandro {
	export const HelloWorldIntentHandler = {
		canHandle(handlerInput : Alexa.HandlerInput) {
			return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "NextClassIntent");
		},
		handle(handlerInput : Alexa.HandlerInput) {
			const speakOutput = "Hello World!";

			const region = process.env.DYNAMODB_PERSISTENCE_REGION || "eu-west-1";
			const client = new DynamoDB({region});
			client.listTables({}, (err, data) => {
				if (err) 
					console.warn(err, err.stack);
				else 
					console.warn(data);
				}
			);

			return (handlerInput.responseBuilder.speak(speakOutput)
			//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
				.getResponse());
		}
	};
}
