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
/**
 *	FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill It must also be
 *	defined in the language model (if the locale supports it) This handler can be safely added but will be ingnored in
 *	locales that do not support it yet
 */
export declare const FallbackIntentHandler: {
    canHandle(handlerInput: Alexa.HandlerInput): boolean;
    handle(handlerInput: Alexa.HandlerInput): import("ask-sdk-model").Response;
};
/**
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open session is closed
 * for one of the following reasons:
 * 1) The user says "exit" or "quit".
 * 2) The user does not respond or says something that does not match an intent defined in your voice model.
 * 3) An error occurs
 */
export declare const SessionEndedRequestHandler: {
    canHandle(handlerInput: Alexa.HandlerInput): boolean;
    handle(handlerInput: Alexa.HandlerInput): import("ask-sdk-model").Response;
};
/**
 * The intent reflector is used for interaction model testing and debugging. It will simply repeat the intent the user said.
 * You can create custom handlers for your intents by defining them above, then also adding them to the request handler chain below
 */
export declare const IntentReflectorHandler: {
    canHandle(handlerInput: Alexa.HandlerInput): boolean;
    handle(handlerInput: Alexa.HandlerInput): import("ask-sdk-model").Response;
};
