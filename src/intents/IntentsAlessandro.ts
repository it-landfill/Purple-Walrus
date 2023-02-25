import Alexa = require("ask-sdk-core");

import AWS = require("aws-sdk");

export module IntentsAlessandro {
	export const HelloWorldIntentHandler = {
		canHandle(handlerInput : Alexa.HandlerInput) {
			return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "GetWeeklyScheduleIntent");
		},
		handle(handlerInput : Alexa.HandlerInput) {
			const speakOutput = "Hello World!";

			// const region = process.env.DYNAMODB_PERSISTENCE_REGION || "eu-west-1";
			// const client = new AWS.DynamoDB({region});
			// console.warn("AJEJEJ");
			// client.listTables({}, (err : any, data : any) => {
			// 	if (err) 
			// 		console.warn(err, err.stack);
			// 	else 
			// 		console.warn(data);
			// 	}
			// );
			// console.warn("BJEJEJ");
			const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
			sessionAttributes["Ajeje"] = "Bjeje";

			return (handlerInput.responseBuilder.speak(speakOutput)
			//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
				.getResponse());
		}
	};
}
