import Alexa = require("ask-sdk-core");
import {slu} from "ask-sdk-model";
import {CustomLogger} from "../utilities/customLogger";

export module slotUtils {
	type SlotResolution = {
		static?: {
			name: string;
			id: string;
		};
		dynamic?: {
			name: string;
			id: string;
		};
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
	export function getSlotValue(handlerInput : Alexa.HandlerInput, slotName : string): {"id": string, "name": string} | undefined {
		const slot = Alexa.getSlot(handlerInput.requestEnvelope, slotName);
		// Check if the slot is defined, if the slot is not defined, return an error.
		if (slot === undefined || slot.resolutions === undefined || slot.resolutions.resolutionsPerAuthority === undefined) {
			CustomLogger.warn("Errore imprevisto nel parsing del nome " + slotName + ".");
			return;
		}

		// Handle the case where the slot does not have dynamic values.
		if (slot.resolutions.resolutionsPerAuthority.length === 1) {

			// If the slot is not resolved, return undefined.
			if (slot.resolutions.resolutionsPerAuthority[0].status.code === "ER_SUCCESS_MATCH") {
				return {
					"name": slot.resolutions.resolutionsPerAuthority[0].values[0].value.name,
					"id": slot.resolutions.resolutionsPerAuthority[0].values[0].value.id
				}
			} else {
				CustomLogger.warn("Impossibile risolvere il valore " + slot.value + " per il campo " + slotName + ".");
				return;
			}

		}


		// Handle the case where the slot has dynamic values.
		let resolution = resolveStaticAndDynamic(slot.resolutions.resolutionsPerAuthority, slotName);
		
		// If the slot is not resolved, return undefined.
		if (resolution.dynamic === undefined && resolution.static === undefined) {
			return;
		}

		// If the slot is resolved to a dynamic value, return the dynamic value.
		if (resolution.dynamic === undefined) {
			CustomLogger.log("Slot " + slotName + " resolved to static value: " + JSON.stringify(resolution.static));
			return resolution.static;
		}

		return resolution.dynamic;
	}

	
	/**
	 * Resolve the static and dynamic value of the slot.
	 *
	 * @param {slu.entityresolution.Resolution[]} slotResolution The slot resolution.
	 * @param {string} slotName The slot name.
	 * @return {*}  {SlotResolution} The resolved slot.
	 */
	function resolveStaticAndDynamic(slotResolution : slu.entityresolution.Resolution[], slotName: string): SlotResolution {
		let resolution: SlotResolution = {};
		
		if (slotResolution.length > 1) {
			const is0Dynamic = slotResolution[0].authority === "amzn1.er-authority.echo-sdk.dynamic";
			// Check if the slot is dynamic or static and get the value. 
			if (slotResolution[(is0Dynamic ? 0 : 1)].status.code === "ER_SUCCESS_MATCH") {
				resolution.dynamic = slotResolution[(is0Dynamic ? 0 : 1)].values[0].value;
			}

			if (slotResolution[(is0Dynamic ? 1 : 0)].status.code === "ER_SUCCESS_MATCH") {
				resolution.static = slotResolution[(is0Dynamic ? 1 : 0)].values[0].value;
			}
		}

		return resolution;
	}
}
