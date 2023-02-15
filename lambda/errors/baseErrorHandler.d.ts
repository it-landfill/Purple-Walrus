/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
export declare const ErrorHandler: {
    canHandle(): boolean;
    handle(handlerInput: any, error: any): any;
};
