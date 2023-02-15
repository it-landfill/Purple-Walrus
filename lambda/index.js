"use strict";
const Alexa = require('ask-sdk-core');
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Test skill launch';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NextClassIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler, HelloWorldIntentHandler, HelpIntentHandler, CancelAndStopIntentHandler, FallbackIntentHandler, SessionEndedRequestHandler, IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUV0QyxNQUFNLG9CQUFvQixHQUFHO0lBQ3pCLFNBQVMsQ0FBQyxZQUFpQjtRQUN2QixPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLGVBQWUsQ0FBQztJQUNsRixDQUFDO0lBQ0QsTUFBTSxDQUFDLFlBQWlCO1FBQ3BCLE1BQU0sV0FBVyxHQUFHLG1CQUFtQixDQUFDO1FBRXhDLE9BQU8sWUFBWSxDQUFDLGVBQWU7YUFDOUIsS0FBSyxDQUFDLFdBQVcsQ0FBQzthQUNsQixRQUFRLENBQUMsV0FBVyxDQUFDO2FBQ3JCLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Q0FDSixDQUFDO0FBRUYsTUFBTSx1QkFBdUIsR0FBRztJQUM1QixTQUFTLENBQUMsWUFBaUI7UUFDdkIsT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsS0FBSyxlQUFlO2VBQ3RFLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLGlCQUFpQixDQUFDO0lBQ25GLENBQUM7SUFDRCxNQUFNLENBQUMsWUFBaUI7UUFDcEIsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDO1FBRW5DLE9BQU8sWUFBWSxDQUFDLGVBQWU7YUFDOUIsS0FBSyxDQUFDLFdBQVcsQ0FBQztZQUNuQiwwRkFBMEY7YUFDekYsV0FBVyxFQUFFLENBQUM7SUFDdkIsQ0FBQztDQUNKLENBQUM7QUFFRixNQUFNLGlCQUFpQixHQUFHO0lBQ3RCLFNBQVMsQ0FBQyxZQUFpQjtRQUN2QixPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxLQUFLLGVBQWU7ZUFDdEUsS0FBSyxDQUFD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RSxLQUFVO1FBQ2hDLE1BQU0sV0FBVyxHQUFHLDhEQUE4RCxDQUFDO1FBQ25GLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTVELE9BQU8sWUFBWSxDQUFDLGVBQWU7YUFDOUIsS0FBSyxDQUFDLFdBQVcsQ0FBQzthQUNsQixRQUFRLENBQUMsV0FBVyxDQUFDO2FBQ3JCLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Q0FDSixDQUFDO0FBRUY7Ozs7S0FJSztBQUNMLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7S0FDekMsa0JBQWtCLENBQ2Ysb0JBQW9CLEVBQ3BCLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsMEJBQTBCLEVBQzFCLHFCQUFxQixFQUNyQiwwQkFBMEIsRUFDMUIsc0JBQXNCLENBQUM7S0FDMUIsZ0JBQWdCLENBQ2IsWUFBWSxDQUFDO0tBQ2hCLE1BQU0sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQWxleGEgPSByZXF1aXJlKCdhc2stc2RrLWNvcmUnKTtcblxuY29uc3QgTGF1bmNoUmVxdWVzdEhhbmRsZXIgPSB7XG4gICAgY2FuSGFuZGxlKGhhbmRsZXJJbnB1dDogYW55KSB7XG4gICAgICAgIHJldHVybiBBbGV4YS5nZXRSZXF1ZXN0VHlwZShoYW5kbGVySW5wdXQucmVxdWVzdEVudmVsb3BlKSA9PT0gJ0xhdW5jaFJlcXVlc3QnO1xuICAgIH0sXG4gICAgaGFuZGxlKGhhbmRsZXJJbnB1dDogYW55KSB7XG4gICAgICAgIGNvbnN0IHNwZWFrT3V0cHV0ID0gJ1Rlc3Qgc2tpbGwgbGF1bmNoJztcblxuICAgICAgICByZXR1cm4gaGFuZGxlcklucHV0LnJlc3BvbnNlQnVpbGRlclxuICAgICAgICAgICAgLnNwZWFrKHNwZWFrT3V0cHV0KVxuICAgICAgICAgICAgLnJlcHJvbXB0KHNwZWFrT3V0cHV0KVxuICAgICAgICAgICAgLmdldFJlc3BvbnNlKCk7XG4gICAgfVxufTtcblxuY29uc3QgSGVsbG9Xb3JsZEludGVudEhhbmRsZXIgPSB7XG4gICAgY2FuSGFuZGxlKGhhbmRsZXJJbnB1dDogYW55KSB7XG4gICAgICAgIHJldHVybiBBbGV4YS5nZXRSZXF1ZXN0VHlwZShoYW5kbGVySW5wdXQucmVxdWVzdEVudmVsb3BlKSA9PT0gJ0ludGVudFJlcXVlc3QnXG4gICAgICAgICAgICAmJiBBbGV4YS5nZXRJbnRlbnROYW1lKGhhbmRsZXJJbnB1dC5yZXF1ZXN0RW52ZWxvcGUpID09PSAnTmV4dENsYXNzSW50ZW50JztcbiAgICB9LFxuICAgIGhhbmRsZShoYW5kbGVySW5wdXQ6IGFueSkge1xuICAgICAgICBjb25zdCBzcGVha091dHB1dCA9ICdIZWxsbyBXb3JsZCEnO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGVySW5wdXQucmVzcG9uc2VCdWlsZGVyXG4gICAgICAgICAgICAuc3BlYWsoc3BlYWtPdXRwdXQpXG4gICAgICAgICAgICAvLy5yZXByb21wdCgnYWRkIGEgcmVwcm9tcHQgaWYgeW91IHdhbnQgdG8ga2VlcCB0aGUgc2Vzc2lvbiBvcGVuIGZvciB0aGUgdXNlciB0byByZXNwb25kJylcbiAgICAgICAgICAgIC5nZXRSZXNwb25zZSgpO1xuICAgIH1cbn07XG5cbmNvbnN0IEhlbHBJbnRlbnRIYW5kbGVyID0ge1xuICAgIGNhbkhhbmRsZShoYW5kbGVySW5wdXQ6IGFueSkge1xuICAgICAgICByZXR1cm4gQWxleGEuZ2V0UmVxdWVzdFR5cGUoaGFuZGxlcklucHV0LnJlcXVlc3RFbnZlbG9wZSkgPT09ICdJbnRlbnRSZXF1ZXN0J1xuICAgICAgICAgICAgJiYgQWxleGEuZ2V0SW50ZW50TmFtZShoYW5kbGVySW5wdXQucmVxdWVzdEVudmVsb3BlKSA9PT0gJ0FNQVpPTi5IZWxwSW50ZW50JztcbiAgICB9LFxuICAgIGhhbmRsZShoYW5kbGVySW5wdXQ6IGFueSkge1xuICAgICAgICBjb25zdCBzcGVha091dHB1dCA9ICdZb3UgY2FuIHNheSBoZWxsbyB0byBtZSEgSG93IGNhbiBJIGhlbHA/JztcblxuICAgICAgICByZXR1cm4gaGFuZGxlcklucHV0LnJlc3BvbnNlQnVpbGRlclxuICAgICAgICAgICAgLnNwZWFrKHNwZWFrT3V0cHV0KVxuICAgICAgICAgICAgLnJlcHJvbXB0KHNwZWFrT3V0cHV0KVxuICAgICAgICAgICAgLmdldFJlc3BvbnNlKCk7XG4gICAgfVxufTtcblxuY29uc3QgQ2FuY2VsQW5kU3RvcEludGVudEhhbmRsZXIgPSB7XG4gICAgY2FuSGFuZGxlKGhhbmRsZXJJbnB1dDogYW55KSB7XG4gICAgICAgIHJldHVybiBBbGV4YS5nZXRSZXF1ZXN0VHlwZShoYW5kbGVySW5wdXQucmVxdWVzdEVudmVsb3BlKSA9PT0gJ0ludGVudFJlcXVlc3QnXG4gICAgICAgICAgICAmJiAoQWxleGEuZ2V0SW50ZW50TmFtZShoYW5kbGVySW5wdXQucmVxdWVzdEVudmVsb3BlKSA9PT0gJ0FNQVpPTi5DYW5jZWxJbnRlbnQnXG4gICAgICAgICAgICAgICAgfHwgQWxleGEuZ2V0SW50ZW50TmFtZShoYW5kbGVySW5wdXQucmVxdWVzdEVudmVsb3BlKSA9PT0gJ0FNQVpPTi5TdG9wSW50ZW50Jyk7XG4gICAgfSxcbiAgICBoYW5kbGUoaGFuZGxlcklucHV0OiBhbnkpIHtcbiAgICAgICAgY29uc3Qgc3BlYWtPdXRwdXQgPSAnR29vZGJ5ZSEnO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGVySW5wdXQucmVzcG9uc2VCdWlsZGVyXG4gICAgICAgICAgICAuc3BlYWsoc3BlYWtPdXRwdXQpXG4gICAgICAgICAgICAuZ2V0UmVzcG9uc2UoKTtcbiAgICB9XG59O1xuLyogKlxuICogRmFsbGJhY2tJbnRlbnQgdHJpZ2dlcnMgd2hlbiBhIGN1c3RvbWVyIHNheXMgc29tZXRoaW5nIHRoYXQgZG9lc27igJl0IG1hcCB0byBhbnkgaW50ZW50cyBpbiB5b3VyIHNraWxsXG4gKiBJdCBtdXN0IGFsc28gYmUgZGVmaW5lZCBpbiB0aGUgbGFuZ3VhZ2UgbW9kZWwgKGlmIHRoZSBsb2NhbGUgc3VwcG9ydHMgaXQpXG4gKiBUaGlzIGhhbmRsZXIgY2FuIGJlIHNhZmVseSBhZGRlZCBidXQgd2lsbCBiZSBpbmdub3JlZCBpbiBsb2NhbGVzIHRoYXQgZG8gbm90IHN1cHBvcnQgaXQgeWV0IFxuICogKi9cbmNvbnN0IEZhbGxiYWNrSW50ZW50SGFuZGxlciA9IHtcbiAgICBjYW5IYW5kbGUoaGFuZGxlcklucHV0OiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIEFsZXhhLmdldFJlcXVlc3RUeXBlKGhhbmRsZXJJbnB1dC5yZXF1ZXN0RW52ZWxvcGUpID09PSAnSW50ZW50UmVxdWVzdCdcbiAgICAgICAgICAgICYmIEFsZXhhLmdldEludGVudE5hbWUoaGFuZGxlcklucHV0LnJlcXVlc3RFbnZlbG9wZSkgPT09ICdBTUFaT04uRmFsbGJhY2tJbnRlbnQnO1xuICAgIH0sXG4gICAgaGFuZGxlKGhhbmRsZXJJbnB1dDogYW55KSB7XG4gICAgICAgIGNvbnN0IHNwZWFrT3V0cHV0ID0gJ1NvcnJ5LCBJIGRvblxcJ3Qga25vdyBhYm91dCB0aGF0LiBQbGVhc2UgdHJ5IGFnYWluLic7XG5cbiAgICAgICAgcmV0dXJuIGhhbmRsZXJJbnB1dC5yZXNwb25zZUJ1aWxkZXJcbiAgICAgICAgICAgIC5zcGVhayhzcGVha091dHB1dClcbiAgICAgICAgICAgIC5yZXByb21wdChzcGVha091dHB1dClcbiAgICAgICAgICAgIC5nZXRSZXNwb25zZSgpO1xuICAgIH1cbn07XG4vKiAqXG4gKiBTZXNzaW9uRW5kZWRSZXF1ZXN0IG5vdGlmaWVzIHRoYXQgYSBzZXNzaW9uIHdhcyBlbmRlZC4gVGhpcyBoYW5kbGVyIHdpbGwgYmUgdHJpZ2dlcmVkIHdoZW4gYSBjdXJyZW50bHkgb3BlbiBcbiAqIHNlc3Npb24gaXMgY2xvc2VkIGZvciBvbmUgb2YgdGhlIGZvbGxvd2luZyByZWFzb25zOiAxKSBUaGUgdXNlciBzYXlzIFwiZXhpdFwiIG9yIFwicXVpdFwiLiAyKSBUaGUgdXNlciBkb2VzIG5vdCBcbiAqIHJlc3BvbmQgb3Igc2F5cyBzb21ldGhpbmcgdGhhdCBkb2VzIG5vdCBtYXRjaCBhbiBpbnRlbnQgZGVmaW5lZCBpbiB5b3VyIHZvaWNlIG1vZGVsLiAzKSBBbiBlcnJvciBvY2N1cnMgXG4gKiAqL1xuY29uc3QgU2Vzc2lvbkVuZGVkUmVxdWVzdEhhbmRsZXIgPSB7XG4gICAgY2FuSGFuZGxlKGhhbmRsZXJJbnB1dDogYW55KSB7XG4gICAgICAgIHJldHVybiBBbGV4YS5nZXRSZXF1ZXN0VHlwZShoYW5kbGVySW5wdXQucmVxdWVzdEVudmVsb3BlKSA9PT0gJ1Nlc3Npb25FbmRlZFJlcXVlc3QnO1xuICAgIH0sXG4gICAgaGFuZGxlKGhhbmRsZXJJbnB1dDogYW55KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGB+fn5+IFNlc3Npb24gZW5kZWQ6ICR7SlNPTi5zdHJpbmdpZnkoaGFuZGxlcklucHV0LnJlcXVlc3RFbnZlbG9wZSl9YCk7XG4gICAgICAgIC8vIEFueSBjbGVhbnVwIGxvZ2ljIGdvZXMgaGVyZS5cbiAgICAgICAgcmV0dXJuIGhhbmRsZXJJbnB1dC5yZXNwb25zZUJ1aWxkZXIuZ2V0UmVzcG9uc2UoKTsgLy8gbm90aWNlIHdlIHNlbmQgYW4gZW1wdHkgcmVzcG9uc2VcbiAgICB9XG59O1xuLyogKlxuICogVGhlIGludGVudCByZWZsZWN0b3IgaXMgdXNlZCBmb3IgaW50ZXJhY3Rpb24gbW9kZWwgdGVzdGluZyBhbmQgZGVidWdnaW5nLlxuICogSXQgd2lsbCBzaW1wbHkgcmVwZWF0IHRoZSBpbnRlbnQgdGhlIHVzZXIgc2FpZC4gWW91IGNhbiBjcmVhdGUgY3VzdG9tIGhhbmRsZXJzIGZvciB5b3VyIGludGVudHMgXG4gKiBieSBkZWZpbmluZyB0aGVtIGFib3ZlLCB0aGVuIGFsc28gYWRkaW5nIHRoZW0gdG8gdGhlIHJlcXVlc3QgaGFuZGxlciBjaGFpbiBiZWxvdyBcbiAqICovXG5jb25zdCBJbnRlbnRSZWZsZWN0b3JIYW5kbGVyID0ge1xuICAgIGNhbkhhbmRsZShoYW5kbGVySW5wdXQ6IGFueSkge1xuICAgICAgICByZXR1cm4gQWxleGEuZ2V0UmVxdWVzdFR5cGUoaGFuZGxlcklucHV0LnJlcXVlc3RFbnZlbG9wZSkgPT09ICdJbnRlbnRSZXF1ZXN0JztcbiAgICB9LFxuICAgIGhhbmRsZShoYW5kbGVySW5wdXQ6IGFueSkge1xuICAgICAgICBjb25zdCBpbnRlbnROYW1lID0gQWxleGEuZ2V0SW50ZW50TmFtZShoYW5kbGVySW5wdXQucmVxdWVzdEVudmVsb3BlKTtcbiAgICAgICAgY29uc3Qgc3BlYWtPdXRwdXQgPSBgWW91IGp1c3QgdHJpZ2dlcmVkICR7aW50ZW50TmFtZX1gO1xuXG4gICAgICAgIHJldHVybiBoYW5kbGVySW5wdXQucmVzcG9uc2VCdWlsZGVyXG4gICAgICAgICAgICAuc3BlYWsoc3BlYWtPdXRwdXQpXG4gICAgICAgICAgICAvLy5yZXByb21wdCgnYWRkIGEgcmVwcm9tcHQgaWYgeW91IHdhbnQgdG8ga2VlcCB0aGUgc2Vzc2lvbiBvcGVuIGZvciB0aGUgdXNlciB0byByZXNwb25kJylcbiAgICAgICAgICAgIC5nZXRSZXNwb25zZSgpO1xuICAgIH1cbn07XG4vKipcbiAqIEdlbmVyaWMgZXJyb3IgaGFuZGxpbmcgdG8gY2FwdHVyZSBhbnkgc3ludGF4IG9yIHJvdXRpbmcgZXJyb3JzLiBJZiB5b3UgcmVjZWl2ZSBhbiBlcnJvclxuICogc3RhdGluZyB0aGUgcmVxdWVzdCBoYW5kbGVyIGNoYWluIGlzIG5vdCBmb3VuZCwgeW91IGhhdmUgbm90IGltcGxlbWVudGVkIGEgaGFuZGxlciBmb3JcbiAqIHRoZSBpbnRlbnQgYmVpbmcgaW52b2tlZCBvciBpbmNsdWRlZCBpdCBpbiB0aGUgc2tpbGwgYnVpbGRlciBiZWxvdyBcbiAqICovXG5jb25zdCBFcnJvckhhbmRsZXIgPSB7XG4gICAgY2FuSGFuZGxlKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGhhbmRsZShoYW5kbGVySW5wdXQ6IGFueSwgZXJyb3I6IGFueSkge1xuICAgICAgICBjb25zdCBzcGVha091dHB1dCA9ICdTb3JyeSwgSSBoYWQgdHJvdWJsZSBkb2luZyB3aGF0IHlvdSBhc2tlZC4gUGxlYXNlIHRyeSBhZ2Fpbi4nO1xuICAgICAgICBjb25zb2xlLmxvZyhgfn5+fiBFcnJvciBoYW5kbGVkOiAke0pTT04uc3RyaW5naWZ5KGVycm9yKX1gKTtcblxuICAgICAgICByZXR1cm4gaGFuZGxlcklucHV0LnJlc3BvbnNlQnVpbGRlclxuICAgICAgICAgICAgLnNwZWFrKHNwZWFrT3V0cHV0KVxuICAgICAgICAgICAgLnJlcHJvbXB0KHNwZWFrT3V0cHV0KVxuICAgICAgICAgICAgLmdldFJlc3BvbnNlKCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBUaGlzIGhhbmRsZXIgYWN0cyBhcyB0aGUgZW50cnkgcG9pbnQgZm9yIHlvdXIgc2tpbGwsIHJvdXRpbmcgYWxsIHJlcXVlc3QgYW5kIHJlc3BvbnNlXG4gKiBwYXlsb2FkcyB0byB0aGUgaGFuZGxlcnMgYWJvdmUuIE1ha2Ugc3VyZSBhbnkgbmV3IGhhbmRsZXJzIG9yIGludGVyY2VwdG9ycyB5b3UndmVcbiAqIGRlZmluZWQgYXJlIGluY2x1ZGVkIGJlbG93LiBUaGUgb3JkZXIgbWF0dGVycyAtIHRoZXkncmUgcHJvY2Vzc2VkIHRvcCB0byBib3R0b20gXG4gKiAqL1xuZXhwb3J0cy5oYW5kbGVyID0gQWxleGEuU2tpbGxCdWlsZGVycy5jdXN0b20oKVxuICAgIC5hZGRSZXF1ZXN0SGFuZGxlcnMoXG4gICAgICAgIExhdW5jaFJlcXVlc3RIYW5kbGVyLFxuICAgICAgICBIZWxsb1dvcmxkSW50ZW50SGFuZGxlcixcbiAgICAgICAgSGVscEludGVudEhhbmRsZXIsXG4gICAgICAgIENhbmNlbEFuZFN0b3BJbnRlbnRIYW5kbGVyLFxuICAgICAgICBGYWxsYmFja0ludGVudEhhbmRsZXIsXG4gICAgICAgIFNlc3Npb25FbmRlZFJlcXVlc3RIYW5kbGVyLFxuICAgICAgICBJbnRlbnRSZWZsZWN0b3JIYW5kbGVyKVxuICAgIC5hZGRFcnJvckhhbmRsZXJzKFxuICAgICAgICBFcnJvckhhbmRsZXIpXG4gICAgLmxhbWJkYSgpOyJdfQ==