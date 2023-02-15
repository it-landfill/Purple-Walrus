declare const Alexa: any;
declare const LaunchRequestHandler: {
    canHandle(handlerInput: any): boolean;
    handle(handlerInput: any): any;
};
declare const HelloWorldIntentHandler: {
    canHandle(handlerInput: any): boolean;
    handle(handlerInput: any): any;
};
declare const HelpIntentHandler: {
    canHandle(handlerInput: any): boolean;
    handle(handlerInput: any): any;
};
declare const CancelAndStopIntentHandler: {
    canHandle(handlerInput: any): boolean;
    handle(handlerInput: any): any;
};
declare const FallbackIntentHandler: {
    canHandle(handlerInput: any): boolean;
    handle(handlerInput: any): any;
};
declare const SessionEndedRequestHandler: {
    canHandle(handlerInput: any): boolean;
    handle(handlerInput: any): any;
};
declare const IntentReflectorHandler: {
    canHandle(handlerInput: any): boolean;
    handle(handlerInput: any): any;
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
declare const ErrorHandler: {
    canHandle(): boolean;
    handle(handlerInput: any, error: any): any;
};
