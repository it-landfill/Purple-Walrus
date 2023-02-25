"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentsLorenzo = void 0;
const Alexa = require("ask-sdk-core");
var IntentsLorenzo;
(function (IntentsLorenzo) {
    IntentsLorenzo.HelloWorldIntentHandler = {
        canHandle(handlerInput) {
            return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "Adefgh");
        },
        async handle(handlerInput) {
            const attributesManager = handlerInput.attributesManager;
            let attributes = {
                counter: 10
            };
            attributesManager.setPersistentAttributes(attributes);
            await attributesManager.savePersistentAttributes();
            const speakOutput = "Hello World!";
            return (handlerInput.responseBuilder.speak(speakOutput)
                // .reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse());
        }
    };
})(IntentsLorenzo = exports.IntentsLorenzo || (exports.IntentsLorenzo = {}));
