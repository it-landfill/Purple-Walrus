"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotUtils = void 0;
const Alexa = require("ask-sdk-core");
const customLogger_1 = require("../utilities/customLogger");
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
            customLogger_1.CustomLogger.warn("Errore imprevisto nel parsing del nome " + slotName + ".");
            return;
        }
        let resolution = resolveStaticAndDynamic(slot.resolutions.resolutionsPerAuthority, slotName);
        // If the slot is not resolved, return undefined.
        if (resolution.dynamic.length == 0 && resolution.static.length == 0) {
            return;
        }
        // If the slot is resolved to a dynamic value, return the dynamic value.
        if (resolution.dynamic.length == 0) {
            customLogger_1.CustomLogger.log("Slot " + slotName + " resolved to static value: " + JSON.stringify(resolution.static));
            return resolution.static;
        }
        return resolution.dynamic;
    }
    slotUtils.getSlotValue = getSlotValue;
    /**
     * Resolve the static and dynamic value of the slot.
     *
     * @param {slu.entityresolution.Resolution[]} slotResolution The slot resolution.
     * @param {string} slotName The slot name.
     * @return {*}  {SlotResolution} The resolved slot.
     */
    function resolveStaticAndDynamic(slotResolution, slotName) {
        let resolution = {
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
        }
        else {
            slotResolution[0].values.forEach((value) => {
                resolution.static.push(value.value);
            });
        }
        return resolution;
    }
})(slotUtils = exports.slotUtils || (exports.slotUtils = {}));
