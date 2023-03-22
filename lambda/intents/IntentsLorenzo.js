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
            const courseSlot = slotUtils_1.SlotUtils.getSlotValue(handlerInput, "courseName");
            const timespanSlot = slotUtils_1.SlotUtils.getSlotValue(handlerInput, "timespan");
            // ---- Course ID Slot----
            let courseIDList = [];
            if (courseSlot === undefined || courseSlot.length === 0) {
                // Handle the case where the user has specified the timespan but not the course In this case we use the course subscribed by the user
                const materie = handlerInput.attributesManager.getSessionAttributes().materie;
                // If the user is not subscribed to any course, return an error message
                if (materie === undefined) {
                    return handlerInput.responseBuilder.speak("Non sei iscritto a nessun corso. Iscriviti ad un corso o specifica il nome del corso per poter leggere il calendario.").reprompt("Riprova verificando che il corso che cerchi sia valido.").getResponse();
                }
                // Populate courseIDList with the course IDs
                courseIDList = materie;
            }
            else {
                // Handle the case where the user has specified the course Get the course ID from the course name We use courseSlot[0] since the first element is the
                // most probable one
                const courseID = courseSlot[0].id;
                // Populate courseIDList with the course ID
                courseIDList = [courseID];
            }
            // ---- Timespan Slot ---- Generate start and end dates
            let start;
            // Add one week to the actual time
            let end;
            if (timespanSlot === undefined) {
                // Handle the case where the user has specified the course but not the timespan Fallback to default date: today
                start = new Date();
                end = new Date();
            }
            else {
                // Handle the case where the user has specified the timespan We use timespanSlot[0] since the first element is the most probable one Get the date
                // string from the timespan slot
                const timespan = timespanSlot[0].name;
                // Parse the alexa date string to a Date object
                const timespanDate = slotUtils_1.SlotUtils.dateParser(timespan);
                if (timespanDate) {
                    // Split the object in start and end
                    start = timespanDate.startDate;
                    end = timespanDate.endDate;
                }
                else {
                    // Handle the case where the user has specified an invalid date
                    customLogger_1.CustomLogger.warn("Invalid date, fallback to default date");
                    start = new Date();
                    end = new Date();
                }
            }
            // ---- Schedule generation ----
            const timetable = await timetable_1.Timetable.getTimetableFromClassList(courseIDList, start, end);
            // Print the schedule
            customLogger_1.CustomLogger.info(timetable);
            // ---- Response ----
            let speakOutput = "";
            if (timetable && timetable.length > 0) {
                speakOutput += "Il giorno " + start.toISOString().split("T")[0] + " hai le seguenti lezioni:";
                timetable.forEach((element) => {
                    speakOutput += ` ${slotUtils_1.SlotUtils.cleanClassName(element.title)[0]} alle ${element.start.split("T")[1]} in ${element.aula.edificio},`;
                });
            }
            return handlerInput.responseBuilder.speak(speakOutput).reprompt("La skill è in ascolto").getResponse();
        }
    };
})(IntentsLorenzo = exports.IntentsLorenzo || (exports.IntentsLorenzo = {}));
