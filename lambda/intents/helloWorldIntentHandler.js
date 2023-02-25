"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa1 = require("ask-sdk-core");
module.exports = {
    HelloWorldIntentHandler: {
        canHandle(handlerInput) {
            return Alexa1.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
                && Alexa1.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
        },
        handle(handlerInput) {
            const speakOutput = handlerInput.t('HELLO_MSG');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse();
        }
    }
};
