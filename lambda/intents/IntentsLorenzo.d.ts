import Alexa = require("ask-sdk-core");
export declare module IntentsLorenzo {
    const GetWeeklyScheduleIntentHander: {
        canHandle(handlerInput: Alexa.HandlerInput): boolean;
        handle(handlerInput: Alexa.HandlerInput): Promise<import("ask-sdk-model").Response>;
    };
}
