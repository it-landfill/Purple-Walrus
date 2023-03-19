import Alexa = require("ask-sdk-core");
export declare const LaunchRequestHandler: {
    canHandle(handlerInput: Alexa.HandlerInput): boolean;
    handle(handlerInput: Alexa.HandlerInput): Promise<import("ask-sdk-model").Response>;
};
export declare const HelpIntentHandler: {
    canHandle(handlerInput: Alexa.HandlerInput): boolean;
    handle(handlerInput: Alexa.HandlerInput): import("ask-sdk-model").Response;
};
export declare const CancelAndStopIntentHandler: {
    canHandle(handlerInput: Alexa.HandlerInput): boolean;
    handle(handlerInput: Alexa.HandlerInput): import("ask-sdk-model").Response;
};
export declare const FallbackIntentHandler: {
    canHandle(handlerInput: Alexa.HandlerInput): boolean;
    handle(handlerInput: Alexa.HandlerInput): import("ask-sdk-model").Response;
};
export declare const SessionEndedRequestHandler: {
    canHandle(handlerInput: Alexa.HandlerInput): boolean;
    handle(handlerInput: Alexa.HandlerInput): import("ask-sdk-model").Response;
};
export declare const IntentReflectorHandler: {
    canHandle(handlerInput: Alexa.HandlerInput): boolean;
    handle(handlerInput: Alexa.HandlerInput): import("ask-sdk-model").Response;
};
