import Alexa = require("ask-sdk-core");
export declare module IntentsLorenzo {
    const HelloWorldIntentHandler: {
        canHandle(handlerInput: Alexa.HandlerInput): boolean;
        handle(handlerInput: Alexa.HandlerInput): Promise<import("ask-sdk-model").Response>;
    };
}
