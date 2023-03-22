import Alexa = require("ask-sdk-core");
import { Timetable } from "./timetable";
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
    /**
     * Parse the amazon date format to a start and end date format.
     *
     * @export
     * @param {string} dateString The date string to parse.
     * @return {*}  {({"startDate": Date, "endDate": Date} | undefined)} The parsed date.
     */
    function dateParser(dateString: string): {
        startDate: Date;
        endDate: Date;
    } | undefined;
    /**
     * Resolves a list of class IDs to a list of class elements.
     *
     * @export
     * @param {string[]} classIDList The list of class IDs to resolve
     * @return {*}  {Promise<ClassElement[]>} The list of class elements
     */
    function resolveClassIDList(classIDList: string[]): Promise<Timetable.ClassElement[]>;
    /**
     * Formats a class name to a more readable format.
     * Example: "LABORATORIO DI MAKING / (2) Modulo 2" -> "Laboratorio di Making"
     * Example: "LABORATORIO DI MAKING" -> "Laboratorio di Making"
     *
     * @export
     * @param {string} name The class name to format
     * @return {*}  {string[]} An array with two elements, the formatted name and the module number (string)
     */
    function cleanClassName(name: string): string[];
}
