import Alexa = require("ask-sdk-core");

export module slotUtils {
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
	export function getSlotValue(handlerInput : Alexa.HandlerInput, slotName : string): {
		name: string;
		id: string
	} | undefined {
		const slot = Alexa.getSlot(handlerInput.requestEnvelope, slotName);
		// Check if the slot is defined, if the slot is not defined, return an error.
		if (slot === undefined || slot.resolutions === undefined || slot.resolutions.resolutionsPerAuthority === undefined) {
			console.warn("Errore imprevisto nel parsing del nome " + slotName + ".");
			return;
		}

		// Check if the slot matches a course, if the slot does not match a course, return an error.
		if (slot.resolutions.resolutionsPerAuthority[0].status.code !== "ER_SUCCESS_MATCH") {
			console.log(`Non ho trovato riscontri con ${slotName} di nome ${slot.value}.`);
			return;
		}

		// Get the slot value from the slot.
		const slotValue = slot.resolutions.resolutionsPerAuthority[0].values[0].value;
		return slotValue;
	}
}
