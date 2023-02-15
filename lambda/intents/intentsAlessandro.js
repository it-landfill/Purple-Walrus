"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentsAlessandro = void 0;
const Alexa = require("ask-sdk-core");
var IntentsAlessandro;
(function (IntentsAlessandro) {
    IntentsAlessandro.HelloWorldIntentHandler = {
        canHandle(handlerInput) {
            return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "HelloWorldIntent");
        },
        handle(handlerInput) {
            const speakOutput = "Hello World!";
            return (handlerInput.responseBuilder.speak(speakOutput)
                //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse());
        }
    };
})(IntentsAlessandro = exports.IntentsAlessandro || (exports.IntentsAlessandro = {}));
