import Alexa = require("ask-sdk-core");
export declare module SlotUtils {
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
    function getSlotValue(handlerInput: Alexa.HandlerInput, slotName: string): {
        id: string;
        name: string;
    }[] | undefined;
}
