"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotUtils = void 0;
const Alexa = require("ask-sdk-core");
var slotUtils;
(function (slotUtils) {
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
    function getSlotValue(handlerInput, slotName) {
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
    slotUtils.getSlotValue = getSlotValue;
})(slotUtils = exports.slotUtils || (exports.slotUtils = {}));
