"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotUtils = void 0;
const Alexa = require("ask-sdk-core");
const customLogger_1 = require("../utilities/customLogger");
var SlotUtils;
(function (SlotUtils) {
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
        // Check if the slot is defined, if the slot is not defined, return undefined.
        if (slot === undefined) {
            customLogger_1.CustomLogger.log("Slot " + slotName + " is undefined.");
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
                    customLogger_1.CustomLogger.verbose("Slot " + slotName + " resolved to static value: " + JSON.stringify(resolution.static));
                    return resolution.static;
                }
                customLogger_1.CustomLogger.verbose("Slot " + slotName + " resolved to dynamic value: " + JSON.stringify(resolution.dynamic));
                return resolution.dynamic;
            }
            else {
                // Slot has resolution but no resolutionsPerAuthority
                customLogger_1.CustomLogger.verbose("Slot resolution returned an empty resolution " + slotName + ". " + JSON.stringify(slot));
                return;
            }
        }
        else {
            // This is a slot with strong types and no resolution
            if (slot.slotValue) {
                // If the slotValue field is not empty, resolve the slot.
                let resolution = resolveSlots(slot.slotValue, slotName);
                customLogger_1.CustomLogger.verbose("Slot " + slotName + " resolved to value: " + JSON.stringify(resolution));
                return resolution;
            }
            else {
                customLogger_1.CustomLogger.warn("Slot " + slotName + " has no valid resolution technique. " + JSON.stringify(slot));
                return;
            }
        }
    }
    SlotUtils.getSlotValue = getSlotValue;
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
    function resolveSlots(slotValue, slotName) {
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
            let returnList = [];
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
})(SlotUtils = exports.SlotUtils || (exports.SlotUtils = {}));
