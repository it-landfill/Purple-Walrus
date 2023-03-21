"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentsLorenzo = void 0;
const Alexa = require("ask-sdk-core");
const timetable_1 = require("../utilities/timetable");
const customLogger_1 = require("../utilities/customLogger");
const slotUtils_1 = require("../utilities/slotUtils");
var IntentsLorenzo;
(function (IntentsLorenzo) {
    // "Leggi il calendario"
    IntentsLorenzo.GetWeeklyScheduleIntentHander = {
        canHandle(handlerInput) {
            return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "GetWeeklyScheduleIntent");
        },
        async handle(handlerInput) {
            // Get the course name from the slot and timespan from the slot.
            const course = slotUtils_1.SlotUtils.getSlotValue(handlerInput, "courseName");
            const timespan = slotUtils_1.SlotUtils.getSlotValue(handlerInput, "timespan");
            // Check if course and/or timespan are filled
            if (course === undefined && timespan === undefined) {
                return handlerInput.responseBuilder.speak("Non hai specificato il corso e il periodo di tempo. Riprova.").getResponse();
            }
            else if (course === undefined) {
                // Handle the case where the user has specified the timespan but not the course
            }
            // Get user subscribe courses from persistence adapter
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const materie = sessionAttributes.materie;
            const listMaterie = await timetable_1.Timetable.getClassesList();
            // Generate the schedule for the user
            if (materie === undefined || listMaterie === undefined)
                return handlerInput.responseBuilder.speak("Non sei iscritto a nessun corso. Iscriviti ad un corso per poter leggere il calendario.").reprompt("Riprova verificando che il corso che cerchi sia valido.").getResponse();
            const gino = listMaterie[materie[0]];
            customLogger_1.CustomLogger.log(gino);
            // get actual time
            const now = new Date();
            // Add one week to the actual time
            const nextWeek = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
            const output = await timetable_1.Timetable.getTimetable(gino.year, gino.curriculum, now, nextWeek, [gino.code]);
            // Print the schedule
            customLogger_1.CustomLogger.info(output);
            // Get the course name from the slot and timespan from the slot. const course = slotUtils.getSlotValue(handlerInput, "courseName"); const timespan =
            // slotUtils.getSlotValue(handlerInput, "timespan"); Based on the information provided by the user, get the schedule.
            let speakOutput = `Il giorno 1/1/2019 hai le seguenti lezioni:`;
            output.forEach((element) => {
                speakOutput += ` ${element.title} alle ${element.start.split("T")[1]} in ${element.aula.edificio},`;
            });
            return (handlerInput.responseBuilder.speak(speakOutput)
                // .reprompt('add a reprompt if you want to keep the session open for the user to respond')
                .getResponse());
        }
    };
})(IntentsLorenzo = exports.IntentsLorenzo || (exports.IntentsLorenzo = {}));
