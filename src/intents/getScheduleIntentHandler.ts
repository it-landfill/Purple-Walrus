import Alexa = require("ask-sdk-core");
import {Timetable} from "../utilities/timetable";
import {CustomLogger} from "../utilities/customLogger";
import {SlotUtils} from "../utilities/slotUtils";
import { Utils } from "../utilities/utils";

// "Leggi il calendario"
export const GetScheduleIntentHander = {
	canHandle(handlerInput : Alexa.HandlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "GetScheduleIntent"
		);
	},
	async handle(handlerInput : Alexa.HandlerInput) {
		// Get the course name from the slot and timespan from the slot.
		const courseSlot = SlotUtils.getSlotValue(handlerInput, "courseName");
		const timespanSlot = SlotUtils.getSlotValue(handlerInput, "timespan");

		// ---- Course ID Slot----
		let courseIDList: string[] = [];
		if (courseSlot === undefined || courseSlot.length === 0) {
			// Handle the case where the user has specified the timespan but not the course In this case we use the course subscribed by the user

			const materie: string[] = handlerInput.attributesManager.getSessionAttributes().materie;

			// If the user is not subscribed to any course, return an error message
			if (materie === undefined) {
				return handlerInput.responseBuilder.speak(
					"Non sei iscritto a nessun corso. Iscriviti ad un corso o specifica il nome del corso per poter leggere il calendario."
				).reprompt("Riprova verificando che il corso che cerchi sia valido.").getResponse();
			}

			// Populate courseIDList with the course IDs
			courseIDList = materie;
		} else {
			// Handle the case where the user has specified the course Get the course ID from the course name We use courseSlot[0] since the first element is the
			// most probable one
			const courseID = courseSlot[0].id;

			// Populate courseIDList with the course ID
			courseIDList = [courseID];
		}

		// ---- Timespan Slot ---- Generate start and end dates
		let start: Date;
		// Add one week to the actual time
		let end: Date;
		if (timespanSlot === undefined) {
			// Handle the case where the user has specified the course but not the timespan Fallback to default date: today
			start = new Date();
			end = new Date();
		} else {
			// Handle the case where the user has specified the timespan We use timespanSlot[0] since the first element is the most probable one Get the date
			// string from the timespan slot
			const timespan = timespanSlot[0].name;
			// Parse the alexa date string to a Date object
			const timespanDate = SlotUtils.dateParser(timespan);

			if (timespanDate) {
				// Split the object in start and end
				start = timespanDate.startDate;
				end = timespanDate.endDate;
			} else {
				// Handle the case where the user has specified an invalid date
				CustomLogger.warn("Invalid date, fallback to default date");
				start = new Date();
				end = new Date();
			}
		}

		// ---- Schedule generation ----
		const timetable = await Timetable.getTimetableFromClassList(courseIDList, start, end);
		// Print the schedule
		CustomLogger.verbose("Schedule: " + JSON.stringify(timetable) );

		// ---- Response ----
		let speakOutput: string = "";
		if (timetable && timetable.length > 0) {
			const verbose = timetable.length === 1;
			timetable.forEach((element : Timetable.TimetableEntry) => {
				if (element.classes.length > 0) {
					CustomLogger.verbose("Element: " + JSON.stringify(element));
					const ts = new Date(element.date); 
					speakOutput +=  Utils.formatDateForSpeach(ts) + " hai " + (element.classes.length === 1 ? "la seguente lezione: " : "le seguenti lezioni: ");
					element.classes.forEach((classElement : Timetable.ClassDetails) => {
						if (verbose)
							speakOutput += "dalle " + classElement.start.split("T")[1] + " alle " + classElement.end.split("T")[1] + " " + SlotUtils.cleanClassName(classElement.title)[0] + " in " + classElement.aula.edificio + ", ";
						else 
							speakOutput += "alle " + classElement.start.split("T")[1] + " " + SlotUtils.cleanClassName(classElement.title)[0] + ", ";
					});
				}
			});
		} else {
			speakOutput = "Non è pianificata alcuna lezione per ";
			CustomLogger.log("Start: " + start + " End: " + end);
			if (start.toISOString().split("T")[0] === end.toISOString().split("T")[0]) 
				speakOutput += Utils.formatDateForSpeach(start);
			else 
				speakOutput += "il periodo dal " + Utils.formatDateForSpeach(start) + " al " + Utils.formatDateForSpeach(end);
		}

		return handlerInput.responseBuilder.speak(speakOutput).reprompt("La skill è in ascolto").getResponse();
	}
};