export declare module Timetable {
    export type ClassElement = {
        code: string;
        name: string;
        year: string;
        curriculum: string;
        mod1?: string;
        mod2?: string;
    };
    type ClassDictionary = {
        [key: string]: ClassElement;
    };
    /**
     * Returns the timetable for the given parameters
     * @param year Example: "2"
     * @param curricula Example: "A58-000"
     * @param start
     * @param end
     * @param insegnamenti
     * @returns {Promise<object[]>} The timetable
     */
    export function getTimetable(year: string, curricula: string, start: Date, end: Date, insegnamenti?: string[]): Promise<object[]>;
    /**
     * Returns the available classes for the current year.
     * The classes are either loadaed from the database or fetched from the university website if not present or to old.
     *
     * @export
     * @return {*}  {(Promise < object | undefined >)}
     */
    export function getClassesList(): Promise<ClassDictionary | undefined>;
    /**
     * Resolves a list of class IDs to a list of class elements.
     *
     * @export
     * @param {string[]} classIDList The list of class IDs to resolve
     * @return {*}  {Promise<ClassElement[]>} The list of class elements
     */
    export function resolveClassIDList(classIDList: string[]): Promise<ClassElement[]>;
    /**
     * Generates the dynamic class entries for the class picker.
     * The entries are generated from the classes list and will be used on skill launch.
     *
     * @export
     * @return {*}  {(Promise < {
     * 		id: string;
     * 		name: {
     * 			value: string
     * 		}
     * 	}[] | undefined >)}
     */
    export function generateDynamicClassEntries(): Promise<{
        id: string;
        name: {
            value: string;
        };
    }[] | undefined>;
    export {};
}
