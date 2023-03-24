"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentReflectorHandler = exports.SessionEndedRequestHandler = exports.FallbackIntentHandler = exports.CancelAndStopIntentHandler = exports.HelpIntentHandler = exports.LaunchRequestHandler = void 0;
const Alexa = require("ask-sdk-core");
const customLogger_1 = require("../utilities/customLogger");
const timetable_1 = require("../utilities/timetable");
exports.LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
    },
    async handle(handlerInput) {
        let replaceEntityDirective = {
            type: "Dialog.UpdateDynamicEntities",
            updateBehavior: "REPLACE",
            types: []
        };
        // Get the dynamic entities
        const vals = await timetable_1.Timetable.generateDynamicClassEntries();
        if (vals) {
            replaceEntityDirective.types = [
                {
                    name: "ClassNames",
                    values: vals
                }
            ];
        }
        // Get persistent attributes to check if the user is subscribed to any course no longer available.
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if (sessionAttributes.materie !== undefined) {
            let listCoursePopped = [];
            const courseAvailable = await timetable_1.Timetable.getClassesList();
            if (courseAvailable) {
                // For each course, check if the course is in the course list
                for (const course of sessionAttributes.materie) {
                    if (!(course in courseAvailable)) {
                        // Pop the course from the list
                        const popCourse = sessionAttributes.materie.pop();
                        customLogger_1.CustomLogger.verbose("Course " + popCourse + " is not available anymore. Removing it from the list.");
                        listCoursePopped.push(popCourse);
                    }
                }
            }
            if (listCoursePopped.length > 0) {
                const repeat = "Come posso aiutarti?";
                // TODO: listCoursePopped is an array of course ids. We need to get the course name from the id?
                const poppedCourseInfo = "Dall'ultima sessione sono stati rimossi i seguenti corsi perchè non più disponibili: " + listCoursePopped.join(", ") + ". ";
                const speech = "Benvenuto in Orari Università. " + poppedCourseInfo + repeat;
                return handlerInput.responseBuilder.speak(speech).reprompt(repeat).addDirective(replaceEntityDirective).getResponse();
            }
        }
        const repeat = "Come posso aiutarti?";
        const speech = "Benvenuto in Orari Università. " + repeat;
        customLogger_1.CustomLogger.verbose("Loading dynamic entities: " + JSON.stringify(replaceEntityDirective));
        return handlerInput.responseBuilder.speak(speech).reprompt(repeat).addDirective(replaceEntityDirective).getResponse();
    }
};
exports.HelpIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent");
    },
    handle(handlerInput) {
        const repeat = "Come posso aiutarti?";
        const speakOutput = "La skill orari università ti permette di sapere gli orari delle lezioni del corso di informatica magistrale di Bologna. Ad esempio, puoi chiedermi gli orari di una lezione, oppure di aggiungere una lezione alla tua lista dei corsi che segui. " + repeat;
        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};
exports.CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && (Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.CancelIntent" || Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.StopIntent"));
    },
    handle(handlerInput) {
        const speakOutput = "Arrivederci!";
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    }
};
/*  * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill It must also be defined in the language mod
 *  el (if the locale supports it) This handler can be safely added but will be ingnored in locales that do not support it yet

 */
exports.FallbackIntentHandler = {
    canHandle(handlerInput) {
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.FallbackIntent");
    },
    handle(handlerInput) {
        const speakOutput = "Sorry, I don't know about that. Please try again.";
        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};
/*  * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open session is closed for one of the fol
 *  lowing reasons: 1) The user says "exit" or "quit". 2) The user does not respond or says something that does not match an intent defined in your vo
 * i ce model. 3) An error occurs

 */
exports.SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "SessionEndedRequest";
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here. Clear dynamic entities
        const clearEntitiesDirective = {
            type: "Dialog.UpdateDynamicEntities",
            updateBehavior: "CLEAR"
        };
        return handlerInput.responseBuilder.addDirective(clearEntitiesDirective).getResponse(); // notice we send an empty response
    }
};
/*  * The intent reflector is used for interaction model testing and debugging. It will simply repeat the intent the user said. You can create custom
 * handlers for your intents by defining them above, then also adding them to the request handler chain below

 */
exports.IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest";
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;
        return (handlerInput.responseBuilder.speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse());
    }
};
