import Alexa = require("ask-sdk-core");
import {SlotValue, slu} from "ask-sdk-model";
import {CustomLogger} from "../utilities/customLogger";
import { Timetable } from "./timetable";

const AmazonDateParser = require("amazon-date-parser");

export module SlotUtils {
	type SlotResolution = {
		static: {
			name: string;
			id: string;
		}[];
		dynamic: {
			name: string;
			id: string;
		}[];
	};

	/**
	 * Get the slot value resolution from the specified slot.
	 * If no slot is found, return undefined.
	 * If no slot resolution is found, return undefined.
	 *
	 * @export
	 * @param {Alexa.HandlerInput} handlerInput The input received by the intent handler.
	 * @param {string} slotName Name of the slot to get the value from.
	 * @return {*}  {({"name": string, "id":string} | undefined)}
	 */
	export function getSlotValue(handlerInput : Alexa.HandlerInput, slotName : string): | {
		id: string;
		name: string;
	}[] | undefined {
		const slot = Alexa.getSlot(handlerInput.requestEnvelope, slotName);
		// Check if the slot is defined, if the slot is not defined, return undefined.
		if (slot === undefined) {
			CustomLogger.log("Slot " + slotName + " is undefined.");
			return;
		}

		const hasRelolution = !(slot.resolutions === undefined);

		if (hasRelolution) {
			// This is a slot with resolutions.

			if (slot.resolutions && slot.resolutions.resolutionsPerAuthority) {
				let resolution = resolveStaticAndDynamic(slot.resolutions.resolutionsPerAuthority, slotName);

				// If the slot is not resolved, return undefined.
				if (resolution.dynamic.length == 0 && resolution.static.length == 0) {
					return;
				}

				// If the slot is resolved to a dynamic value, return the dynamic value.
				if (resolution.dynamic.length == 0) {
					CustomLogger.verbose("Slot " + slotName + " resolved to static value: " + JSON.stringify(resolution.static));
					return resolution.static;
				}

				CustomLogger.verbose("Slot " + slotName + " resolved to dynamic value: " + JSON.stringify(resolution.dynamic));
				return resolution.dynamic;
			} else {
				// Slot has resolution but no resolutionsPerAuthority
				CustomLogger.verbose("Slot resolution returned an empty resolution " + slotName + ". " + JSON.stringify(slot));
				return;
			}
		} else {
			// This is a slot with strong types and no resolution
			if (slot.slotValue) {
				// If the slotValue field is not empty, resolve the slot.
				let resolution = resolveSlots(slot.slotValue, slotName);
				CustomLogger.verbose("Slot " + slotName + " resolved to value: " + JSON.stringify(resolution));
				return resolution;
			} else {
				CustomLogger.warn("Slot " + slotName + " has no valid resolution technique. " + JSON.stringify(slot));
				return;
			}
		}
	}

	/**
	 * Resolve the slot value when there is no resolution field.
	 *
	 * @param {SlotValue} slotValue The slot value.
	 * @param {string} slotName The slot name.
	 * @return {*}  {{
	 * 		id: string;
	 * 		name: string;
	 * 	}[]}
	 */
	function resolveSlots(slotValue : SlotValue, slotName : string): {
		id: string;
		name: string;
	}[]{
		/*
		SlotValues can be 2 things:
		- Simple: Value is one element
		- List: Value is a list of SlotValues
		*/

		// ---- Simple Slot ----
		if (slotValue.type === "Simple") {
			const slotVal = slotValue.value;

			if (slotVal) {
				return [
					{
						id: "-1",
						name: slotVal
					}
				];
			}
		}

		// ---- List Slot ---- Recursion here we go!
		if (slotValue.type === "List") {
			const slotValList = slotValue.values;

			let returnList: {
				id: string;
				name: string;
			}[] = [];

			slotValList.forEach((slotVal) => {
				returnList = returnList.concat(resolveSlots(slotVal, slotName));
			});

			return returnList;
		}

		return [];
	}

	/**
	 * Resolve the static and dynamic value of the slot.
	 *
	 * @param {slu.entityresolution.Resolution[]} slotResolution The slot resolution.
	 * @param {string} slotName The slot name.
	 * @return {*}  {SlotResolution} The resolved slot.
	 */
	function resolveStaticAndDynamic(slotResolution : slu.entityresolution.Resolution[], slotName : string): SlotResolution {
		let resolution: SlotResolution = {
			static: [],
			dynamic: []
		};

		// Assume that if there is only one resolution, it is static.
		if (slotResolution.length > 1) {
			const is0Dynamic = slotResolution[0].authority === "amzn1.er-authority.echo-sdk.dynamic";
			// Check if the slot is dynamic or static and get the value.
			if (slotResolution[is0Dynamic ? 0 : 1].status.code === "ER_SUCCESS_MATCH") {
				slotResolution[is0Dynamic ? 0 : 1].values.forEach((value) => {
					resolution.dynamic.push(value.value);
				});
			}

			if (slotResolution[is0Dynamic ? 1 : 0].status.code === "ER_SUCCESS_MATCH") {
				slotResolution[is0Dynamic ? 1 : 0].values.forEach((value) => {
					resolution.static.push(value.value);
				});
			}
		} else {
			slotResolution[0].values.forEach((value) => {
				resolution.static.push(value.value);
			});
		}

		return resolution;
	}

	/**
	 * Parse the amazon date format to a start and end date format.
	 *
	 * @export
	 * @param {string} dateString The date string to parse.
	 * @return {*}  {({"startDate": Date, "endDate": Date} | undefined)} The parsed date.
	 */
	export function dateParser(dateString : string): {
		startDate: Date;
		endDate: Date
	} | undefined {
		const timespanDate = new AmazonDateParser(dateString);
		if (timespanDate) 
			CustomLogger.verbose("Date parsed: " + JSON.stringify(timespanDate) + ". Original date: " + dateString);
		else 
			CustomLogger.warn("Date could not be parsed: " + dateString);
		return timespanDate;
	}

	/**
	 * Resolves a class ID to a class element.
	 *
	 * @param {ClassDictionary} classes The classes list
	 * @param {string} classID The class ID to resolve
	 * @return {*}  {(ClassElement | undefined)} The class element or undefined if not found
	 */
	function resolveClassID(classes : Timetable.ClassDictionary, classID : string): Timetable.ClassElement | undefined {
		// Check if the class is in the classes list, if not return undefined
		if (!(classID in classes)) {
			CustomLogger.warn("Class " + classID + " not found in classes list.");
			return;
		}

		// If the class is in the classes list, return it
		return classes[classID];
	}

	/**
	 * Resolves a list of class IDs to a list of class elements.
	 *
	 * @export
	 * @param {string[]} classIDList The list of class IDs to resolve
	 * @return {*}  {Promise<ClassElement[]>} The list of class elements
	 */
	export async function resolveClassIDList(classIDList : string[]): Promise<Timetable.ClassElement[]> {
		const classes = await Timetable.getClassesList();

		// If the classes list is undefined, return an empty array
		if (classes === undefined) {
			CustomLogger.warn("Classes list is undefined.");
			return [];
		}

		// Resolve the class ID for each element and return the list removing the elements that failed to resolve (are undefined)
		return classIDList.map((el) => resolveClassID(classes, el)).filter((el) => el !== undefined)as Timetable.ClassElement[];
	}

	/**
	 * Formats a class name to a more readable format.
	 * Example: "LABORATORIO DI MAKING / (2) Modulo 2" -> "Laboratorio di Making"
	 * Example: "LABORATORIO DI MAKING" -> "Laboratorio di Making"
	 *
	 * @export
	 * @param {string} name The class name to format
	 * @return {*}  {string[]} An array with two elements, the formatted name and the module number (string)
	 */
	export function cleanClassName(name : string): string[]{
		// Regex to match  / (2) Modulo 2
		const regex = /(.+)(?: \/ \((\d)\) Modulo \d)/;
		const match = regex.exec(name);
		// If the regex matches, return the first group (The class name without  / (2) Modulo 2), otherwise return the original name (It does not have a
		// module number) Also, trim the name and capitalize the first letter
		let cleanName = (match !== null ? match[1] : name).trim().toLowerCase();
		cleanName = cleanName[0].toUpperCase() + cleanName.slice(1);

		// Return two parameters, the clean name and the module number (string)
		return [
			cleanName, match !== null ? match[2] : "0"
		];
	}
}
